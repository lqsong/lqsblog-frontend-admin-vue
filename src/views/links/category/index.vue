<script lang="ts" setup>
    import IconSvg from "@/components/IconSvg";
    import ScreenTable from '@/components/ScreenTable/index.vue';
    import FormDialog from './components/FormDialog/index.vue';
    import { FormDialogProps } from "./components/FormDialog/data.d";
    import { TableDataType, CategoryItem } from "./data.d";    
    import { ResponseData } from '@/utils/request';
    import { queryList, removeData, categoryAdd, categoryEdit } from "./service";
    import { ElMessage } from "element-plus";
    import { useI18n } from "vue-i18n";
    import { DefineComponent, reactive, ref, onMounted } from "vue";

    const { t } = useI18n();
    

    // 列表 - 初始化数据   
    const tableData = reactive<TableDataType>({
        loading: false,
        list: []
    })
    // 列表 - 获取数据
    const getList = async (): Promise<void> => {
        tableData.loading = true;
        const response: ResponseData = await queryList();

        const { data } = response;
        const list: CategoryItem[]  = data || [];
        tableData.list =  list;
        tableData.loading = false;

    }
    onMounted(()=> {
        getList()        
    })
    

    



    // 删除
    const handleDelete = async (index:number, row: CategoryItem): Promise<void> => {

        tableData.list[index]['delLoading'] = true;
        try {
            await removeData(row.id)
            ElMessage.success(t('views.links.category.table.column.action.buttion.del.success'));
            if(tableData.list.length > 1) {
                tableData.list.splice(index, 1);
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
                await categoryEdit(formDialog.values.id, values);
                formDialog.visible = false;
                getList()
                ElMessage({
                  message: t('views.links.category.components.formdialog.editsuccess'),
                  type: 'success',
                  onClose: () => { }
                })
            } else { // 新增
                await categoryAdd(values); 
                formDialog.visible = false;
                getList()
                ElMessage({
                  message: t('views.links.category.components.formdialog.addsuccess'),
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
    const editFormShow = async (row: CategoryItem): Promise<void> => {
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
    >

        <template #header>
            <el-row>
                    <el-col :span="24">
                        
                        <el-button type="primary" @click="addFormShow"> {{t('views.links.category.button.add')}}</el-button>
                        
                    </el-col>
                    
            </el-row>
        </template>


        <el-table-column
            fixed
            type="index"
            :label="t('views.links.category.table.column.index')"
            width="80">
        </el-table-column>

        <el-table-column
            fixed
            :label="t('views.links.category.table.column.name')"
            prop="name"
            min-width="330">
        </el-table-column>
        <el-table-column
            fixed
            :label="t('views.links.category.table.column.alias')"
            prop="alias"
            min-width="330">
        </el-table-column>
        <el-table-column
            fixed
            :label="t('views.links.category.table.column.sort')"
            prop="sort"
            min-width="330">
        </el-table-column>
        

       

        <el-table-column
            :label="t('views.links.category.table.column.action')"
            prop="action"
            width="120">
            <template #default="{row,$index}">
                <el-button type="text" @click="editFormShow(row)">{{t('views.links.category.table.column.action.buttion.edit')}}</el-button> 
                
                <el-popconfirm :title="t('views.links.category.table.column.action.buttion.del.popconfirm')" @confirm="handleDelete($index, row)">
                    <template #reference>
                        <el-button type="text" :loading="row.delLoading" >{{t('views.links.category.table.column.action.buttion.del')}}</el-button>  
                    </template>
                </el-popconfirm>                       
            </template>
        </el-table-column>


    </screen-table>



    <form-dialog
        v-if="formDialog.visible"
        ref="formDialogRef"
        :title="formDialog.values?t('views.links.category.components.formdialog.edit.title'):t('views.links.category.components.formdialog.add.title')"
        v-model="formDialog.visible" 
        v-model:submitLoading="formDialog.submitLoading"
        :values="formDialog.values"
        :onSubmit="formDialog.onSubmit"
    />
 

   
</template>


