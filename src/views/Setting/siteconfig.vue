<template>
    <div class="main-conent main-conent-minheight form-footer">


        <page-header>站点配置</page-header>

        <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
          <el-card shadow="never" class="border-none margin-t24">
              <div slot="header">
                <span>基本信息</span>
              </div>
              <el-row :gutter="24">
                  <el-col :sm="24" :md="12" :lg="8">
                    <el-form-item label="站点关键词" prop="keywords">
                      <el-input v-model.trim="ruleForm.keywords"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :sm="24" :md="12" :lg="8">
                    <el-form-item label="站点描述" prop="description">
                      <el-input v-model.trim="ruleForm.description"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :sm="24" :md="12" :lg="8">
                    <el-form-item label="站点创建年份" prop="siteCreationTime">
                      <el-date-picker
                        v-model="ruleForm.siteCreationTime"
                        type="year"
                        placeholder="选择年"
                        value-format="yyyy"
                        class="width-100%">
                    </el-date-picker>
                    </el-form-item>
                  </el-col>
                  <el-col :sm="24" :md="12" :lg="8">
                    <el-form-item label="网站备案号" prop="icp">
                      <el-input v-model.trim="ruleForm.icp"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :sm="24" :md="12" :lg="8">
                    <el-form-item label="版权人" prop="copyrightPerson">
                      <el-input v-model.trim="ruleForm.copyrightPerson"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :sm="24" :md="12" :lg="8">
                    <el-form-item label="版权网址" prop="copyrightUrl">
                      <el-input v-model.trim="ruleForm.copyrightUrl"></el-input>
                    </el-form-item>
                  </el-col>
              </el-row>
          </el-card>
        </el-form>


             


      <form-footer-toolbar class="text-right">
            <el-button type="primary" @click="submitForm('ruleForm')" :loading="ruleFormLoading">提交</el-button>
      </form-footer-toolbar>

      




    </div>
  
</template>
<script>
import { ConfigDetail, ConfigAdd } from '@/service/setting';
import FormFooterToolbar from '@/layout/components/FormFooterToolbar';
import PageHeader from '@/layout/components/PageHeader';
export default {
    components: {
      FormFooterToolbar,
      PageHeader
    },
    data() {
      return {
        // 表单数据
        ruleFormLoading: false,
        ruleForm: {
          keywords: '',
          description: '',
          siteCreationTime: '',
          icp: '',
          copyrightPerson: '',
          copyrightUrl: ''
        },
        rules: {
          keywords: [
            { required: true, message: '请输入Keywords', trigger: 'blur' }
          ],
          description: [
            { required: true, message: '请输入Description', trigger: 'blur' }
          ],
          siteCreationTime: [
            { required: true, message: '请选择年', trigger: 'change' }
          ],
          icp: [
            { required: true, message: '请输入网站备案号', trigger: 'blur' }
          ],
          copyrightPerson: [
            { required: true, message: '请输入版权人', trigger: 'blur' }
          ],
          copyrightUrl: [
            { 
                required: true,
                validator: (rule, value, callback) => {
                    if (value === '') {
                        callback(new Error('请输入版权网址'));
                    } else if (!/^(https?:)/.test(value)) {
                        callback(new Error('网址格式不正确[http / https]'));
                    }else {
                        callback();
                    }
                },
                trigger: 'blur' 
            }
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
                        keywords: _this.ruleForm.keywords,
                        description: _this.ruleForm.description,
                        siteCreationTime: _this.ruleForm.siteCreationTime,
                        icp: _this.ruleForm.icp,
                        copyrightPerson: _this.ruleForm.copyrightPerson,
                        copyrightUrl: _this.ruleForm.copyrightUrl                        
                    };
                    ConfigAdd(paramData).then(res => {
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
            ConfigDetail().then(res => {
                const { code, data } = res;
                loading.close();
                if(code === 0) {
                    
                    const { keywords, description, siteCreationTime, icp, copyrightPerson, copyrightUrl } = data;

                    _this.ruleForm.keywords = keywords;
                    _this.ruleForm.description = description;
                    _this.ruleForm.siteCreationTime = siteCreationTime;
                    _this.ruleForm.icp = icp;
                    _this.ruleForm.copyrightPerson = copyrightPerson;
                    _this.ruleForm.copyrightUrl = copyrightUrl;

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
