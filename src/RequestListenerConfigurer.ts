import { Hosts } from "./model/Hosts";
import { Set } from "typescript-collections";
import { CollectionUtils } from "./utils/CollectionUtils";
import BlockingResponse = browser.webRequest.BlockingResponse;
import Tab = browser.tabs.Tab;
import { Configuration } from "./model/Configuration";
import { Log } from "./Log";
import { FilterOutcome } from "./model/FilterOutcome";

export class RequestListenerConfigurer {

    private static readonly BLOCKING_RESPONSE = {
        redirectUrl: browser.extension.getURL("empty_content/text.txt")
    };
    
    private readonly blockedHosts: Set<string>;

    public constructor(hosts: Hosts) {
        this.blockedHosts = new Set();
        CollectionUtils.addAll(this.blockedHosts, [hosts.blacklistBulk, hosts.blacklistManual, hosts.blacklistManualExtra]);
        CollectionUtils.removeAll(this.blockedHosts, [hosts.whitelist, hosts.whitelistExtra]);
    }

    public configure(): void {
        let log: Log = Log.getInstance();
        browser.webRequest.onBeforeRequest.addListener((details: {tabId: number, url: string}): Promise<BlockingResponse> => {
            return new Promise<BlockingResponse>((resolve: (response: BlockingResponse) => void) => {
                let url: string = details.url;
                let host: string = this.getHost(url);
                if (this.isBlockedHost(host)) {
                    log.log(url, host, FilterOutcome.BLOCKED);
                    browser.tabs.get(details.tabId).then((tab: Tab) => {
                        if (this.isFreshPopup(tab)) {
                            browser.tabs.remove(details.tabId);
                        }
                        resolve(RequestListenerConfigurer.BLOCKING_RESPONSE);
                    });
                } else {
                    log.log(url, host, FilterOutcome.ALLOWED);
                    resolve({});
                }
            });
        }, {
            urls: ["<all_urls>"]
        }, ["blocking"]);
    }

    private isBlockedHost(host: string): boolean {
        return this.blockedHosts.contains(host);
    }

    private getHost(url: string): string {
        return new URL(url).hostname;
    }

    private isFreshPopup(tab: Tab): boolean {
        return (tab.url === 'about:blank');
    }
}