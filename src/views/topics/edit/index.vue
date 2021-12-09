<script lang="ts" setup>
    import PageHeader from '@/components/Custom/PageHeader/index.vue';
    import FormFooterToolbar from '@/components/Custom/FormFooterToolbar/index.vue';
    import SearchListDrawer from "@/components/Custom/SearchListDrawer/index.vue";
    import { ResponseData } from '@/utils/request';
    import { topicDetail, topicEdit } from './service';
    import { computed, reactive, ref } from "vue";
    import { useI18n } from "vue-i18n";
    import { useStore } from 'vuex';
    import { ElForm, ElMessage, ElLoading } from "element-plus";
    import { StateType as GlobalStateType } from '@/store/global';
    import useQueryVerifyId from '@/composables/useQueryVerifyId';
    import { FormItem, SearchRec } from './data.d';   

    const { t } = useI18n();
    const store = useStore<{global: GlobalStateType;}>(); 

    // 表单值
    const modelRef = reactive<FormItem>({
          title: '',
          alias: '',
          addtime: '',
          keywords: '',
          description: ''
                
    });
    // 表单验证
    const rulesRef = reactive({
        title: [
            { required: true, message: t('views.topics.edit.form.title.placeholder'), trigger: 'blur' },
            { min: 5, max: 100, message: t('views.topics.edit.form.title.minmax'), trigger: 'blur' }
        ],
        alias: [
            { 
                required: true,
                validator: (rule, value, callback) => {
                    if (value === '') {
                        callback(new Error(t('views.topics.edit.form.alias.placeholder')));
                    } else if (!/^[a-z0-9]+$/.test(value)) {
                        callback(new Error(t('views.topics.edit.form.alias.test')));
                    } else if (value.length > 10) {
                        callback(new Error(t('views.topics.edit.form.alias.max')));
                    }else {
                        callback();
                    }
                },
                trigger: 'blur' 
            }
        ],  
        addtime: [
            { required: true, message: t('views.topics.edit.form.addtime.placeholder'), trigger: 'change' }
        ],
        keywords:[
            { required: true, message: t('views.topics.edit.form.keywords.placeholder'), trigger: 'blur' },
            { min: 2, max: 50, message: t('views.topics.edit.form.keywords.minmax'), trigger: 'blur' }
        ],
        description: [
            { required: true, message: t('views.topics.edit.form.description.placeholder'), trigger: 'blur' },
            { min: 10, max: 200, message: t('views.topics.edit.form.description.minmax'), trigger: 'blur' }
        ]         
    });
    // form
    const formRef = ref<typeof ElForm>();


    const searchRec = reactive<SearchRec>({
        list: [],
        drawerVisible: false,
        select: (row) => {
            searchRec.list.push(row)
            ElMessage({ message: t('views.topics.edit.searchrec.choose.success'), type: 'success' });
        },
        deleteRow:(index: number) => {
            searchRec.list.splice(index, 1);
        }
        
    })
    const searchRecIds = computed<string[]>(()=>searchRec.list.map((item)=>item.id + '-' + item.type));

    const id = useQueryVerifyId('/topics/edit', async (id: number) => {
        const loading = ElLoading.service({lock: true})
       
        try {
          const response: ResponseData = await topicDetail(id);
          const { data } = response;
          const { title, keywords, description, addtime, alias, content } = data;

          modelRef.title = title;
          modelRef.alias = alias;
          modelRef.keywords = keywords;
          modelRef.description = description;
          modelRef.addtime = addtime;
          
          searchRec.list = content;
        } catch (error:any) {
            // console.log(error);
            ElMessage.warning(error.msg || error || 'error');
        }

        loading.close();
    });

    // submit loading
    const submitLoading = ref<boolean>(false);
    // submit
    const handleSubmit = async (): Promise<void> => {
        if(searchRec.list.length < 1) {
            ElMessage.error(t('views.topics.edit.searchrec.tips'));
            return;
        }
        submitLoading.value = true;
        try {
            const valid: boolean | undefined =  await formRef.value?.validate();
            

            if(valid === true) {
            
                const paramData = {
                    title: modelRef.title,
                    alias: modelRef.alias,
                    keywords: modelRef.keywords,
                    description: modelRef.description,
                    addtime: modelRef.addtime,
                    content: searchRec.list,
                };
                await topicEdit(id.value, paramData);

                ElMessage({
                  message: t('views.topics.edit.submit.confirm.msg'),
                  type: 'success',
                  onClose: () => {
                      store.commit('global/closeCurrentHeadTabNav','/topics/list');    
                  }
                })                
            }
        } catch (error) {
            // console.log(error);
            ElMessage.warning(t('app.global.form.validatefields.catch'));
        }
        submitLoading.value = false;
    }

</script>
<template>
<div class="main-conent main-conent-minheight">

    <page-header>{{t('views.topics.edit.header.title')}}</page-header>

    <el-form label-position="top" :model="modelRef" :rules="rulesRef" ref="formRef">
        <el-card shadow="never" class="border-none margin-t24">
            <template #header>
                <span>{{t('views.topics.edit.base.title')}}</span>
            </template>
            <el-row :gutter="24">
                <el-col :sm="24" :md="12" :lg="8">
                    <el-form-item :label="t('views.topics.edit.form.title')" prop="title">
                      <el-input v-model.trim="modelRef.title" :placeholder="t('views.topics.edit.form.title.placeholder')"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :sm="24" :md="12" :lg="8">
                   <el-form-item :label="t('views.topics.edit.form.alias')" prop="alias">                   
                      <el-input v-model.trim="modelRef.alias" :placeholder="t('views.topics.edit.form.alias.placeholder')"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :sm="24" :md="12" :lg="8">
                    <el-form-item :label="t('views.topics.edit.form.addtime')" prop="addtime">
                        <el-date-picker
                            v-model="modelRef.addtime"
                            type="datetime"
                            value-format="YYYY-MM-DD HH:mm:ss"
                            :placeholder="t('views.topics.edit.form.addtime.placeholder')"
                            class="width-percent100">
                        </el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :sm="24" :md="12" :lg="8">
                    <el-form-item :label="t('views.topics.edit.form.keywords')" prop="keywords">
                      <el-input v-model.trim="modelRef.keywords" :placeholder="t('views.topics.edit.form.keywords.placeholder')"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :sm="24" :md="12" :lg="8">
                    <el-form-item :label="t('views.topics.edit.form.description')" prop="description">
                      <el-input v-model.trim="modelRef.description" :placeholder="t('views.topics.edit.form.description.placeholder')"></el-input>
                    </el-form-item>
                </el-col>                
            </el-row>
        </el-card>
    </el-form>

  
    <el-card shadow="never" class="border-none margin-t24">
        <template #header>
            <span><el-link type="danger" :underline="false">*</el-link> {{t('views.topics.edit.searchrec.title')}}</span>

            <el-link type="primary" href="javascript:;" :underline="false" class="float-right" @click="searchRec.drawerVisible=true" >{{t('views.topics.edit.searchrec.btn.show')}}</el-link>
        </template>
        <el-table
               header-row-class-name="custom-table-header"
               stripe
              :data="searchRec.list">
              <el-table-column
                type="index"
                :label="t('views.topics.edit.searchrec.table.column.index')"
                width="60">
              </el-table-column>
              <el-table-column
                prop="id"
                :label="t('views.topics.edit.searchrec.table.column.id')"
                min-width="100">
              </el-table-column>
              <el-table-column
                prop="type"
                :label="t('views.topics.edit.searchrec.table.column.type')"
                width="80"
                >
                <template #default="scope">
                    <el-tag v-if="scope.row.type===1">{{t('views.topics.edit.searchrec.table.column.type.article')}}</el-tag>
                    <el-tag v-else-if="scope.row.type===2" type="success">{{t('views.topics.edit.searchrec.table.column.type.work')}}</el-tag>
                    <el-tag v-else type="info">--</el-tag>                           
                </template>
              </el-table-column>
              <el-table-column
                prop="title"
                :label="t('views.topics.edit.searchrec.table.column.title')"
                min-width="300">
              </el-table-column>
              <el-table-column
                prop="addtime"
                :label="t('views.topics.edit.searchrec.table.column.addtime')"
                min-width="150">
              </el-table-column>
              <el-table-column
                fixed="right"
                :label="t('views.topics.edit.searchrec.table.column.action')"
                min-width="120">
                <template  #default="scope">
                  <el-button
                    @click="searchRec.deleteRow(scope.$index)"
                    type="text"
                    size="small">
                    {{t('views.topics.edit.searchrec.btn.del')}}
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
    </el-card>
    <search-list-drawer v-model="searchRec.drawerVisible" :title="t('views.topics.edit.searchrec.drawer.title')">
        <template #el-table-column>
          <el-table-column
            fixed="right"
            width="100"
            :label="t('views.topics.edit.searchrec.drawer.action')">
            <template #default="scope">
              <el-button
                v-if="searchRecIds.includes(scope.row.id + '-' + scope.row.type)"
                disabled
                type="info"
                size="mini">
                {{t('views.topics.edit.searchrec.drawer.btn1')}}
              </el-button>
              <el-button
                v-else
                type="primary"
                size="mini"
                @click="searchRec.select(scope.row)">
                {{t('views.topics.edit.searchrec.drawer.btn2')}}
              </el-button>                     
            </template>
          </el-table-column>
        </template>
    </search-list-drawer>


    <form-footer-toolbar class="text-right">
        <el-button type="primary" :loading="submitLoading" @click="handleSubmit" >{{t('views.topics.edit.form.btn.submit')}}</el-button>
    </form-footer-toolbar>





</div>
</template>