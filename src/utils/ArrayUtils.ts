export class ArrayUtils {

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