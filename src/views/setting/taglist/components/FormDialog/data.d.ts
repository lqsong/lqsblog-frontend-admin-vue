import { Tag } from "../../data.d";

export type Tag = Tag;


export interface FormItem {
    name: string;
    pinyin: string;
}

export type DataItem = FormItem;


export interface FormDialogProps {
    visible: boolean;
    submitLoading?: boolean;
    values?: Tag;
    title?: string;
    onSubmit: (values: DataItem) => Promise<void>;
}