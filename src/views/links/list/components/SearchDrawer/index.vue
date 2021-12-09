<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
    name: 'SearchDrawer',
})
</script>
<script lang="ts" setup>
    import RestElDrawer from "@/components/RestElDrawer/index.vue";
    import LinksCategorySelect from "@/components/Custom/LinksCategorySelect/index.vue";
    import { SearchFormItem, SearchValues } from "./data.d";
    import { ElForm } from "element-plus";
    import { useI18n } from "vue-i18n";
    import { reactive, ref, computed, defineProps, defineEmits, withDefaults, defineExpose } from "vue";
    
    const { t } = useI18n();

    interface Props {
        modelValue: boolean;
        title?: string;
        onReset: (values: SearchValues) => void;
        onSubmit: (values: SearchValues) => void;
    }
    
    const props = withDefaults(defineProps<Props>(), {
        title: 'Search'/* t('views.links.list.components.search.title') */
    })

    const emit = defineEmits(['update:modelValue'])
    const visible = computed<boolean>({
        get: () => props.modelValue,
        set: val => {
            emit('update:modelValue', val);
        }
    });

    // 表单值
    const modelRef = reactive<SearchFormItem>({
        keywords: '',
        categoryid: ''
    });
    const setModelRef = (param: SearchFormItem): void => {
        modelRef.keywords = param.keywords || '';         
        modelRef.categoryid = param.categoryid ||  '';         
    }
        
        
     // form
    const formRef = ref<typeof ElForm>(); 
    const onResetFrom = async (): Promise<void> => {
        try {    
            setModelRef({
                keywords: '',
                categoryid: ''
            });
            props.onReset({
                keywords: '',
                categoryid: ''               
            });
        } catch (error) {
            console.log('error', error);
        }
    }
    const onSearch = async (): Promise<void> => {
        try {               
            props.onSubmit({
                keywords: modelRef.keywords,
                categoryid: modelRef.categoryid               
            });
        } catch (error) {
            console.log('error', error);
        }
    }

    defineExpose({
        setModelRef
    })

</script>
<template>
    <rest-el-drawer
      size="390px"
      :title="title"
      v-model="visible"
    >
        
        <el-form label-position="top" :model="modelRef" ref="formRef">               
            
            <el-form-item :label="t('views.links.list.components.search.form.keywords')" >
                <el-input v-model="modelRef.keywords" :placeholder="t('views.links.list.components.search.form.keywords.placeholder')" />
            </el-form-item>
            <el-form-item :label="t('views.links.list.components.search.form.category')" >
                <links-category-select v-model="modelRef.categoryid" :placeholder="t('views.links.list.components.search.form.category.placeholder')"   class="width-percent100" > </links-category-select>
            </el-form-item>
            
        </el-form>
        


        <template #footer>
            <div class="text-align-right">
                <el-button style="margin-right: 8px" @click="onResetFrom">
                    {{t('views.links.list.components.search.form.button.reset')}}
                </el-button>
                <el-button type="primary" @click="onSearch">
                    {{t('views.links.list.components.search.form.button.primary')}}
                </el-button>
            </div>
        </template>

      
    </rest-el-drawer>
</template>
<style lang="scss" scoped>
</style>