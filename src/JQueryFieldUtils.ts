export class JQueryFieldUtils {

    public static setCheckedRadio($radios: JQuery<HTMLElement>, value: string): void {
        let $radioWithValue: JQuery<HTMLElement> = $radios.filter("[value='" + value + "']");
        if ($radioWithValue.length === 0) {
            throw new Error("Radio with value [" + value + "] not found for [" + $radios.attr("name") + "].");
        }
        $radioWithValue.prop("checked", true);
    }

    public static getCheckedRadioValue($radios: JQuery<HTMLElement>): string {
        let $checkedRadio: JQuery<HTMLElement> = $radios.filter(":checked");
        if ($checkedRadio.length === 0) {
            throw new Error("Radio [" + $radios.attr("name") + "] has nothing checked.");
        }
        return <string>$checkedRadio.attr("value");
    }
}