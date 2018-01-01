import { Set } from "typescript-collections";

export class CollectionUtils {

    public static addAll<E>(set: Set<E>, elementMatrix: E[][]): void {
        elementMatrix.forEach((elementArray: E[]) => {
            elementArray.forEach((element: E) => {
                set.add(element);
            });
        });
    }

    public static removeAll<E>(set: Set<E>, elementMatrix: E[][]): void {
        elementMatrix.forEach((elementArray: E[]) => {
            elementArray.forEach((element: E) => {
                set.remove(element);
            });
        });
    }
}