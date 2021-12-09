<script lang="ts" setup>
    import IconSvg from "@/components/IconSvg";
    import ScreenTable from '@/components/ScreenTable/index.vue';
    import { TableDataType, TableListItem, TableListQueryParams } from "./data.d";    
    import useQueryList from '@/composables/useQueryList'
    import { ResponseData } from '@/utils/request';
    import { queryList, removeData } from "./service";
    import { ElMessage } from "element-plus";
    import { useI18n } from "vue-i18n";
    import { reactive, ref, watchEffect } from "vue";

    const { t } = useI18n();
    

    // 列表 - 初始化数据   
    const tableData = reactive<TableDataType>({
        loading: false,
        list: [],
        pagination: {
            total: 0,
            current: 1,
            pageSize: 0,
            sizeChange:()=>{},
            onChange: () => {}
        }
    })
    // 列表 - 获取数据
    const { pushQuery, queryParams } =  useQueryList<TableListQueryParams>(async (queryParams, pushQuery): Promise<void> => {
        tableData.loading = true;
        const response: ResponseData = await queryList(queryParams);

        const { data } = response;
        const list: TableListItem[]  = data.list || [];
        tableData.list =  list;
        tableData.pagination = {
            total: data.total || 0,
            current: queryParams.page,
            pageSize: queryParams.per,
            sizeChange: (size) => pushQuery({per: size, page: 1}),
            onChange: (page) => pushQuery({page})
        }       
        tableData.loading = false;
    })

    
    
    // 简单搜索
    const miniSearchInput = ref<string>('');
    const miniSearchBtn = (): void => {
        pushQuery({
            keywords: miniSearchInput.value,
            page: 1
        })
    }


    // 动态搜索赋值
    watchEffect(()=> {        
        miniSearchInput.value = queryParams.value.keywords || '';
    })


    // 删除
    const handleDelete = async (index:number, row: TableListItem): Promise<void> => {

        tableData.list[index]['delLoading'] = true;
        try {
            await removeData(row.id)
            ElMessage.success(t('views.topics.list.table.column.action.buttion.del.success'));
            /**
             * 为了减少请求，
             * 缺点不实时，如果要求精确可以把if(){}删除 保留 else{ 中的内容 }
             */
            if(tableData.list.length > 1) {
                tableData.list.splice(index, 1);
            } else {
                pushQuery({refresh: new Date().getTime()})
            }
        } catch (error: any) {
             ElMessage.warning(error.msg || error || 'error');
             tableData.list[index]['delLoading'] = false;
        }


    }


   
</script>
<template>

    <screen-table
        class="indexlayout-main-conent"
        row-key="id"
        :data="tableData.list"
        :loading="tableData.loading"
        :pagination="tableData.pagination"
    >

        <template #header>
            <el-row>
                    <el-col :span="8">
                        <router-link to="/topics/add" >
                            <el-button type="primary"> {{t('views.topics.list.button.add')}}</el-button>
                        </router-link>
                    </el-col>
                    <el-col :span="16" class="text-align-right">                        
                        <el-input style="width:200px;" :placeholder="t('views.topics.list.search.input.placeholder')" v-model="miniSearchInput"  @keydown.enter="miniSearchBtn">
                            <template #suffix>
                                <i class="el-input__icon"><icon-svg type="search" class="cursor-pointer" @click="miniSearchBtn"></icon-svg></i>
                            </template>
                        </el-input>
                    </el-col>
            </el-row>
        </template>


        <el-table-column
            fixed
            type="index"
            :label="t('views.topics.list.table.column.index')"
            width="80">
        </el-table-column>

        <el-table-column
            fixed
            :label="t('views.topics.list.table.column.title')"
            prop="title"
            min-width="330">
        </el-table-column>
        <el-table-column
            prop="alias"
            :label="t('views.topics.list.table.column.alias')"
            width="130">
        </el-table-column>
        <el-table-column
            prop="addtime"
            :label="t('views.topics.list.table.column.addtime')"
            width="140">
        </el-table-column>

        <el-table-column
            :label="t('views.topics.list.table.column.action')"
            prop="action"
            width="120">
            <template #default="{row,$index}">
                <router-link :to="`/topics/edit?id=${row.id}`" class="el-button el-button--text el-button--small text-decoration-none">{{t('views.topics.list.table.column.action.buttion.edit')}}</router-link>
                <el-popconfirm :title="t('views.topics.list.table.column.action.buttion.del.popconfirm')" @confirm="handleDelete($index, row)">
                    <template #reference>
                        <el-button type="text" :loading="row.delLoading" >{{t('views.topics.list.table.column.action.buttion.del')}}</el-button>  
                    </template>
                </el-popconfirm>                       
            </template>
        </el-table-column>


    </screen-table>
   
</template>


