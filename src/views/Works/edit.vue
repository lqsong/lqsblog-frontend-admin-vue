<template>
    <div class="main-conent main-conent-minheight form-footer">


        <page-header>作品修改</page-header>

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
                    <el-form-item label="发布时间" prop="addtime">
                      <el-date-picker type="datetime" placeholder="选择日期" v-model="ruleForm.addtime" class="width-100%" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
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
                  <el-col :sm="24" :md="12" :lg="8">
                    <el-form-item label="标签">
                      <tag-select
                        v-model="ruleForm.tag"
                        class="width-100%">
                      </tag-select>
                    </el-form-item>
                  </el-col>
              </el-row>
          </el-card>
        </el-form>

        <el-card shadow="never" class="border-none margin-t24">
            <div slot="header">
              <span>缩略图</span>
              <el-link type="warning" :underline="false" class="margin-l10">最多选择 4 张图片，请上传处理好的缩略图</el-link>
            </div>

            <server-image-selection-list :limit="4" :value="ruleForm.thumb"></server-image-selection-list>
            
        </el-card>

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
import { WorksDetail, WorksEdit } from '@/service/works';
import { trimComma, trimVerticalBar } from '@/utlis/trim';
import FormFooterToolbar from '@/layout/components/FormFooterToolbar';
import PageHeader from '@/layout/components/PageHeader';
import TuiEditor from '@/components/TuiEditor';
import TagSelect from '@/components/Custom/TagSelect';
import ServerImageSelectionList from '@/components/Custom/ServerImage/SelectionList';
import mixin from '@/views/mixin';
export default {
    mixins: [mixin],
    components: {
      FormFooterToolbar,
      PageHeader,
      TuiEditor,
      TagSelect,
      ServerImageSelectionList
    },
    data() {
        return {
            // 获取ID
            id: this.$route.params.id,
            // 表单数据
            ruleFormLoading: false,
            ruleForm: {
                title: '',
                addtime: '',
                keywords: '',
                description: '',
                tag: [], 
                thumb: [],         
                content: ''        
            },
            rules: {
                title: [
                    { required: true, message: '请输入标题', trigger: 'blur' },
                    { min: 5, max: 100, message: '长度在 5 到 100 个字', trigger: 'blur' }
                ],
                addtime: [
                    { required: true, message: '请选择日期', trigger: 'change' }
                ],
                keywords: [
                    { required: true, message: '请输入Keywords', trigger: 'blur' },
                    { min: 2, max: 50, message: '长度在 2 到 50 个字', trigger: 'blur' }
                ],
                description: [
                    { required: true, message: '请输入Description', trigger: 'blur' },
                    { min: 10, max: 200, message: '长度在 10 到 200 个字', trigger: 'blur' }
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
                        addtime: _this.ruleForm.addtime,
                        tag: _this.ruleForm.tag.join(','),
                        thumb: _this.ruleForm.thumb.join('|'),
                        content: _this.ruleForm.content
                    };
                    WorksEdit(_this.id, paramData).then(res => {
                        const { code } = res;
                        if (code === 0 ) {
                            _this.$message({
                                message: '修改成功！',
                                type: 'success',
                                onClose: () => {
                                    _this.$router.push('/works/list');       
                                }
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
            WorksDetail(_this.id).then(res => {
                const { code, data } = res;
                loading.close();
                if(code === 0) {
                   
                   const { title, keywords, description, addtime, tag, thumb, content } = data;

                   _this.ruleForm.title = title;
                   _this.ruleForm.keywords = keywords;
                   _this.ruleForm.description = description;
                   _this.ruleForm.addtime = addtime;
                   _this.ruleForm.tag = trimComma(tag).split(',');
                   _this.ruleForm.thumb = trimVerticalBar(thumb).split('|');
                   _this.ruleForm.content = content;

                } else {
                    _this.$router.push('/works/list');
                }
                
            }).catch(() => {
                console.log('Data error!!');
            });
        }
    },
    mounted() {        
        const _this = this;
        // 验证id
        const verify = _this.verificationId(_this.id);
        if (!verify) {
            return;
        }

        _this.getDetail();

        
    }
};
</script>