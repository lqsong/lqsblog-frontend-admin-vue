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
    import LinksCategorySelect from "@/components/Custom/LinksCategorySelect/index.vue";
    import { OptionItem } from '@/components/Custom/LinksCategorySelect/data.d';
    import ServerImageSelectionList from '@/components/Custom/ServerImage/SelectionList/index.vue';
    import { Link, DataItem, FormItem } from "./data.d";

    interface Props {
        modelValue: boolean;
        submitLoading?: boolean;
        values?: Link;
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

    const defaultValues: Link = props.values || {
        id: 0,
        category: { id:0, name: '', alias: '' },
        href: '',
        description: '',
        logo: '',
        title: '',
    };

    const categoryDefaultOptions = ref<OptionItem[]>(defaultValues.category.id > 0? [{value: defaultValues.category.id,label: defaultValues.category.name}] : [])

    // 表单值
    const modelRef = reactive<FormItem>({
        categoryId: defaultValues.category.id || '',
        title: defaultValues.title || '',
        href:  defaultValues.href || '',
        description:  defaultValues.description || '',
        logo: defaultValues.logo ? [defaultValues.logo] : []
    });
    // 表单验证
    const rulesRef = reactive({
        categoryId: [
            { required: true, message: t('views.links.list.components.formdialog.category.placeholder'), trigger: 'change' }
        ],
        title: [
            { required: true, message: t('views.links.list.components.formdialog.title.placeholder'), trigger: 'blur' },
            { max: 50, message: t('views.links.list.components.formdialog.title.max'), trigger: 'blur' }
        ],
        description: [
            { required: true, message: t('views.links.list.components.formdialog.description.placeholder'), trigger: 'blur' },
            { max: 100, message: t('views.links.list.components.formdialog.description.max'), trigger: 'blur' }
        ],
        href: [
            { 
                required: true,
                validator: (rule, value, callback) => {
                    if (value === '') {
                        callback(new Error(t('views.links.list.components.formdialog.href.placeholder')));
                    } else if (!/^(https?:)/.test(value)) {
                        callback(new Error(t('views.links.list.components.formdialog.href.test')));
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
    // submit
    const handleSubmit = async (): Promise<void> => {
        
        submitLoading.value = true;
        try {
            const valid: boolean | undefined =  await formRef.value?.validate();
            if(valid === true) {               
                await props.onSubmit({
                    categoryId: modelRef.categoryId,
                    title: modelRef.title,
                    href: modelRef.href,
                    description: modelRef.description,
                    logo: modelRef.logo.join(',')
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
    <el-dialog
            :title="props.title"
            width="500px"
            :close-on-click-modal="false"
            v-model="visible">

                <el-form :model="modelRef" :rules="rulesRef" ref="formRef" label-width="130px" >
                    <el-form-item :label="t('views.links.list.components.formdialog.category')" prop="categoryId">
                        <links-category-select
                           :default-options="categoryDefaultOptions"
                            v-model="modelRef.categoryId"
                            :placeholder="t('views.links.list.components.formdialog.category.placeholder')"
                            class="width-200">                        
                        </links-category-select>
                    </el-form-item>
                    <el-form-item :label="t('views.links.list.components.formdialog.title')" prop="title">
                        <el-input v-model.trim="modelRef.title" :placeholder="t('views.links.list.components.formdialog.title.placeholder')" class="width-200"></el-input>
                    </el-form-item>
                    <el-form-item :label="t('views.links.list.components.formdialog.href')" prop="href">
                        <el-input v-model.trim="modelRef.href" :placeholder="t('views.links.list.components.formdialog.href.placeholder')" class="width-200"></el-input>
                    </el-form-item>
                    <el-form-item :label="t('views.links.list.components.formdialog.description')" prop="description">
                        <el-input v-model.trim="modelRef.description" type="textarea" autosize :placeholder="t('views.links.list.components.formdialog.description.placeholder')" class="width-200"></el-input>
                    </el-form-item>
                    <el-form-item :label="t('views.links.list.components.formdialog.logo')">
                        <server-image-selection-list v-model="modelRef.logo" :limit="1"></server-image-selection-list>
                    </el-form-item>                    
                </el-form>

            <template  #footer>
                <el-button @click="visible=false">{{t('views.links.list.components.formdialog.btn.cancel')}}</el-button>
                <el-button type="primary" :loading="submitLoading" @click="handleSubmit">{{t('views.links.list.components.formdialog.btn.save')}}</el-button>
            </template>
        </el-dialog>
</template>