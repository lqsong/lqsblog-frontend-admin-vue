export interface TableListQueryParams {
    keywords: string;
    page: number;
    per: number;
}

export interface Category {
    id: number;
    name: string;
    alias: string;
}

export interface TableListItem {
    id: number;
    type: number; // 1 随笔 ，2作品
    title: string;
    category?: Category;
    addtime: string;
    thumb: string;
    description: string;
}

export interface TableDataType {
    tableIndexMethod: (index: number) => any;
    loading: boolean;
    list: TableListItem[];
    pagination: {
        total: number;
        current: number;
        pageSize: number;
        onChange: (page: number) => void;
    };
}