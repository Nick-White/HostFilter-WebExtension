import { Configuration, LogEntryType } from "./Configuration";
import StorageObject = browser.storage.StorageObject;

export class ConfigurationManager {

    private static readonly STORAGE_KEY: string = "configuration";

    public static createDefaultIfNeeded(): Promise<void> {
        var self = this;
        return new Promise<void>((resolve: any) => {
            self.get().then((configuration: Configuration | null) => {
                if (configuration === null) {
                    self.createDefault().then(() => {
                        resolve();
                    });
                } else {
                    resolve();
                }
            });
        });
    }
    
    public static get(): Promise<Configuration | null> {
        var self = this;
        return new Promise<Configuration | null>((resolve: any) => {
            browser.storage.local.get(self.STORAGE_KEY).then((storage: StorageObject) => {
                let configuration: Configuration | null = null;
                if (self.STORAGE_KEY in storage) {
                    configuration = (storage[self.STORAGE_KEY] as any) as Configuration;
                }
                resolve(configuration);
            });
        });
    }

    public static set(configuration: Configuration): Promise<void> {
        var self = this;
        return new Promise((resolve) => {
            let storage = {} as StorageObject;
            storage[self.STORAGE_KEY] = configuration as any;

            browser.storage.local.set(storage).then(() => {
                resolve();
            });
        });
    }

    private static createDefault(): Promise<void> {
        var self = this;
        return new Promise((resolve: any) => {
            let defaultConfiguration: Configuration = {
                logEntryType:  LogEntryType.HOST,
                logAllowed: false,
                logBlocked: true,
                logDistinct: true
            };
            self.set(defaultConfiguration).then(() => {
                resolve();
            });
        });
    }
}