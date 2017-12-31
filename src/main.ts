import { ConfigurationStorage } from "./storage/ConfigurationStorage";

export class Main {

    public static run(): void {
        ConfigurationStorage.createDefaultIfNeeded().then(() => {
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