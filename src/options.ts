import { Configuration, LogEntryType } from "./model/Configuration";
import { ConfigurationStorage } from "./storage/ConfigurationStorage";
import { JQueryFieldUtils } from "./utils/JQueryFieldUtils";
import { BooleanUtils } from "./utils/BooleanUtils";
import PlatformInfo = browser.runtime.PlatformInfo;
import * as $ from "jquery";
import * as JSZip from "jszip";
import { JSZipObject } from "jszip";
import { HostsFromZipReader } from "./HostsFromZipReader";
import { Hosts } from "./model/Hosts";
import { HostsStorage } from "./storage/HostsStorage";
import { HostsToZipWriter } from "./HostsToZipWriter";

class ConfigurationAspect {

    private static $logEntryType: JQuery<HTMLElement>;
    private static $logAllowedRadios: JQuery<HTMLElement>;
    private static $logBlockedRadios: JQuery<HTMLElement>;
    private static $logDistinctRadios: JQuery<HTMLElement>;

    private static $saveButton: JQuery<HTMLElement>;

    public static init(): void {
        this.initReferences();
        this.initActions();
        this.populate();
    }

    private static initReferences(): void {
        this.$logEntryType = $("select[name='logEntryType']");
        this.$logAllowedRadios = $("input[type='radio'][name='logAllowed']");
        this.$logBlockedRadios = $("input[type='radio'][name='logBlocked']");
        this.$logDistinctRadios = $("input[type='radio'][name='logDistinct']");

        this.$saveButton = $("#saveButton");
    }

    private static initActions(): void {
        this.$saveButton.on("click", () => {
            this.save();
        });
    }

    private static save(): void {
        let configuration: Configuration = {
            logEntryType: <LogEntryType>(<string>this.$logEntryType.val()),
            logAllowed: BooleanUtils.fromString(JQueryFieldUtils.getCheckedRadioValue(this.$logAllowedRadios)),
            logBlocked: BooleanUtils.fromString(JQueryFieldUtils.getCheckedRadioValue(this.$logBlockedRadios)),
            logDistinct: BooleanUtils.fromString(JQueryFieldUtils.getCheckedRadioValue(this.$logDistinctRadios))
        };
        ConfigurationStorage.getInstance().set(configuration).then((): void => {
            browser.runtime.reload();
        });
    }

    public static populate(): void {
        ConfigurationStorage.getInstance().get().then((configuration: Configuration | null) => {
            if (configuration == null) {
                throw new Error("Configuration not found!");
            }
            this.$logEntryType.val(LogEntryType[configuration.logEntryType]);
            JQueryFieldUtils.setCheckedRadio(this.$logAllowedRadios, BooleanUtils.toString(configuration.logAllowed));
            JQueryFieldUtils.setCheckedRadio(this.$logBlockedRadios, BooleanUtils.toString(configuration.logBlocked));
            JQueryFieldUtils.setCheckedRadio(this.$logDistinctRadios, BooleanUtils.toString(configuration.logDistinct));
        });
    }
}

class ImportHostsAspect {

    private static $field: JQuery<HTMLInputElement>;
    private static $button: JQuery<HTMLElement>;

    public static init(): void {
        this.initReferences();
        this.initActions();
    }

    private static initReferences(): void {
        this.$field = <JQuery<HTMLInputElement>>$("#importHostsField");
        this.$button = $("#importHostsButton");
    }

    private static initActions(): void {
        this.$button.on("click", () => {
            this.import();
        });
    }

    private static import(): void {
        let file = this.getFile();
        let fileReader = new FileReader();
        fileReader.onload = () => {
            let fileContent: ArrayBuffer = fileReader.result;
            JSZip.loadAsync(fileContent).then((zip: JSZip) => {
                new HostsFromZipReader(zip).read().then((hosts: Hosts) => {
                    HostsStorage.getInstance().set(hosts).then((): void => {
                        browser.runtime.reload();
                    });
                });
            });
        };
        fileReader.readAsArrayBuffer(file);
    }

    private static getFile(): File {
        let files: FileList = <FileList>this.$field[0].files;
        if (files.length === 0) {
            throw new Error("No import file selected.");
        }
        if (files.length > 1) {
            throw new Error("Only one import file needs to be selected.");
        }
        return files[0];
    }
}

class ExportHostsAspect {

    private static $exportHostsButton: JQuery<HTMLElement>;

    public static init(): void {
        this.initReferences();
        this.initActions();
    }

    private static initReferences(): void {
        this.$exportHostsButton = $("#exportHostsButton");
    }

    private static initActions(): void {
        this.$exportHostsButton.on("click", (): void => {
            HostsStorage.getInstance().get().then((hosts: Hosts | null) => {
                if (hosts === null) {
                    throw new Error("Hosts not found.");
                }
                new HostsToZipWriter(hosts).write().then((content: ArrayBuffer) => {
                    var url = URL.createObjectURL(new Blob([content]));
                    this.determineIfChooseDownloadPathSupported().then((chooseDownloadPathSupported: boolean): void => {
                        browser.downloads.download({
                            url: url,
                            filename: "HostFilter (config).zip",
                            saveAs: chooseDownloadPathSupported
                        });
                    });
                });
            });
        });
    }

    private static determineIfChooseDownloadPathSupported(): Promise<boolean> {
        return new Promise<boolean>((resolve: (supported: boolean) => void): void => {
            browser.runtime.getPlatformInfo().then((info: PlatformInfo): void => {
                resolve(info.os !== "android");
            });
        });
    }
}

class ViewLogAspect {

    private static $viewLogButton: JQuery<HTMLElement>;

    public static init(): void {
        this.initReferences();
        this.initActions();
    }

    private static initReferences(): void {
        this.$viewLogButton = $("#viewLogButton");
    }

    private static initActions(): void {
        this.$viewLogButton.on("click", () => {
            browser.tabs.create({
                active: true,
                url: "/logEntries/logEntries.html"
            });
        });
    }
}

$(document).ready(function() {
    ConfigurationAspect.init();
    ImportHostsAspect.init();
    ExportHostsAspect.init();
    ViewLogAspect.init();
});