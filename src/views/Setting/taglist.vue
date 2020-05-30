<template>
    <div class="main-conent main-conent-screen main-conent-bgFFF main-conent-borderradius">
            <div class="screen-header">
                <el-row>
                    <el-col :span="8">
                        <el-button type="primary" @click="dialogFormVisible = true"><svg-icon icon-class="button-add" /> 新增标签</el-button>
                    </el-col>
                    <el-col :span="16" class="text-right">
                        <el-input
                            class="margin-l10 width-200"
                            placeholder="请输入搜索内容"
                            v-model="keywords"
                            @keyup.enter.native="handleSearch">
                            <i slot="suffix" class="el-input__icon el-icon-search cursor-pointer" @click="handleSearch"></i>
                        </el-input>
                    </el-col>
                </el-row>              
            </div>

           <screen-table
               v-loading="tableLoading"
               class="screen-conent"
               table-class="custom-table"
               header-row-class-name="custom-table-header"
               :data="tableData">
                    <el-table-column
                        label="序号"
                        type="index"
                        :index="tableIndexMethod"
                        width="100">
                    </el-table-column>
                    <el-table-column
                        prop="name"
                        label="名称"
                        min-width="200">
                    </el-table-column>
                    <el-table-column
                        prop="pinyin"
                        label="汉语拼音"
                        min-width="200">
                    </el-table-column>
                    <el-table-column
                        fixed="right"
                        label="操作"
                        width="120">
                        <template slot-scope="scope">
                            <el-button
                                type="text"
                                size="mini"
                                @click="edit(scope.$index, scope.row)">
                                修改
                            </el-button>

                            <el-button
                                type="text"
                                size="mini"
                                :loading="scope.row.delLoading"
                                @click="handleDelete(scope.$index, scope.row)">
                                删除
                            </el-button> 

                        </template>
                    </el-table-column>
            </screen-table>


            <div class="screen-footer text-right">
                <el-pagination 
                    background
                    layout="sizes, prev, pager, next, total"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :page-sizes="pageSizes"
                    :current-page.sync="page.currentPage"
                    :page-size="page.pageSize"               
                    :total="page.total">
                </el-pagination>
            </div>


            <el-dialog
                title="新增标签"
                width="500px"
                :close-on-click-modal="false"
                :visible.sync="dialogFormVisible">

                    <el-form :model="addForm" :rules="formRules" ref="addForm" label-width="100px" @submit.native.prevent>
                        <el-form-item label="标签名称" prop="name">
                            <el-input v-model.trim="addForm.name" placeholder="请输入名称" class="width-200"></el-input>
                        </el-form-item>
                        <el-form-item label="标签拼音" prop="pinyin">
                            <el-input v-model.trim="addForm.pinyin" placeholder="请输入拼音全拼" class="width-200"></el-input>
                        </el-form-item>
                    </el-form>

                <div slot="footer">
                    <el-button @click="dialogFormVisible = false">取消</el-button>
                    <el-button type="primary" @click="addSubmitForm('addForm')" :loading="addSubmitFormLoading">保存</el-button>
                </div>
            </el-dialog>

            <el-dialog
                title="修改标签"
                width="500px"
                :close-on-click-modal="false"
                :visible.sync="dialogEditFormVisible">

                    <el-form :model="editForm" :rules="formRules" ref="editForm" label-width="100px" @submit.native.prevent>
                        <el-form-item label="标签名称" prop="name">
                            <el-input v-model.trim="editForm.name" placeholder="请输入名称" class="width-200"></el-input>
                        </el-form-item>
                        <el-form-item label="标签拼音" prop="pinyin">
                            <el-input v-model.trim="editForm.pinyin" placeholder="请输入拼音全拼" class="width-200"></el-input>
                        </el-form-item>
                    </el-form>


                <div slot="footer">
                    <el-button @click="dialogEditFormVisible = false">取消</el-button>
                    <el-button type="primary" @click="editSubmitForm('editForm')" :loading="editSubmitFormLoading">保存</el-button>
                </div>
            </el-dialog>

           
            
    </div>
</template>
<script>
import { TagList, TagAdd, TagEdit, TagDel } from '@/service/setting';
import ScreenTable from '@/components/ScreenTable';
import mixin from '@/views/mixin';
export default {
    mixins: [mixin],
    components: {
        ScreenTable
    },
    data () {
      return {
            // 新增表单
            dialogFormVisible: false,
            addSubmitFormLoading: false,
            addForm: {
                name: '',
                pinyin: ''
            },
            // 修改表单
            dialogEditFormVisible: false,
            editSubmitFormLoading: false,
            editForm: {
                dataIndex: '',
                id: 0,
                oldname: '',
                oldpinyin: '',
                name: '',
                pinyin: ''
            },
            // 表单验证
            formRules: {
                name: [
                    { 
                        required: true,
                        validator: (rule, value, callback) => {
                            if (value === '') {
                                callback(new Error('请输入名称'));
                            } else if (/[,]+/.test(value)) {
                                callback(new Error('不能有英文格式的 ","'));
                            } else if (value.length > 10) {
                                callback(new Error('最长 10 个字'));
                            }else {
                                callback();
                            }
                        },
                        trigger: 'blur' 
                    }
                ],
                pinyin: [
                    { 
                        required: true,
                        validator: (rule, value, callback) => {
                            if (value === '') {
                                callback(new Error('请输入拼音'));
                            } else if (!/^[a-z]+$/.test(value)) {
                                callback(new Error('必须是小写字母'));
                            } else if (value.length > 60) {
                                callback(new Error('最长 60 个字符'));
                            }else {
                                callback();
                            }
                        },
                        trigger: 'blur' 
                    }
                ]
            },
            // 搜索
            keywords: '',
            keywordsCopy: '',
            // 表格 - 数据
            tableLoading: true, //表格loading
            tableData: []
      };
    },
    methods: {
        // 列表 - 获取
        getList() {
            const _this = this;
            const paramData = {
                per: _this.page.pageSize,
                page: _this.page.currentPage,
                keywords: _this.keywords
            };
            TagList(paramData).then(res => {
                // console.log(res);
                const { data } = res;
                const { total, list } = data;
                _this.page.total = total;
                /* _this.tableData = list.map((item) => {
                    return item
                }) */
                _this.tableData = list;
                _this.tableLoading = false;
            });
        },
        // 列表 - 点击分页
        handleCurrentChange(v) {
            const _this = this;
            _this.page['currentPage'] = v;
            _this.keywords = _this.keywordsCopy;
            _this.tableLoading = true;
            _this.getList();
        },
        // 列表 - 切换每页显示数量
        handleSizeChange(v) {
            const _this = this;
            _this.page['pageSize'] = v;
            _this.handleCurrentChange(1);
        },
        // 列表 - 搜索
        handleSearch() {
            const _this = this;
            _this.keywordsCopy = _this.keywords;
            _this.handleCurrentChange(1);
        },
        // 列表 - 删除
        handleDelete(index, row) {
            const _this = this;
            _this.$confirm('是否确认删除?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {

                _this.$set(_this.tableData[index], 'delLoading', true);
                TagDel(row.id).then(res => {
                    const { code } = res;
                    _this.$set(_this.tableData[index], 'delLoading', false);
                    if (code === 0 ) {
                        _this.$message({ message: '删除成功！', type: 'success' });

                        /**
                         * 为了减少请求，
                         * 缺点不实时，如果要求精确可以把if(){}删除 保留 else{ 中的内容 }
                         */
                        if(_this.tableData.length > 1) {
                            _this.tableData.splice(index, 1);
                        } else {
                            _this.tableLoading = true;
                            _this.getList();
                        }
                    }
                }).catch(() => {
                    _this.$set(_this.tableData[index], 'delLoading', false);
                });

            }).catch(()=>{});
        },
        // 添加表单 - 提交
        addSubmitForm(formName) {
            const _this = this;
            _this.$refs[formName].validate((valid) => {
                if (valid) {

                    _this.addSubmitFormLoading = true;
                
                    const paramData = {
                        name: _this.addForm.name,
                        pinyin: _this.addForm.pinyin                
                    };
                    TagAdd(paramData).then(res => {
                        const { code } = res;
                        if (code === 0 ) {
                            _this.$message({ message: '新增成功！', type: 'success' });
                            _this.keywords = '';
                            _this.handleSearch();
                            _this.dialogFormVisible = false;
                            _this.addForm.name = ''; 
                            _this.addForm.pinyin = '';     
                        }                        
                        _this.addSubmitFormLoading = false;
                    }).catch(() => {
                        _this.addSubmitFormLoading = false;
                    });
                    
                } else {
                    _this.$message({ message: '验证不通过，请检查输入！', type: 'error' });
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        // 修改表单 - 显示
        edit(index, row) {
            this.editForm.name = row.name;
            this.editForm.pinyin = row.pinyin;
            this.editForm.id = row.id;
            this.editForm.oldname = row.name;
            this.editForm.oldpinyin = row.pinyin;
            this.editForm.dataIndex = index;
            this.dialogEditFormVisible = true;
        },
        // 修改表单 - 提交
        editSubmitForm(formName) {
            const _this = this;
            _this.$refs[formName].validate((valid) => {
                if (valid) {

                    if(_this.editForm.name === _this.editForm.oldname && _this.editForm.pinyin === _this.editForm.oldpinyin) {
                        /* _this.$message({ message: '没有修改，请修改内容再保存！', type: 'error' }); */
                        _this.dialogEditFormVisible = false;
                        return false;
                    }

                    _this.editSubmitFormLoading = true;
                
                    const paramData = {
                        name: _this.editForm.name,
                        pinyin: _this.editForm.pinyin              
                    };
                    TagEdit(_this.editForm.id, paramData).then(res => {
                        const { code } = res;
                        if (code === 0 ) {
                            _this.$message({ message: '修改成功！', type: 'success' });
                            _this.tableData[_this.editForm.dataIndex].name = _this.editForm.name;
                            _this.tableData[_this.editForm.dataIndex].pinyin = _this.editForm.pinyin;
                            _this.dialogEditFormVisible = false;
                        }                        
                        _this.editSubmitFormLoading = false;
                    }).catch(() => {
                        _this.editSubmitFormLoading = false;
                    });
                    
                } else {
                    _this.$message({ message: '验证不通过，请检查输入！', type: 'error' });
                    console.log('error submit!!');
                    return false;
                }
            });
        }
    },
    mounted() {
        this.getList();    
    }
};
</script>