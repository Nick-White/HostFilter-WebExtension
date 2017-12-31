import { Hosts } from "./model/Hosts";
import { Set } from "typescript-collections";
import { CollectionUtils } from "./utils/CollectionUtils";

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
        browser.webRequest.onBeforeRequest.addListener((details: {url: string}) => {
            return (this.isBlockedHost(details.url)) ? RequestListenerConfigurer.BLOCKING_RESPONSE : null;
        }, {
            urls: ["<all_urls>"]
        }, ["blocking"]);
    }

    private isBlockedHost(url: string): boolean {
        var host = new URL(url).hostname;
        return this.blockedHosts.contains(host);
    }
}