import { PaginationConfig } from "@/components/ScreenTable/data.d";


export interface TableListQueryParams {
    page: number;
    per: number;
    keywords?: string;
    addtimestart?: string;
    addtimeend?: string;
    tags?: string;
    sort?: number;
    order?: number;
    refresh?: string | number;
}

export interface TableListItem {
    id: number;
    title: string;
    addtime: string;
    tag: string;
    hit: number;
    tags:? string[];
}

export interface TableDataType {
    loading: boolean;
    list: TableListItem[];
    pagination: PaginationConfig;
}