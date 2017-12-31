import { Hosts } from "./model/Hosts";
import { Set } from "typescript-collections";
import { CollectionUtils } from "./utils/CollectionUtils";
import BlockingResponse = browser.webRequest.BlockingResponse;
import Tab = browser.tabs.Tab;

export class RequestListenerConfigurer {

    private static readonly BLOCKING_RESPONSE = {
        redirectUrl: browser.extension.getURL("empty_content/text.txt")
    };
    
    private readonly blockedHosts: Set<string>;

    public constructor(hosts: Hosts) {
        this.blockedHosts = new Set();
        CollectionUtils.addAll(this.blockedHosts, [hosts.blacklistBulk, hosts.blacklistManual, hosts.blacklistManualExtra]);
        CollectionUtils.removeAll(this.blockedHosts, hosts.whitelist);
    }

    public configure(): void {
        browser.webRequest.onBeforeRequest.addListener((details: {tabId: number, url: string}): Promise<BlockingResponse> => {
            return new Promise<BlockingResponse>((resolve: (response: BlockingResponse) => void) => {
                if (this.isBlockedHost(details.url)) {
                    browser.tabs.get(details.tabId).then((tab: Tab) => {
                        if (this.isFreshPopup(tab)) {
                            browser.tabs.remove(details.tabId);
                        }
                        resolve(RequestListenerConfigurer.BLOCKING_RESPONSE);
                    });
                } else {
                    resolve({});
                }
            });
        }, {
            urls: ["<all_urls>"]
        }, ["blocking"]);
    }

    private isBlockedHost(url: string): boolean {
        var host = new URL(url).hostname;
        return this.blockedHosts.contains(host);
    }

    private isFreshPopup(tab: Tab): boolean {
        console.log(tab.url);
        return (tab.url === 'about:blank');
    }
}