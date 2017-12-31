export interface Configuration {
    logEntryType: LogEntryType;
    logAllowed: boolean;
    logBlocked: boolean;
    logDistinct: boolean;
}

export enum LogEntryType {
    URL = "URL", HOST = "HOST"
}