export class ArrayUtils {

    public static addAll<E>(array: E[], elements: E[]): void {
        elements.forEach((element: E): void => {
            array.push(element);
        });
    }

    public static removeAll<E>(array: E[], elements: E[]): void {
        elements.forEach((element: E): void => {
            let index: number = array.indexOf(element);
            if (index !== -1) {
                array.splice(index, 1);
            }
        });
    }

    public static contains<E>(array: E[], filterFunction: (element: E) => boolean): boolean {
        for (let i: number = 0, arrayLength: number = array.length; i < arrayLength; i++) {
            let element: E = array[i];
            if (filterFunction.call(null, element)) {
                return true;
            }
        }
        return false;
    }
}