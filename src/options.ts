import { Configuration, LogEntryType } from "./model/Configuration";
import { ConfigurationStorage } from "./storage/ConfigurationStorage";
import { JQueryFieldUtils } from "./utils/JQueryFieldUtils";
import { BooleanUtils } from "./utils/BooleanUtils";
import * as $ from "jquery";
import * as JSZip from "jszip";
import { JSZipObject } from "jszip";
import { HostsFromZipReader } from "./HostsFromZipReader";
import { Hosts } from "./model/Hosts";
import { HostsStorage } from "./storage/HostsStorage";

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
        var self = this;
        self.$saveButton.on("click", function() {
            self.save();
        });
    }

    private static save(): void {
        let configuration: Configuration = {
            logEntryType: <LogEntryType>(<string>this.$logEntryType.val()),
            logAllowed: BooleanUtils.fromString(JQueryFieldUtils.getCheckedRadioValue(this.$logAllowedRadios)),
            logBlocked: BooleanUtils.fromString(JQueryFieldUtils.getCheckedRadioValue(this.$logBlockedRadios)),
            logDistinct: BooleanUtils.fromString(JQueryFieldUtils.getCheckedRadioValue(this.$logDistinctRadios))
        };
        ConfigurationStorage.set(configuration);
    }

    public static populate(): void {
        var self = this;
        ConfigurationStorage.get().then((configuration: Configuration | null) => {
            if (configuration == null) {
                throw new Error("Configuration not found!");
            }
            self.$logEntryType.val(LogEntryType[configuration.logEntryType]);
            JQueryFieldUtils.setCheckedRadio(self.$logAllowedRadios, BooleanUtils.toString(configuration.logAllowed));
            JQueryFieldUtils.setCheckedRadio(self.$logBlockedRadios, BooleanUtils.toString(configuration.logBlocked));
            JQueryFieldUtils.setCheckedRadio(self.$logDistinctRadios, BooleanUtils.toString(configuration.logDistinct));
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
        var self = this;
        self.$button.on("click", () => {
            self.import();
        });
    }

    private static import(): void {
        let file = this.getFile();
        let fileReader = new FileReader();
        fileReader.onload = () => {
            let fileContent: ArrayBuffer = fileReader.result;
            JSZip.loadAsync(fileContent).then((zip: JSZip) => {
                new HostsFromZipReader(zip).read().then((hosts: Hosts) => {
                    HostsStorage.set(hosts);
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

$(document).ready(function() {
    ConfigurationAspect.init();
    ImportHostsAspect.init();
});