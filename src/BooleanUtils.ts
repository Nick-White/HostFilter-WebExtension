export class BooleanUtils {

    public static toString(value: boolean): string {
        return ((value) ? "true" : "false");
    }

    public static fromString(value: string): boolean {
        if (value === "true") {
            return true;
        }
        if (value === "false") {
            return false;
        }
        throw new Error("[" + value + "] is not a valid boolean value.");
    }
}