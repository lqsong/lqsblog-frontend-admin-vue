import { PaginationConfig } from "@/components/ScreenTable/data.d";


export interface TableListQueryParams {
    page: number;
    per: number;
    keywords?: string;
    sort?: number;
    order?: number;
    refresh?: string | number;
}

export interface TableListItem {
    id: number;
    title: string;
    addtime: string;
    alias: string;
    hit: number;
}

export interface TableDataType {
    loading: boolean;
    list: TableListItem[];
    pagination: PaginationConfig;
}