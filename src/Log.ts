import { FilterOutcome } from "./model/FilterOutcome";
import { Configuration, LogEntryType } from "./model/Configuration";

export class Log {

    private static INSTANCE: Log | null = null;

    private readonly configuration: Configuration;
    private readonly blockedEntries: string[];
    private readonly allowedEntries: string[];

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

    private logEntry(url: string, host: string, entries: string[]): void {
        let entry: string;
        switch (this.configuration.logEntryType) {
            case (LogEntryType.HOST):
                entry = host;
                break;
            case (LogEntryType.URL):
                entry = url;
                break;
            default:
                throw new Error("Unsupported log entry type: [" + this.configuration.logEntryType + "]");
        }
        if ((entry.length > 0) && (!this.configuration.logDistinct || (entries.indexOf(entry) === -1))) {
            entries.push(entry);
        }
    }
}

