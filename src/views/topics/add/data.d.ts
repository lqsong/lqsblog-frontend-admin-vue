import { TableListItem as SearchListItem } from "@/components/Custom/SearchListDrawer/data.d";


export interface FormItem {
    title: string;
    alias: string;
    keywords: string;
    description: string;
    addtime: string;
}

export interface DataItem {
    title: string;
    alias: string;
    keywords: string;
    description: string;
    addtime: string;
    content: SearchListItem[];
}

export interface SearchRec {
    list: SearchListItem[];
    drawerVisible: boolean;
    select: (row: SearchListItem)=> void;
    deleteRow: (index: number) => void;
}