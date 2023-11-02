import type { Data } from "../../types";
type Props<T extends string> = {
    initialData: Data<T>[];
    file: File;
};
export declare const ValidationStep: <T extends string>({ initialData, file }: Props<T>) => import("react/jsx-runtime").JSX.Element;
export {};
