<script lang="ts" setup>
    import PageHeader from '@/components/Custom/PageHeader/index.vue';
    import FormFooterToolbar from '@/components/Custom/FormFooterToolbar/index.vue';
    import TuiEditor from "@/components/TuiEditor/index.vue";
    import { ResponseData } from '@/utils/request';
    import { aboutDetail, aboutAdd } from './service';
    import { reactive, ref, onMounted } from "vue";
    import { useI18n } from "vue-i18n";
    import { ElForm, ElMessage, ElLoading } from "element-plus";
    import { FormItem } from "./data.d";

    const { t } = useI18n();

    // 表单值
    const modelRef = reactive<FormItem>({
          title: '',
          keywords: '',
          description: '',
          content: ''        
    });
    // 表单验证
    const rulesRef = reactive({
        title: [
            { required: true, message: t('views.setting.about.form.title.placeholder'), trigger: 'blur' }
        ],
        keywords:[
            { required: true, message: t('views.setting.about.form.keywords.placeholder'), trigger: 'blur' },
        ],
        description: [
            { required: true, message: t('views.setting.about.form.description.placeholder'), trigger: 'blur' },
        ]         
    });
    // form
    const formRef = ref<typeof ElForm>();


    const getDetail = async (): Promise<void> => {
        const loading = ElLoading.service({lock: true})
        try {
          const response: ResponseData = await aboutDetail();
          const { data } = response;
          const { title, keywords, description, content } = data;

          modelRef.title = title;
          modelRef.keywords = keywords;
          modelRef.description = description;         
          modelRef.content = content;
         
        } catch (error:any) {
            // console.log(error);
            ElMessage.warning(error.msg || error || 'error');
        }
       
        loading.close();
    }
    onMounted(()=> {
       getDetail();
    })
    

    

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
                    content: modelRef.content
                };
                await aboutAdd(paramData);

                ElMessage({
                  message: t('views.setting.about.submit.confirm.msg'),
                  type: 'success',
                  onClose: () => {
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

    <page-header>{{t('views.setting.about.header.title')}}</page-header>

    <el-form label-position="top" :model="modelRef" :rules="rulesRef" ref="formRef">
        <el-card shadow="never" class="border-none margin-t24">
            <template #header>
                <span>{{t('views.setting.about.base.title')}}</span>
            </template>
            <el-row :gutter="24">
                <el-col :sm="24" :md="12" :lg="8">
                    <el-form-item :label="t('views.setting.about.form.title')" prop="title">
                      <el-input v-model.trim="modelRef.title" :placeholder="t('views.setting.about.form.title.placeholder')"></el-input>
                    </el-form-item>
                </el-col>                
                
                <el-col :sm="24" :md="12" :lg="8">
                    <el-form-item :label="t('views.setting.about.form.keywords')" prop="keywords">
                      <el-input v-model.trim="modelRef.keywords" :placeholder="t('views.setting.about.form.keywords.placeholder')"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :sm="24" :md="12" :lg="8">
                    <el-form-item :label="t('views.setting.about.form.description')" prop="description">
                      <el-input v-model.trim="modelRef.description" :placeholder="t('views.setting.about.form.description.placeholder')"></el-input>
                    </el-form-item>
                </el-col>               
            </el-row>
        </el-card>
    </el-form>

   


    <el-card shadow="never" class="border-none margin-t24">
        <template #header>
            <span>{{t('views.setting.about.content.title')}}</span>
        </template>
        <tui-editor v-model="modelRef.content" ></tui-editor>
    </el-card>


    <form-footer-toolbar class="text-right">
        <el-button type="primary" :loading="submitLoading" @click="handleSubmit" >{{t('views.setting.about.form.btn.submit')}}</el-button>
    </form-footer-toolbar>





</div>
</template>