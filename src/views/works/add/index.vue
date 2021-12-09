<script lang="ts" setup>
    import PageHeader from '@/components/Custom/PageHeader/index.vue';
    import FormFooterToolbar from '@/components/Custom/FormFooterToolbar/index.vue';
    import TagSelect from "@/components/Custom/TagSelect/index.vue";
    import ServerImageSelectionList from '@/components/Custom/ServerImage/SelectionList/index.vue';
    import TuiEditor from "@/components/TuiEditor/index.vue";
    import { StateType as GlobalStateType } from '@/store/global';
    import { FormItem } from './data.d';
    import { workAdd } from './service';
    import { ElForm, ElMessage, ElMessageBox } from "element-plus";
    import { useI18n } from "vue-i18n";
    import { useStore } from 'vuex';
    import { reactive, ref } from "vue";
    
    
   

    const { t } = useI18n();
    const store = useStore<{global: GlobalStateType;}>(); 

    // 表单值
    const modelRef = reactive<FormItem>({
          title: '',
          addtime: '',
          keywords: '',
          description: '',
          tag: [], 
          thumb: [],         
          content: ''        
    });
    // 表单验证
    const rulesRef = reactive({
        title: [
            { required: true, message: t('views.works.add.form.title.placeholder'), trigger: 'blur' },
            { min: 5, max: 100, message: t('views.works.add.form.title.minmax'), trigger: 'blur' }
        ], 
        addtime: [
            { required: true, message: t('views.works.add.form.addtime.placeholder'), trigger: 'change' }
        ],
        keywords:[
            { required: true, message: t('views.works.add.form.keywords.placeholder'), trigger: 'blur' },
            { min: 2, max: 50, message: t('views.works.add.form.keywords.minmax'), trigger: 'blur' }
        ],
        description: [
            { required: true, message: t('views.works.add.form.description.placeholder'), trigger: 'blur' },
            { min: 10, max: 200, message: t('views.works.add.form.description.minmax'), trigger: 'blur' }
        ]         
    });
    // form
    const formRef = ref<typeof ElForm>();



    // submit loading
    const submitLoading = ref<boolean>(false);
    // submit
    const handleSubmit = async (): Promise<void> => {
        
        submitLoading.value = true;
        try {
            const valid: boolean | undefined =  await formRef.value?.validate();
            if(valid === true) {
            
                const paramData = {
                    title: modelRef.title,
                    keywords: modelRef.keywords,
                    description: modelRef.description,
                    addtime: modelRef.addtime,
                    tag: modelRef.tag.join(','),
                    thumb: modelRef.thumb.join('|'),
                    content: modelRef.content
                };
                await workAdd(paramData);
                ElMessageBox.confirm(t('views.works.add.submit.confirm.msg'),t('views.works.add.submit.confirm.title'), {
                    confirmButtonText: t('views.works.add.submit.confirm.btn1'),
                    cancelButtonText: t('views.works.add.submit.confirm.btn2'),
                    type: 'success',
                    closeOnClickModal: false
                }).then(() => {

                  modelRef.title = '';
                  modelRef.addtime = '';
                  modelRef.keywords = '';
                  modelRef.description = '';
                  modelRef.tag = []; 
                  modelRef.thumb = [];         
                  modelRef.content = ''; 
                  
                }).catch(() => {
                  store.commit('global/closeCurrentHeadTabNav','/works/list');      
                });
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

    <page-header>{{t('views.works.add.header.title')}}</page-header>

    <el-form label-position="top" :model="modelRef" :rules="rulesRef" ref="formRef">
        <el-card shadow="never" class="border-none margin-t24">
            <template #header>
                <span>{{t('views.works.add.base.title')}}</span>
            </template>
            <el-row :gutter="24">
                <el-col :sm="24" :md="12" :lg="8">
                    <el-form-item :label="t('views.works.add.form.title')" prop="title">
                      <el-input v-model.trim="modelRef.title" :placeholder="t('views.works.add.form.title.placeholder')"></el-input>
                    </el-form-item>
                </el-col>                
                <el-col :sm="24" :md="12" :lg="8">
                    <el-form-item :label="t('views.works.add.form.addtime')" prop="addtime">
                        <el-date-picker
                            v-model="modelRef.addtime"
                            type="datetime"
                            value-format="YYYY-MM-DD HH:mm:ss"
                            :placeholder="t('views.works.add.form.addtime.placeholder')"
                            class="width-percent100">
                        </el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :sm="24" :md="12" :lg="8">
                    <el-form-item :label="t('views.works.add.form.keywords')" prop="keywords">
                      <el-input v-model.trim="modelRef.keywords" :placeholder="t('views.works.add.form.keywords.placeholder')"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :sm="24" :md="12" :lg="8">
                    <el-form-item :label="t('views.works.add.form.description')" prop="description">
                      <el-input v-model.trim="modelRef.description" :placeholder="t('views.works.add.form.description.placeholder')"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :sm="24" :md="12" :lg="8">
                    <el-form-item :label="t('views.works.add.form.tag')">
                      <tag-select
                        v-model="modelRef.tag"
                        :placeholder="t('views.works.add.form.tag.placeholder')"
                        class="width-percent100">
                      </tag-select>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-card>
    </el-form>

    <el-card shadow="never" class="border-none margin-t24">
        <template #header>
            <span>{{t('views.works.add.pic.title')}}</span>
            <el-link href="javascript:;" type="warning" :underline="false" class="margin-l10">{{t('views.works.add.pic.tips')}}</el-link>
        </template>
        <server-image-selection-list v-model="modelRef.thumb" :limit="4"></server-image-selection-list>
    </el-card>


    <el-card shadow="never" class="border-none margin-t24">
        <template #header>
            <span>{{t('views.works.add.content.title')}}</span>
        </template>
        <tui-editor v-model="modelRef.content" ></tui-editor>
    </el-card>




    <form-footer-toolbar class="text-right">
        <el-button type="primary" :loading="submitLoading" @click="handleSubmit" >{{t('views.works.add.form.btn.submit')}}</el-button>
    </form-footer-toolbar>





</div>
</template>