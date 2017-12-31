import { Hosts } from "../model/Hosts";
import StorageObject = browser.storage.StorageObject;

export class HostsStorage {

    private static readonly STORAGE_KEY: string = "hosts";

    public static set(hosts: Hosts): void {
        let storage = {} as StorageObject;
        storage[this.STORAGE_KEY] = hosts as any;
        browser.storage.local.set(storage);
    }
}