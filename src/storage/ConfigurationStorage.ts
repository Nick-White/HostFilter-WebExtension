import { Configuration, LogEntryType } from "../model/Configuration";
import StorageObject = browser.storage.StorageObject;

export class ConfigurationStorage {

    private static readonly STORAGE_KEY: string = "configuration";

    public static createDefaultIfNeeded(): Promise<void> {
        return new Promise<void>((resolve: () => void) => {
            this.get().then((configuration: Configuration | null) => {
                if (configuration === null) {
                    this.createDefault().then(() => {
                        resolve();
                    });
                } else {
                    resolve();
                }
            });
        });
    }
    
    public static get(): Promise<Configuration | null> {
        return new Promise<Configuration | null>((resolve: (configuration: Configuration | null) => void) => {
            browser.storage.local.get(this.STORAGE_KEY).then((storage: StorageObject) => {
                let configuration: Configuration | null = null;
                if (this.STORAGE_KEY in storage) {
                    configuration = (storage[this.STORAGE_KEY] as any) as Configuration;
                }
                resolve(configuration);
            });
        });
    }

    public static set(configuration: Configuration): Promise<void> {
        return new Promise<void>((resolve: () => void) => {
            let storage = {} as StorageObject;
            storage[this.STORAGE_KEY] = configuration as any;

            browser.storage.local.set(storage).then(() => {
                resolve();
            });
        });
    }

    private static createDefault(): Promise<void> {
        return new Promise<void>((resolve: () => void) => {
            let defaultConfiguration: Configuration = {
                logEntryType:  LogEntryType.HOST,
                logAllowed: false,
                logBlocked: false,
                logDistinct: true
            };
            this.set(defaultConfiguration).then(() => {
                resolve();
            });
        });
    }
}