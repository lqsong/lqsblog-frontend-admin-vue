<template>
    <div class="main-conent main-conent-minheight form-footer">


        <page-header>关于我</page-header>

        <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
          <el-card shadow="never" class="border-none margin-t24">
              <div slot="header">
                <span>基本信息</span>
              </div>
              <el-row :gutter="24">
                  <el-col :sm="24" :md="12" :lg="8">
                    <el-form-item label="标题" prop="title">
                      <el-input v-model.trim="ruleForm.title"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :sm="24" :md="12" :lg="8">
                    <el-form-item label="Keywords" prop="keywords">
                      <el-input v-model.trim="ruleForm.keywords"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :sm="24" :md="12" :lg="8">
                    <el-form-item label="Description" prop="description">
                      <el-input v-model.trim="ruleForm.description"></el-input>
                    </el-form-item>
                  </el-col>
              </el-row>
          </el-card>
        </el-form>


        <el-card shadow="never" class="border-none margin-t24">
            <div slot="header">
              <span>详细内容</span>
            </div>
            <tui-editor ref="tuieditor" v-model="ruleForm.content" ></tui-editor>
        </el-card>

     


      <form-footer-toolbar class="text-right">
            <el-button type="primary" @click="submitForm('ruleForm')" :loading="ruleFormLoading">提交</el-button>
      </form-footer-toolbar>

      




    </div>
  
</template>
<script>
import { AboutDetail, AboutAdd } from '@/service/setting';
import FormFooterToolbar from '@/layout/components/FormFooterToolbar';
import PageHeader from '@/layout/components/PageHeader';
import TuiEditor from '@/components/TuiEditor';
export default {
    components: {
      FormFooterToolbar,
      PageHeader,
      TuiEditor
    },
    data() {
      return {
        // 表单数据
        ruleFormLoading: false,
        ruleForm: {
          title: '',
          keywords: '',
          description: '',
          content: ''        
        },
        rules: {
          title: [
            { required: true, message: '请输入标题', trigger: 'blur' }
          ],
          keywords: [
            { required: true, message: '请输入Keywords', trigger: 'blur' }
          ],
          description: [
            { required: true, message: '请输入Description', trigger: 'blur' }
          ]
        }
      };
    },
    computed: {
    },
    methods: {
        // 表单 - 提交
        submitForm(formName) {
            const _this = this;
            _this.$refs[formName].validate((valid) => {
            if (valid) {

                    _this.ruleFormLoading = true;

                
                    const paramData = {
                        title: _this.ruleForm.title,
                        keywords: _this.ruleForm.keywords,
                        description: _this.ruleForm.description,
                        content: _this.ruleForm.content
                    };
                    AboutAdd(paramData).then(res => {
                        const { code } = res;
                        if (code === 0 ) {
                            _this.$message({
                                message: '修改成功！',
                                type: 'success'
                            });
                        }                        
                        _this.ruleFormLoading = false;
                    }).catch(() => {
                        _this.ruleFormLoading = false;
                    });
                
                
            } else {
                _this.$message({ message: '验证不通过，请检查输入！', type: 'error' });
                console.log('error submit!!');
                return false;
            }
            });
        },
        // 详情 - 获取
        getDetail() {
            const _this = this;
            const loading = _this.$loading({ lock: true });
            AboutDetail().then(res => {
                const { code, data } = res;
                loading.close();
                if(code === 0) {
                    
                    const { title, keywords, description, content } = data;

                    _this.ruleForm.title = title;
                    _this.ruleForm.keywords = keywords;
                    _this.ruleForm.description = description;
                    _this.ruleForm.content = content;

                }                
            }).catch(() => {
                console.log('Data error!!');
            });
        }
    },
    mounted() {        
        this.getDetail();
    }
};
</script>
