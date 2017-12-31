import { Configuration, LogEntryType } from "../model/Configuration";
import StorageObject = browser.storage.StorageObject;
import { Storage } from "./Storage";

export class ConfigurationStorage extends Storage<Configuration> {

    private static readonly INSTANCE: ConfigurationStorage = new ConfigurationStorage();

    private constructor() {
        super();
    }

    public static getInstance(): ConfigurationStorage {
        return this.INSTANCE;
    }

    protected getKey(): string {
        return "hosts";
    }

    protected generateDefault(): Configuration {
        return {
            logEntryType: LogEntryType.HOST,
            logAllowed: false,
            logBlocked: false,
            logDistinct: true
        };
    }
}