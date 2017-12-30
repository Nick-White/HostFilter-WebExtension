class Main {

    run(): void {
        browser.notifications.create("", {
            type: "basic",
            title: "Message",
            message: "It works!"
        });
    }
}

new Main().run();