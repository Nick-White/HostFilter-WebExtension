import { Configuration, LogEntryType } from "../Configuration";
import { ConfigurationManager } from "../ConfigurationManager";
import { JQueryFieldUtils } from "../JQueryFieldUtils";
import { BooleanUtils } from "../BooleanUtils";
import * as $ from "jquery";

class OptionsPage {

    private static $logEntryType: JQuery<HTMLElement>;
    private static $logAllowedRadios: JQuery<HTMLElement>;
    private static $logBlockedRadios: JQuery<HTMLElement>;
    private static $logDistinctRadios: JQuery<HTMLElement>;

    private static $saveButton: JQuery<HTMLElement>;

    public static init(): void {
        this.initReferences();
        this.initActions();
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
        ConfigurationManager.set(configuration);
    }

    public static populate(): void {
        var self = this;
        ConfigurationManager.get().then((configuration: Configuration | null) => {
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

$(document).ready(function() {
    OptionsPage.init();
    OptionsPage.populate();
});