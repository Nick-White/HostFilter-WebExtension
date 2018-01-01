import * as JSZip from "jszip";
import { Hosts } from "./model/Hosts";
import { HostsFileNames } from "./model/HostsFileNames";

export class HostsToZipWriter {

    private readonly hosts: Hosts;

    public constructor(hosts: Hosts) {
        this.hosts = hosts;
    }

    public write(): Promise<ArrayBuffer> {
        let zip: JSZip = new JSZip();
        this.addFile(zip, HostsFileNames.BLACKLIST_BULK, this.hosts.blacklistBulk);
        this.addFile(zip, HostsFileNames.BLACKLIST_MANUAL, this.hosts.blacklistManual);
        this.addFile(zip, HostsFileNames.BLACKLIST_MANUAL_EXTRA, this.hosts.blacklistManualExtra);
        this.addFile(zip, HostsFileNames.WHITELIST, this.hosts.whitelist);
        this.addFile(zip, HostsFileNames.WHITELIST_EXTRA, this.hosts.whitelistExtra);
        return new Promise<ArrayBuffer>((resolve: (content: ArrayBuffer) => void) => {
            zip.generateAsync({type: "arraybuffer"}).then((content: any) => {
                resolve(content);
            });
        });
    }

    private addFile(zip: JSZip, fileName: string, hosts: string[]) {
        let content = hosts.join("\n");
        zip.file(fileName, content);
    }
}