class Main {

    public run(): void {
        var blockedHosts = ["cdn.gsmarena.com"];
        blockedHosts.forEach(function(blockedHost) {
            browser.webRequest.onBeforeRequest.addListener(function(details) {
                return {
                    redirectUrl: browser.extension.getURL("empty_content/text.txt")
                };
            }, {
                urls: ["*://" + blockedHost + "/*"]
            }, ["blocking"]);
        });
    }
}

new Main().run();