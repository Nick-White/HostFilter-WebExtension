import * as JSZip from "jszip";
import { Hosts } from "./model/Hosts";

export class HostsFromZipReader {

    private readonly zip: JSZip;

    public constructor(zip: JSZip) {
        this.zip = zip;
    }

    public read(): Promise<Hosts> {
        return new Promise((resolve: (hosts: Hosts) => void) => {
            let hosts: any = {};
            Promise.all([
                this.getFileLines("blacklist-bulk.txt").then((lines: string[]) => {
                    hosts.blacklistBulk = lines;
                }),
                this.getFileLines("blacklist-manual.txt").then((lines: string[]) => {
                    hosts.blacklistManual = lines;
                }),
                this.getFileLines("blacklist-manual-extra.txt").then((lines: string[]) => {
                    hosts.blacklistManualExtra = lines;
                }),
                this.getFileLines("whitelist.txt").then((lines: string[]) => {
                    hosts.whitelist = lines;
                })
            ]).then(() => {
                resolve(<Hosts>hosts);
            });
        });
    }

    private getFileLines(fileName: string): Promise<string[]> {
        return new Promise<string[]>((resolve: (lines: string[]) => void) => {
            this.zip.file(fileName).async("text").then((content: string) => {
                let lines: string[] = content.trim().split(/\r?\n/);
                resolve(lines);
            });
        });
    }
}