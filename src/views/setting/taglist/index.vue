<script lang="ts" setup>
    import IconSvg from "@/components/IconSvg";
    import ScreenTable from '@/components/ScreenTable/index.vue';
    import FormDialog from './components/FormDialog/index.vue';
    import { FormDialogProps } from "./components/FormDialog/data.d";
    import { TableDataType, TableListItem, TableListQueryParams } from "./data.d";    
    import useQueryList from '@/composables/useQueryList'
    import { ResponseData } from '@/utils/request';
    import { queryList, removeData, tagAdd, tagEdit } from "./service";
    import { ElMessage } from "element-plus";
    import { useI18n } from "vue-i18n";
    import { DefineComponent, reactive, ref, watchEffect } from "vue";

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
            ElMessage.success(t('views.setting.taglist.table.column.action.buttion.del.success'));
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


    // 表单
    const formDialogRef = ref<DefineComponent>();
    const formDialog = reactive<FormDialogProps>({
        visible: false,
        submitLoading: false,
        values: undefined,
        onSubmit: async (values) => {
            if(formDialog.values) { // 编辑
                await tagEdit(formDialog.values.id, values);
                formDialog.visible = false;
                pushQuery({refresh: new Date().getTime()})
                ElMessage({
                  message: t('views.setting.taglist.components.formdialog.editsuccess'),
                  type: 'success',
                  onClose: () => { }
                })
            } else { // 新增
                await tagAdd(values); 
                formDialog.visible = false;
                pushQuery({
                    keywords: '',
                    page: 1,
                    refresh: new Date().getTime()
                })
                ElMessage({
                  message: t('views.setting.taglist.components.formdialog.addsuccess'),
                  type: 'success',
                  onClose: () => {}
                })
            }    
        }
    })

    // 添加表单弹框 - 显示
    const addFormShow = (): void => {
        formDialog.values = undefined;
        formDialog.visible = true;

    }

    // 编辑表单弹框 - 显示
    const editFormShow = async (row: TableListItem): Promise<void> => {
         formDialog.values = {
            ...row
        };
        formDialog.visible = true;
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
                        
                        <el-button type="primary" @click="addFormShow"> {{t('views.setting.taglist.button.add')}}</el-button>
                        
                    </el-col>
                    <el-col :span="16" class="text-align-right">                        
                        <el-input style="width:200px;" :placeholder="t('views.setting.taglist.search.input.placeholder')" v-model="miniSearchInput"  @keydown.enter="miniSearchBtn">
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
            :label="t('views.setting.taglist.table.column.index')"
            width="80">
        </el-table-column>

        <el-table-column
            fixed
            :label="t('views.setting.taglist.table.column.name')"
            prop="name"
            min-width="330">
        </el-table-column>
        <el-table-column
            fixed
            :label="t('views.setting.taglist.table.column.pinyin')"
            prop="pinyin"
            min-width="330">
        </el-table-column>
       

        <el-table-column
            :label="t('views.setting.taglist.table.column.action')"
            prop="action"
            width="120">
            <template #default="{row,$index}">
                <el-button type="text" @click="editFormShow(row)">{{t('views.setting.taglist.table.column.action.buttion.edit')}}</el-button> 
                
                <el-popconfirm :title="t('views.setting.taglist.table.column.action.buttion.del.popconfirm')" @confirm="handleDelete($index, row)">
                    <template #reference>
                        <el-button type="text" :loading="row.delLoading" >{{t('views.setting.taglist.table.column.action.buttion.del')}}</el-button>  
                    </template>
                </el-popconfirm>                       
            </template>
        </el-table-column>


    </screen-table>

     
    <form-dialog
        v-if="formDialog.visible"
        ref="formDialogRef"
        :title="formDialog.values?t('views.setting.taglist.components.formdialog.edit.title'):t('views.setting.taglist.components.formdialog.add.title')"
        v-model="formDialog.visible" 
        v-model:submitLoading="formDialog.submitLoading"
        :values="formDialog.values"
        :onSubmit="formDialog.onSubmit"
    />
 

   
</template>


