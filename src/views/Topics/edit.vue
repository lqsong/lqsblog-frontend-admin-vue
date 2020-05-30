<template>
    <div class="main-conent main-conent-minheight form-footer">


        <page-header>专题修改</page-header>

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
                    <el-form-item label="别名" prop="alias">
                      <el-input v-model.trim="ruleForm.alias"></el-input>
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
              </el-row>
          </el-card>
        </el-form>



        <el-card shadow="never" class="border-none margin-t24">
            <div slot="header">
              <span><el-link type="danger" :underline="false">*</el-link> 关联内容</span>
              <el-button type="text" class="float-right padding-tb3" size="medium" @click="searchListDrawerParams.visible=true">新增关联</el-button>
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
                min-width="80">
              </el-table-column>
              <el-table-column
                prop="type"
                label="类型"
                min-width="65">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.type === 1">随笔</el-tag>
                        <el-tag type="success" v-else>作品</el-tag>                  
                    </template>
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
                    @click="deleteContentRow(scope.$index)"
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

      
      <search-list-drawer :params="searchListDrawerParams" title="选择关联内容">
        <template slot="el-table-column">
          <el-table-column
            fixed="right"
            width="100"
            label="操作">
            <template slot-scope="scope">
              <el-button
                v-if="tableDataTypeIds.includes(scope.row.type + '-' + scope.row.id)"
                disabled
                type="info"
                size="mini">
                已选择
              </el-button>
              <el-button
                v-else
                type="primary"
                size="mini"
                @click="selectContent(scope.row)">
                选择
              </el-button>                     
            </template>
          </el-table-column>
        </template>
      </search-list-drawer>




    </div>
  
</template>
<script>
import { TopicsDetail, TopicsEdit } from '@/service/topics';
import FormFooterToolbar from '@/layout/components/FormFooterToolbar';
import PageHeader from '@/layout/components/PageHeader';
import SearchListDrawer from '@/components/Custom/SearchListDrawer';
import mixin from '@/views/mixin';
export default {
    mixins: [mixin],
    components: {
      FormFooterToolbar,
      PageHeader,
      SearchListDrawer
    },
    data() {
      return {
        // 获取ID
        id: this.$route.params.id,
        // 表单数据
        ruleFormLoading: false,
        ruleForm: {
          title: '',
          alias: '',
          addtime: '',
          keywords: '',
          description: ''   
        },
        rules: {
          title: [
            { required: true, message: '请输入标题', trigger: 'blur' },
            { min: 5, max: 100, message: '长度在 5 到 100 个字', trigger: 'blur' }
          ],
          alias: [
              { 
                  required: true,
                  validator: (rule, value, callback) => {
                      if (value === '') {
                          callback(new Error('请输入别名'));
                      } else if (!/^[a-z0-9]+$/.test(value)) {
                          callback(new Error('必须是小写字母、数字'));
                      } else if (value.length > 10) {
                          callback(new Error('最长 10 个字符'));
                      }else {
                          callback();
                      }
                  },
                  trigger: 'blur' 
              }
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
        // 关联内容 - Drawer 选择列表
        searchListDrawerParams: {
          visible: false
        },
        // 关联内容 - 展示列表
        tableData: [
          /* {
            type: 1,
            id: 1,
            title: '上海市普陀区金沙江路',
            description: '上海市普陀区金沙江路',
            thumb: "http://dummyimage.com/88x31|http://dummyimage.com/88x31",
            addtime: '2016-05-03 10:10:10',
            category: {
              "id": 6991525294906196,
              "alias": "ucbc",
              "name": "却识华造"
            }
          } */
        ]
      };
    },
    computed: {
      // 关联内容列表 - id 数组
      tableDataTypeIds: function() {
        const _this = this;
        const len = _this.tableData.length;
        let arr = [];
        for (let index = 0; index < len; index++) {
          arr.push(_this.tableData[index]['type'] + '-' + _this.tableData[index]['id']);          
        }
        return arr;
      }
    },
    methods: {
      // 关联内容列表 - 新增 - 选择
      selectContent(row) {
        const _this = this;
        _this.tableData.push({
            type: row.type,
            id: row.id,
            title: row.title,
            description: row.description,
            thumb: row.thumb,
            addtime: row.addtime,
            category: row.category
        });
        _this.$message({ message: '选择成功！', type: 'success' });
      },
      // 关联内容列表 - 删除
      deleteContentRow(index) {
        this.tableData.splice(index, 1);
      },
      // 表单 - 提交
      submitForm(formName) {
        const _this = this;
        _this.$refs[formName].validate((valid) => {

          if(_this.tableData.length < 1) {
            _this.$message({ message: '请关联内容！', type: 'error' });
            return false;
          }

          if (valid) {

                _this.ruleFormLoading = true;
            
                const paramData = {
                    title: _this.ruleForm.title,
                    alias: _this.ruleForm.alias,
                    keywords: _this.ruleForm.keywords,
                    description: _this.ruleForm.description,
                    addtime: _this.ruleForm.addtime,
                    content: _this.tableData
                };
                TopicsEdit(_this.id, paramData).then(res => {
                    const { code } = res;
                    if (code === 0 ) {
                        _this.$message({
                            message: '修改成功！',
                            type: 'success',
                            onClose: () => {
                                _this.$router.push('/topics/list');       
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
          TopicsDetail(_this.id).then(res => {
              const { code, data } = res;
              loading.close();
              if(code === 0) {
                  
                  const { title, alias, keywords, description, addtime, content } = data;

                  _this.ruleForm.title = title;
                  _this.ruleForm.alias = alias;
                  _this.ruleForm.keywords = keywords;
                  _this.ruleForm.description = description;
                  _this.ruleForm.addtime = addtime;
                  _this.tableData = content;

              } else {
                  _this.$router.push('/topics/list');
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
