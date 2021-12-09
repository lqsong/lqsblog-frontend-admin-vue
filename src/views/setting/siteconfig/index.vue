<script lang="ts" setup>
    import PageHeader from '@/components/Custom/PageHeader/index.vue';
    import FormFooterToolbar from '@/components/Custom/FormFooterToolbar/index.vue';
    import { ResponseData } from '@/utils/request';
    import { configDetail, configAdd } from './service';
    import { reactive, ref, onMounted } from "vue";
    import { useI18n } from "vue-i18n";
    import { ElForm, ElMessage, ElLoading } from "element-plus";
    import { FormItem } from "./data.d";

    const { t } = useI18n();

    // 表单值
    const modelRef = reactive<FormItem>({
        keywords: '',
        description: '',
        siteCreationTime:  '',
        icp:  '',
        copyrightPerson:  '',
        copyrightUrl:  ''    
    });
    // 表单验证
    const rulesRef = reactive({
        keywords:[
            { required: true, message: t('views.setting.siteconfig.form.keywords.placeholder'), trigger: 'blur' },
        ],
        description: [
            { required: true, message: t('views.setting.siteconfig.form.description.placeholder'), trigger: 'blur' },
        ],
        siteCreationTime: [
            { required: true, message: t('views.setting.siteconfig.form.siteCreationTime.placeholder'), trigger: 'change' },
          ],
          icp: [
            { required: true, message: t('views.setting.siteconfig.form.icp.placeholder'), trigger: 'blur' },
          ],
          copyrightPerson: [
            { required: true, message: t('views.setting.siteconfig.form.copyrightPerson.placeholder'), trigger: 'blur' },
          ],
          copyrightUrl: [
            { 
                required: true,
                validator: (rule, value, callback) => {
                    if (value === '') {
                        callback(new Error(t('views.setting.siteconfig.form.copyrightUrl.placeholder')));
                    } else if (!/^(https?:)/.test(value)) {
                        callback(new Error(t('views.setting.siteconfig.form.copyrightUrl.test')));
                    }else {
                        callback();
                    }
                },
                trigger: 'blur' 
            }
          ]      
    });
    // form
    const formRef = ref<typeof ElForm>();


    const getDetail = async (): Promise<void> => {
        const loading = ElLoading.service({lock: true})
        try {
          const response: ResponseData = await configDetail();
          const { data } = response;
          const { keywords, description, siteCreationTime, icp, copyrightPerson, copyrightUrl } = data;

          modelRef.keywords = keywords;
          modelRef.description = description;         
          modelRef.siteCreationTime = siteCreationTime;
          modelRef.icp = icp;
          modelRef.copyrightPerson = copyrightPerson;
          modelRef.copyrightUrl = copyrightUrl;
         
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
                    keywords: modelRef.keywords,
                    description: modelRef.description,
                    siteCreationTime: modelRef.siteCreationTime,
                    icp: modelRef.icp,
                    copyrightPerson: modelRef.copyrightPerson,
                    copyrightUrl: modelRef.copyrightUrl,
                };
                await configAdd(paramData);

                ElMessage({
                  message: t('views.setting.siteconfig.submit.confirm.msg'),
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

    <page-header>{{t('views.setting.siteconfig.header.title')}}</page-header>

    <el-form label-position="top" :model="modelRef" :rules="rulesRef" ref="formRef">
        <el-card shadow="never" class="border-none margin-t24">
            <template #header>
                <span>{{t('views.setting.siteconfig.base.title')}}</span>
            </template>
            <el-row :gutter="24">              
                
                <el-col :sm="24" :md="12" :lg="8">
                    <el-form-item :label="t('views.setting.siteconfig.form.keywords')" prop="keywords">
                      <el-input v-model.trim="modelRef.keywords" :placeholder="t('views.setting.siteconfig.form.keywords.placeholder')"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :sm="24" :md="12" :lg="8">
                    <el-form-item :label="t('views.setting.siteconfig.form.description')" prop="description">
                      <el-input v-model.trim="modelRef.description" :placeholder="t('views.setting.siteconfig.form.description.placeholder')"></el-input>
                    </el-form-item>
                </el-col>

                 <el-col :sm="24" :md="12" :lg="8">
                    <el-form-item :label="t('views.setting.siteconfig.form.siteCreationTime')" prop="siteCreationTime">
                      <el-date-picker
                        v-model="modelRef.siteCreationTime"
                        type="year"
                        :placeholder="t('views.setting.siteconfig.form.siteCreationTime.placeholder')"
                        value-format="YYYY"
                        class="width-percent100">
                    </el-date-picker>
                    </el-form-item>
                </el-col> 
                 

                <el-col :sm="24" :md="12" :lg="8">
                    <el-form-item :label="t('views.setting.siteconfig.form.icp')" prop="icp">
                      <el-input v-model.trim="modelRef.icp" :placeholder="t('views.setting.siteconfig.form.icp.placeholder')"></el-input>
                    </el-form-item>
                </el-col>

                <el-col :sm="24" :md="12" :lg="8">
                    <el-form-item :label="t('views.setting.siteconfig.form.copyrightPerson')" prop="copyrightPerson">
                      <el-input v-model.trim="modelRef.icp" :placeholder="t('views.setting.siteconfig.form.copyrightPerson.placeholder')"></el-input>
                    </el-form-item>
                </el-col>

                <el-col :sm="24" :md="12" :lg="8">
                    <el-form-item :label="t('views.setting.siteconfig.form.copyrightUrl')" prop="copyrightUrl">
                      <el-input v-model.trim="modelRef.icp" :placeholder="t('views.setting.siteconfig.form.copyrightUrl.placeholder')"></el-input>
                    </el-form-item>
                </el-col>




            </el-row>
        </el-card>
    </el-form>

   

    <form-footer-toolbar class="text-right">
        <el-button type="primary" :loading="submitLoading" @click="handleSubmit" >{{t('views.setting.siteconfig.form.btn.submit')}}</el-button>
    </form-footer-toolbar>





</div>
</template>