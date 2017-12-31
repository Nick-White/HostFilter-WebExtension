import { Hosts } from "../model/Hosts";
import StorageObject = browser.storage.StorageObject;
import { Storage } from "./Storage";

export class HostsStorage extends Storage<Hosts> {

    private static readonly INSTANCE: HostsStorage = new HostsStorage();

    private constructor() {
        super();
    }

    public static getInstance(): HostsStorage {
        return this.INSTANCE;
    }

    protected getKey(): string {
        return "hosts";
    }

    protected generateDefault(): Hosts {
        return {
            blacklistBulk: [],
            blacklistManual: [],
            blacklistManualExtra: [],
            whitelist: []
        };
    }
}