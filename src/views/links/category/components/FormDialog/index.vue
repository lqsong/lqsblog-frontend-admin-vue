<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
    name: 'FormDialog',
})
</script>
<script lang="ts" setup>
    import { reactive, ref, computed, defineProps, defineEmits, withDefaults, defineExpose } from "vue";
    import { useI18n } from "vue-i18n";
    import { ElForm, ElMessage } from "element-plus";
    import { CategoryItem } from "../../data.d";
    import { DataItem, FormItem } from "./data.d";

    interface Props {
        modelValue: boolean;
        submitLoading?: boolean;
        values?: CategoryItem;
        title?: string;
        onSubmit: (values: DataItem) => Promise<void>;
    }

    const props = withDefaults(defineProps<Props>(), {
        submitLoading: false,
        title: 'Form',
    })


    const { t } = useI18n();


    const emit = defineEmits(['update:modelValue','update:submitLoading'])
    const visible = computed<boolean>({
        get: () => props.modelValue,
        set: val => {
            emit('update:modelValue', val);
        }
    });
    const submitLoading = computed<boolean>({
        get: () => props.submitLoading,
        set: val => {
            emit('update:submitLoading', val);
        }
    });

    const defaultValues: CategoryItem = props.values || {
        id: 0,
        name: '',
        alias: '',
        sort: 0
    };


    // 表单值
    const modelRef = reactive<FormItem>({
        name: defaultValues.name || '',
        alias:  defaultValues.alias || '',
        sort:  defaultValues.sort || 0
    });
    // 表单验证
    const rulesRef = reactive({
        name: [
           { 
                required: true,
                validator: (rule, value, callback) => {
                    if (value === '') {
                        callback(new Error(t('views.links.category.components.formdialog.name.placeholder')));
                    } else if (/[,]+/.test(value)) {
                        callback(new Error(t('views.links.category.components.formdialog.name.test')));
                    } else if (value.length > 10) {
                        callback(new Error(t('views.links.category.components.formdialog.name.max')));
                    }else {
                        callback();
                    }
                },
                trigger: 'blur' 
            }
        ],
        alias: [
            { 
                required: true,
                validator: (rule, value, callback) => {
                    if (value === '') {
                        callback(new Error(t('views.links.category.components.formdialog.alias.placeholder')));
                    } else if (!/^[a-z]+$/.test(value)) {
                        callback(new Error(t('views.links.category.components.formdialog.alias.test')));
                    } else if (value.length > 50) {
                        callback(new Error(t('views.links.category.components.formdialog.alias.max')));
                    }else {
                        callback();
                    }
                },
                trigger: 'blur' 
            }
        ],
        sort: [
            {required: true, message: t('views.links.category.components.formdialog.sort.placeholder'), trigger: 'blur'}
        ]         
    });
    // form
    const formRef = ref<typeof ElForm>();
    // submit
    const handleSubmit = async (): Promise<void> => {
        
        submitLoading.value = true;
        try {
            const valid: boolean | undefined =  await formRef.value?.validate();
            if(valid === true) {               
                await props.onSubmit(modelRef);
            }
        } catch (error) {
            // console.log(error);
            ElMessage.warning(t('app.global.form.validatefields.catch'));
        }
        submitLoading.value = false;
    }




</script>
<template>
    <el-dialog
            :title="props.title"
            width="500px"
            :close-on-click-modal="false"
            v-model="visible">

                <el-form :model="modelRef" :rules="rulesRef" ref="formRef" label-width="130px" >
                    
                    <el-form-item :label="t('views.links.category.components.formdialog.name')" prop="name">
                        <el-input v-model.trim="modelRef.name" :placeholder="t('views.links.category.components.formdialog.name.placeholder')" class="width-200"></el-input>
                    </el-form-item>
                    <el-form-item :label="t('views.links.category.components.formdialog.alias')" prop="alias">
                        <el-input v-model.trim="modelRef.alias" :placeholder="t('views.links.category.components.formdialog.alias.placeholder')" class="width-200"></el-input>
                    </el-form-item>
                    <el-form-item :label="t('views.links.category.components.formdialog.sort')" prop="sort">
                        <el-input-number :min="0" :max="999" v-model="modelRef.sort" type="textarea" autosize :placeholder="t('views.links.category.components.formdialog.sort.placeholder')" class="width-200"></el-input-number>
                    </el-form-item>                                     
                </el-form>

            <template  #footer>
                <el-button @click="visible=false">{{t('views.links.category.components.formdialog.btn.cancel')}}</el-button>
                <el-button type="primary" :loading="submitLoading" @click="handleSubmit">{{t('views.links.category.components.formdialog.btn.save')}}</el-button>
            </template>
        </el-dialog>
</template>