import { FilterOutcome } from "./model/FilterOutcome";
import { Configuration, LogEntryType } from "./model/Configuration";
import { ArrayUtils } from "./utils/ArrayUtils";

export class Log {

    private static INSTANCE: Log | null = null;

    private readonly configuration: Configuration;
    public readonly blockedEntries: LogEntry[];
    public readonly allowedEntries: LogEntry[];

    private constructor(configuration: Configuration) {
        this.configuration = configuration;
        this.blockedEntries = [];
        this.allowedEntries = [];
    }

    public static init(configuration: Configuration) {
        this.INSTANCE = new Log(configuration);
    }

    public static getInstance(): Log {
        if (this.INSTANCE === null) {
            throw new Error("Log not initialized.");
        }
        return this.INSTANCE;
    }

    public log(url: string, host: string, outcome: FilterOutcome): void {
        switch (outcome) {
            case FilterOutcome.BLOCKED:
                if (this.configuration.logBlocked) {
                    this.logEntry(url, host, this.blockedEntries);
                }
                break;
            case FilterOutcome.ALLOWED:
                if (this.configuration.logAllowed) {
                    this.logEntry(url, host, this.allowedEntries);
                }
                break;
            default:
                throw new Error("Unsupported outcome: [" + outcome + "]");
        }
    }

    private logEntry(url: string, host: string, entries: LogEntry[]): void {
        if (host.length === 0) {
            return;
        }
        let entry: LogEntry;
        switch (this.configuration.logEntryType) {
            case (LogEntryType.HOST):
                entry = new HostLogEntry();
                break;
            case (LogEntryType.URL):
                entry = new UrlLogEntry();
                break;
            default:
                throw new Error("Unsupported log entry type: [" + this.configuration.logEntryType + "]");
        }
        entry.url = url;
        entry.host = host;
        if (!this.configuration.logDistinct || !this.entryExists(entry, entries)) {
            entries.push(entry);
        }
    }

    private entryExists(entry: LogEntry, entries: LogEntry[]): boolean {
        return ArrayUtils.contains(entries, (candidateEntry: LogEntry): boolean => {
            return (candidateEntry.host === entry.host);
        })
    }
}

export abstract class LogEntry {
    
    public url: string;
    public host: string;

    public abstract get text(): string;
}

class HostLogEntry extends LogEntry {

    public get text(): string {
        return this.host;
    }
}

class UrlLogEntry extends LogEntry {

    public get text(): string {
        return this.url;
    }
}