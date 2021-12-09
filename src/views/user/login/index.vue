<template>
    <div class="main">
        <h1 class="title">
            {{t('page.user.login.form.title')}}
        </h1>
        <el-form :model="modelRef" :rules="rulesRef" ref="formRef">
            <el-form-item  label="" prop="username">
                <el-input v-model.trim="modelRef.username" :placeholder="t('page.user.login.form-item-username')" @keydown.enter="handleSubmit">
                    <template #prefix>
                        <i class="el-input__icon">
                            <icon-svg type="user"></icon-svg>
                        </i>
                    </template>
                </el-input>
            </el-form-item>
            <el-form-item label="" prop="password">
                <el-input v-model.trim="modelRef.password" type="password" :placeholder="t('page.user.login.form-item-password')" @keydown.enter="handleSubmit">
                    <template #prefix>
                         <i class="el-input__icon">
                            <icon-svg type="pwd"></icon-svg>
                        </i>
                    </template>
                </el-input>
            </el-form-item>
            <el-form-item label="" prop="imgCode">
                 <el-row>
                    <el-col :span="14">
                        <el-input v-model.trim="modelRef.imgCode" autocomplete="off" :placeholder="t('page.user.login.form-item-imgcode')" @keydown.enter="handleSubmit">
                            <template #prefix>
                                <i class="el-input__icon">
                                    <icon-svg type="permissions"></icon-svg>
                                </i>
                            </template>
                        </el-input>
                    </el-col>
                    <el-col :span="10">
                        <el-tooltip effect="light" :content="t('page.user.login.form-item-imgcode.click-tips')" placement="bottom-end">
                            <div class="imgcode" v-loading="imgCodeDataLoading" @click="getImgCode()">
                                <img :src="imgCodeData">
                            </div>
                        </el-tooltip>
                    </el-col>
                </el-row>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" class="submit" @click="handleSubmit" :loading="submitLoading">
                    {{t('page.user.login.form.btn-submit')}}
                </el-button>  
                <div class="text-align-right">
                   <!--  <router-link to="/user/register">
                        {{t('page.user.login.form.btn-jump')}}
                    </router-link> -->
                </div>              
            </el-form-item>

            <el-alert v-if="loginStatus === 'error' && !submitLoading" :title="t('page.user.login.form.login-error')" type="error" show-icon :closable="false" />

        </el-form>
    </div>
</template>
<script lang="ts">
import { computed, defineComponent, reactive, ref, Ref, ComputedRef, onMounted } from "vue";
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { useI18n } from "vue-i18n";
import { ElForm, ElMessage } from 'element-plus';
import IconSvg from "@/components/IconSvg";
import { LoginParamsType } from './data.d';
import { StateType as UserLoginStateType } from './store';

interface UserLoginSetupData {
    t: (key: string | number) => string;
    imgCodeDataLoading: Ref<boolean>;
    imgCodeData: Ref<string>;
    getImgCode: () => void;
    modelRef: LoginParamsType;
    rulesRef: any;
    formRef: Ref<typeof ElForm | undefined>;
    submitLoading: Ref<boolean>;
    handleSubmit: () => Promise<void>;
    loginStatus: ComputedRef<"ok" | "error" | undefined>;
}

export default defineComponent({
    name: 'UserLogin',
    components: {
        IconSvg
    },
    setup(): UserLoginSetupData {
        const router = useRouter();
        const { currentRoute } = router;
        const store = useStore<{userlogin: UserLoginStateType}>();
        const { t } = useI18n();

        // 验证码
        const imgCodeDataLoading = computed<boolean>(()=> store.state.userlogin.imgCodeDataLoading);
        const imgCodeData = computed<string>(()=> store.state.userlogin.imgCodeData);
        const imgCodeToken= computed<string>(()=> store.state.userlogin.imgCodeToken);
        const getImgCode = (): void => {
            store.dispatch('userlogin/getImgCode')
        }


        // 表单值
        const modelRef = reactive<LoginParamsType>({
            username: '',
            password: '',
            imgCode: '',
            imgCodeToken: ''
        });
        // 表单验证
        const rulesRef = reactive({
            username: [
                {
                    required: true,
                    message: t('page.user.login.form-item-username.required'),
                },
            ],
            password: [
                {
                    required: true,
                    message: t('page.user.login.form-item-password.required'),
                },
            ],  
            imgCode: [
                { 
                    required: true, 
                    message: t('page.user.login.form-item-imgcode.required'),
                }

            ]            
        });
        // form
        const formRef = ref<typeof ElForm>();
        // 登录loading
        const submitLoading = ref<boolean>(false);
        // 登录
        const handleSubmit = async () => {
            submitLoading.value = true;
            try {
                const valid: boolean | undefined =  await formRef.value?.validate();
                if(valid === true) {
                    modelRef.imgCodeToken = imgCodeToken.value;
                    const res: boolean = await store.dispatch('userlogin/login',modelRef);
                    if (res === true) {
                        ElMessage.success(t('page.user.login.form.login-success'));
                        const { redirect, ...query } = currentRoute.value.query;
                        router.replace({
                            path: redirect as string || '/',
                            query: {
                                ...query
                            }
                        });
                    } 
                }
            } catch (error) {
                // console.log(error);
                ElMessage.warning(t('app.global.form.validatefields.catch'));
            }
            submitLoading.value = false;
        }

        // 登录状态
        const loginStatus = computed<"ok" | "error" | undefined>(()=> store.state.userlogin.loginStatus);

        onMounted(()=> {
            getImgCode()
        })


        return {
            t,
            imgCodeDataLoading,
            imgCodeData,
            getImgCode,
            modelRef,
            rulesRef,
            formRef,
            submitLoading,
            handleSubmit,
            loginStatus
        }
    }
})
</script>
<style lang="scss" scoped>
.main {
  flex: none;
  width: 248px;
  padding: 36px;
  margin: 0 auto;
  border-radius: 4px;
  background-color: rgba(255, 255, 255, 0.2);
  .title {
    font-size: 28px;
    margin-top: 0;
    margin-bottom: 30px;
    text-align: center;
    color: #ffffff;
    /* background-image:-webkit-linear-gradient(right,#FFFFFF,#009688, #FFFFFF); 
        -webkit-background-clip: text; 
        -webkit-text-fill-color:transparent; */
  }
  .submit {
    width: 100%;
  }
  .imgcode {        
        width: 90%;
        height: 32px;
        cursor: pointer;
        border-radius: 3px;
        float: right;
        img {
            border-radius: 3px;
            width: 100%;
            height: 100%;
        }
    }
}

</style>