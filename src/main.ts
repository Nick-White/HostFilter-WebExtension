import { ConfigurationManager } from "./ConfigurationManager";

export class Main {

    public static run(): void {
        ConfigurationManager.createDefaultIfNeeded().then(() => {
            var blockedHosts = ["cdn.gsmarena.com"];
            blockedHosts.forEach((blockedHost) => {
                browser.webRequest.onBeforeRequest.addListener(function(details) {
                    return {
                        redirectUrl: browser.extension.getURL("empty_content/text.txt")
                    };
                }, {
                    urls: ["*://" + blockedHost + "/*"]
                }, ["blocking"]);
            });
        });
    }
}

Main.run();