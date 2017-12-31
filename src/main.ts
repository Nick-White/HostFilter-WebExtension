import { ConfigurationStorage } from "./storage/ConfigurationStorage";
import { HostsStorage } from "./storage/HostsStorage";
import { Hosts } from "./model/Hosts";
import { RequestListenerConfigurer } from "./RequestListenerConfigurer";
import { Configuration } from "./model/Configuration";
import { Log } from "./Log";

export class Main {

    public static run(): void {
        Promise.all([
            ConfigurationStorage.getInstance().createDefaultIfNeeded(),
            HostsStorage.getInstance().createDefaultIfNeeded()
        ]).then(() => {
            let configuration: Configuration;
            let hosts: Hosts;
            Promise.all([
                ConfigurationStorage.getInstance().get().then((configurationParameter: Configuration | null) => {
                    if (configurationParameter === null) {
                        throw new Error("Configuration not found.");
                    }
                    configuration = configurationParameter;
                }),
                HostsStorage.getInstance().get().then((hostsParameter: Hosts | null) => {
                    if (hostsParameter === null) {
                        throw new Error("Hosts not found.");
                    }
                    hosts = hostsParameter;
                })
            ]).then((): void => {
                Log.init(configuration);
                browser.runtime.getBackgroundPage().then((window: Window) => {
                    (<any>window).log = Log.getInstance();
                });
                new RequestListenerConfigurer(hosts).configure();
            });
            
        });
    }
}

Main.run();