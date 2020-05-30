<template>
    <div class="main-conent main-conent-minheight form-footer">


        <page-header>随笔修改</page-header>

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
                    <el-form-item label="分类" prop="category">                   

                      <article-category-cascader
                        :params="categoryCascaderParams"
                        v-model="ruleForm.category"
                        class="width-100%">                        
                      </article-category-cascader>

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

        <el-card shadow="never" class="border-none margin-t24">
            <div slot="header">
              <span>推荐随笔</span>
              <el-link type="warning" :underline="false" class="margin-l10">最多选择 10 条随笔</el-link>
              <el-button type="text" class="float-right padding-tb3" size="medium" @click="articleListDrawerParams.visible=true">新增推荐</el-button>
            </div>
            <el-table
               header-row-class-name="custom-table-header"
               stripe
              :data="tableData">
              <el-table-column
                type="index"
                label="序号"
                min-width="50">
              </el-table-column>
              <el-table-column
                prop="id"
                label="ID"
                min-width="100">
              </el-table-column>
              <el-table-column
                prop="title"
                label="标题"
                min-width="300">
              </el-table-column>
              <el-table-column
                prop="addtime"
                label="发布时间"
                min-width="150">
              </el-table-column>
              <el-table-column
                fixed="right"
                label="操作"
                min-width="120">
                <template slot-scope="scope">
                  <el-button
                    @click="deleteArticleRow(scope.$index)"
                    type="text"
                    size="small">
                    移除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
        </el-card>

      


      <form-footer-toolbar class="text-right">
            <el-button type="primary" @click="submitForm('ruleForm')" :loading="ruleFormLoading">提交</el-button>
      </form-footer-toolbar>

      
      <article-list-drawer :params="articleListDrawerParams" title="选择推荐的随笔">
        <template slot="el-table-column">
          <el-table-column
            fixed="right"
            width="100"
            label="操作">
            <template slot-scope="scope">
              <el-button
                v-if="tableDataIds.includes(scope.row.id)"
                disabled
                type="info"
                size="mini">
                已选择
              </el-button>
              <el-button
                v-else
                type="primary"
                size="mini"
                @click="selectArticle(scope.row)">
                选择
              </el-button>                     
            </template>
          </el-table-column>
        </template>
      </article-list-drawer>




    </div>
</template>
<script>
import { ArticleDetail, ArticleEdit } from '@/service/article';
import { trimComma, trimVerticalBar } from '@/utlis/trim';
import FormFooterToolbar from '@/layout/components/FormFooterToolbar';
import PageHeader from '@/layout/components/PageHeader';
import TuiEditor from '@/components/TuiEditor';
import ArticleCategoryCascader from '@/components/Custom/ArticleCategoryCascader';
import TagSelect from '@/components/Custom/TagSelect';
import ServerImageSelectionList from '@/components/Custom/ServerImage/SelectionList';
import ArticleListDrawer from '@/components/Custom/ArticleListDrawer';
import mixin from '@/views/mixin';
export default {
    mixins: [mixin],
    components: {
      FormFooterToolbar,
      PageHeader,
      TuiEditor,
      ArticleCategoryCascader,
      TagSelect,
      ServerImageSelectionList,
      ArticleListDrawer
    },
    data() {
        return {
            // 获取随笔ID
            id: this.$route.params.id,
            categoryCascaderParams: {
              isEdit: true,
              dataLoading: true
            },
            // 表单数据
            ruleFormLoading: false,
            ruleForm: {
                title: '',
                category: [],
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
                category: [
                    { required: true, message: '请选择分类', trigger: 'change' }
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
            },
            // 推荐随笔 - Drawer 选择列表
            articleListDrawerParams: {
                visible: false
            },
            // 推荐随笔 - 展示列表
            tableData: [
                /* {
                    id: 8,
                    title: '上海市普陀区金沙江路',
                    addtime: '2016-05-03 10:10:10'
                } */
            ]
        };
    },
    computed: {
        // 推荐随笔列表 - id 数组
        tableDataIds: function() {
            const _this = this;
            const len = _this.tableData.length;
            let arr = [];
            for (let index = 0; index < len; index++) {
                arr.push(_this.tableData[index]['id']);          
            }
            return arr;
        }
    },
    methods: {
        // 推荐随笔列表 - 新增随笔 - 选择文章
        selectArticle(row) {
            const _this = this;
            if(_this.tableData.length >=10 ) {
            _this.$message({ message: '最多选择 10 条随笔！', type: 'error' });
            _this.articleListDrawerParams.visible = false;
            return false;
            }
            _this.tableData.push({
                id: row.id,
                title: row.title,
                addtime: row.addtime
            });
            _this.$message({ message: '选择成功！', type: 'success' });
        },
        // 推荐随笔列表 - 删除
        deleteArticleRow(index) {
            this.tableData.splice(index, 1);
        },
        // 表单 - 提交
        submitForm(formName) {
            const _this = this;
            _this.$refs[formName].validate((valid) => {
            if (valid) {

                    _this.ruleFormLoading = true;

                    const categoryLen = _this.ruleForm.category.length;

                    const categoryId = categoryLen > 0 ? _this.ruleForm.category[categoryLen - 1] : '';
                
                    const paramData = {
                        title: _this.ruleForm.title,
                        keywords: _this.ruleForm.keywords,
                        description: _this.ruleForm.description,
                        addtime: _this.ruleForm.addtime,
                        categoryId: categoryId,
                        categoryIds: _this.ruleForm.category.join(','),
                        tag: _this.ruleForm.tag.join(','),
                        thumb: _this.ruleForm.thumb.join('|'),
                        content: _this.ruleForm.content,
                        interestIds: _this.tableDataIds.join(',')
                    };
                    ArticleEdit(_this.id, paramData).then(res => {
                        const { code } = res;
                        if (code === 0 ) {
                            _this.$message({
                                message: '修改成功！',
                                type: 'success',
                                onClose: () => {
                                    _this.$router.push('/article/list');       
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
            ArticleDetail(_this.id).then(res => {
                const { code, data } = res;
                loading.close();
                if(code === 0) {
                   
                   const { title, keywords, description, addtime, categoryIds, tag, thumb, content, interest } = data;

                   let categoryArr = trimComma(categoryIds).split(',');

                   _this.ruleForm.title = title;
                   _this.ruleForm.keywords = keywords;
                   _this.ruleForm.description = description;
                   _this.ruleForm.addtime = addtime;
                   _this.ruleForm.category = categoryArr.map(item=> {
                     return item * 1;
                   });
                   _this.ruleForm.tag = trimComma(tag).split(',');
                   _this.ruleForm.thumb = trimVerticalBar(thumb).split('|');
                   _this.ruleForm.content = content;
                   _this.tableData = interest;

                   _this.categoryCascaderParams.isEdit = false;

                } else {
                    _this.$router.push('/article/list');
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