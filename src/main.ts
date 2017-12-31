import { ConfigurationStorage } from "./storage/ConfigurationStorage";
import { HostsStorage } from "./storage/HostsStorage";
import { Hosts } from "./model/Hosts";
import { RequestListenerConfigurer } from "./RequestListenerConfigurer";

export class Main {

    public static run(): void {
        Promise.all([
            ConfigurationStorage.getInstance().createDefaultIfNeeded(),
            HostsStorage.getInstance().createDefaultIfNeeded()
        ]).then(() => {
            HostsStorage.getInstance().get().then((hosts: Hosts | null) => {
                if (hosts === null) {
                    throw new Error("Hosts not found.");
                }
                new RequestListenerConfigurer(hosts).configure();
            });
        });
    }
}

Main.run();