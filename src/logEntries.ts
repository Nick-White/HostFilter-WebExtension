import * as $ from "jquery";
import Event = JQuery.Event;
import { Log, LogEntry } from "./Log";
import { HostsStorage } from "./storage/HostsStorage";
import { Hosts } from "./model/Hosts";
import { ArrayUtils } from "./utils/ArrayUtils";

class LogEntriesPage {

    private static readonly ADD_TO_BLACKLIST_BUTTON_CLASS: string = "addToBlacklistButton";
    private static readonly ADD_TO_WHITELIST_BUTTON_CLASS: string = "addToWhitelistButton";

    private static $allowedTableBody: JQuery<HTMLElement>;
    private static $blockedTableBody: JQuery<HTMLElement>;
    private static $saveButton: JQuery<HTMLElement>;

    private static hostsToAllow: string[];
    private static hostsToBlock: string[];

    public static init(): void {
        this.initReferences();
        this.initActions();
        this.populate();
    }

    private static initReferences(): void {
        this.$allowedTableBody = $("#allowedTableBody");
        this.$blockedTableBody = $("#blockedTableBody");
        this.$saveButton = $("#saveButton");

        this.hostsToAllow = [];
        this.hostsToBlock = [];
    }

    private static initActions(): void {
        this.$allowedTableBody.on("click", "." + this.ADD_TO_BLACKLIST_BUTTON_CLASS, (event: Event<HTMLElement>): void => {
            this.markHost(event, this.hostsToBlock, "(Will be blocked)");
        });
        this.$blockedTableBody.on("click", "." + this.ADD_TO_WHITELIST_BUTTON_CLASS, (event: Event<HTMLElement>): void => {
            this.markHost(event, this.hostsToAllow, "(Will be allowed)");
        });
        this.$saveButton.on("click", (): void => {
            if ((this.hostsToAllow.length === 0) && (this.hostsToBlock.length === 0)) {
                return;
            }
            HostsStorage.getInstance().get().then((hosts: Hosts | null) => {
                if (hosts === null) {
                    throw new Error("Hosts not found.");
                }

                ArrayUtils.addAll(hosts.blacklistManualExtra, this.hostsToBlock);
                ArrayUtils.removeAll(hosts.blacklistManualExtra, this.hostsToAllow);

                ArrayUtils.addAll(hosts.whitelistExtra, this.hostsToAllow);
                ArrayUtils.removeAll(hosts.whitelistExtra, this.hostsToBlock);
                
                HostsStorage.getInstance().set(hosts).then((): void => {
                    browser.runtime.reload();
                });
            });
    })
    }

    private static markHost(event: Event<HTMLElement>, hosts: string[], replacementText: string): void {
        let $button: JQuery<HTMLElement> = $(event.target);
        let host = $button.closest("td").data("host");
        hosts.push(host);
        $button.replaceWith(replacementText);
    }

    private static populate(): void {
        browser.runtime.getBackgroundPage().then((window: Window) => {
            let log: Log = (<any>window).log;
    
            let allowedButtonHtml: string = "<button class='" + this.ADD_TO_BLACKLIST_BUTTON_CLASS + "'>Block</button>";
            this.populateTableBody(this.$allowedTableBody, log.allowedEntries, allowedButtonHtml);
    
            let blockedButtonHtml: string = "<button class='" + this.ADD_TO_WHITELIST_BUTTON_CLASS + "'>Allow</button>";
            this.populateTableBody(this.$blockedTableBody, log.blockedEntries, blockedButtonHtml);
        });
    }

    private static populateTableBody($tableBody: JQuery<HTMLElement>, entries: LogEntry[], buttonHtml: string): void {
        $tableBody.html(this.generateTableBodyInnerHtml(entries, buttonHtml));
    }

    private static generateTableBodyInnerHtml(entries: LogEntry[], buttonHtml: string): string {
        let bodyInnerHtml: string = "";
        entries.forEach((entry: LogEntry) => {
            bodyInnerHtml += this.generateRowHtml(entry, buttonHtml);
        });
        return bodyInnerHtml;
    }

    private static generateRowHtml(entry: LogEntry, buttonHtml: string): string {
        return "<tr><td>" + entry.text + "</td><td data-host='" + entry.host + "'>" + buttonHtml + "</td></tr>";
    }
}

$(document).ready(() => {
    LogEntriesPage.init();
});