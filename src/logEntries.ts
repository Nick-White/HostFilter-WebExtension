import * as $ from "jquery";
import { Log } from "./Log";

class LogEntriesPage {

    private static $allowedTableBody: JQuery<HTMLElement>;
    private static $blockedTableBody: JQuery<HTMLElement>;

    public static init(): void {
        this.initReferences();
        this.populate();
    }

    private static initReferences(): void {
        this.$allowedTableBody = $("#allowedTableBody");
        this.$blockedTableBody = $("#blockedTableBody");
    }

    private static populate(): void {
        browser.runtime.getBackgroundPage().then((window: Window) => {
            let log: Log = (<any>window).log;
    
            let allowedButtonHtml: string = "<button class='addToBlacklistButton'>Block</button>";
            this.populateTableBody(this.$allowedTableBody, log.allowedEntries, allowedButtonHtml);
    
            let blockedButtonHtml: string = "<button class='addToWhitelistButton'>Allow</button>";
            this.populateTableBody(this.$blockedTableBody, log.blockedEntries, blockedButtonHtml);
        });
    }

    private static populateTableBody($tableBody: JQuery<HTMLElement>, entries: string[], buttonHtml: string): void {
        $tableBody.html(this.generateTableBodyInnerHtml(entries, buttonHtml));
    }

    private static generateTableBodyInnerHtml(entries: string[], buttonHtml: string): string {
        let bodyInnerHtml: string = "";
        entries.forEach((entry: string) => {
            bodyInnerHtml += this.generateRowHtml(entry, buttonHtml);
        });
        return bodyInnerHtml;
    }

    private static generateRowHtml(entry: string, buttonHtml: string): string {
        return "<tr><td>" + entry + "</td><td>" + buttonHtml + "</td></tr>";
    }
}

$(document).ready(() => {
    LogEntriesPage.init();
});