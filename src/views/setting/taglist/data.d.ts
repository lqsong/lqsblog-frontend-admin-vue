import { PaginationConfig } from "@/components/ScreenTable/data.d";

export interface Tag {
    id: number;
    name: string;
    pinyin: string;
    hit: number;
}

export interface TableListQueryParams {
    page: number;
    per: number;
    keywords?: string;
    sort?: number;
    order?: number;
    refresh?: string | number;
}

export type TableListItem = Tag;

export interface TableDataType {
    loading: boolean;
    list: TableListItem[];
    pagination: PaginationConfig;
}