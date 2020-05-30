<template>
    <div class="main-conent main-conent-screen main-conent-bgFFF main-conent-borderradius">
            <div class="screen-header">
                <el-row>
                    <el-col :span="24">
                        <el-button type="primary" @click="dialogFormVisible = true"><svg-icon icon-class="button-add" /> 新增分类</el-button>
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
                        width="100">
                    </el-table-column>
                    <el-table-column
                        prop="name"
                        label="名称"
                        min-width="200">
                    </el-table-column>
                    <el-table-column
                        prop="alias"
                        label="别名"
                        min-width="200">
                    </el-table-column>
                    <el-table-column
                        prop="sort"
                        label="排序"
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


            <div class="padding-t20"></div>


            <el-dialog
                title="新增分类"
                width="500px"
                :close-on-click-modal="false"
                :visible.sync="dialogFormVisible">

                    <el-form :model="addForm" :rules="formRules" ref="addForm" label-width="100px" @submit.native.prevent>
                        <el-form-item label="分类名称" prop="name">
                            <el-input v-model.trim="addForm.name" placeholder="请输入名称" class="width-200"></el-input>
                        </el-form-item>
                        <el-form-item label="分类别名" prop="alias">
                            <el-input v-model.trim="addForm.alias" placeholder="请输入别名" class="width-200"></el-input>
                        </el-form-item>
                        <el-form-item label="排序" prop="sort">
                            <el-input-number v-model="addForm.sort" placeholder="请输入排序" :min="0" :max="999" class="width-200"></el-input-number>
                        </el-form-item>
                    </el-form>

                <div slot="footer">
                    <el-button @click="dialogFormVisible = false">取消</el-button>
                    <el-button type="primary" @click="addSubmitForm('addForm')" :loading="addSubmitFormLoading">保存</el-button>
                </div>
            </el-dialog>

            <el-dialog
                title="修改分类"
                width="500px"
                :close-on-click-modal="false"
                :visible.sync="dialogEditFormVisible">

                    <el-form :model="editForm" :rules="formRules" ref="editForm" label-width="100px" @submit.native.prevent>
                        <el-form-item label="分类名称" prop="name">
                            <el-input v-model.trim="editForm.name" placeholder="请输入名称" class="width-200"></el-input>
                        </el-form-item>
                        <el-form-item label="分类别名" prop="alias">
                            <el-input v-model.trim="editForm.alias" placeholder="请输入别名" class="width-200"></el-input>
                        </el-form-item>
                        <el-form-item label="排序" prop="sort">
                            <el-input-number v-model="editForm.sort" placeholder="请输入排序" :min="0" :max="999" class="width-200"></el-input-number>
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
import { LinksCategoryList, LinksCategoryAdd, LinksCategoryEdit, LinksCategoryDel } from '@/service/links';
import ScreenTable from '@/components/ScreenTable';
export default {
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
                alias: '',
                sort: 0
            },
            // 修改表单
            dialogEditFormVisible: false,
            editSubmitFormLoading: false,
            editForm: {
                dataIndex: '',
                id: 0,
                oldname: '',
                oldalias: '',
                oldsort: 0,
                name: '',
                alias: '',
                sort: 0
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
                alias: [
                    { 
                        required: true,
                        validator: (rule, value, callback) => {
                            if (value === '') {
                                callback(new Error('请输入别名'));
                            } else if (!/^[a-z]+$/.test(value)) {
                                callback(new Error('必须是小写字母'));
                            } else if (value.length > 50) {
                                callback(new Error('最长 50 个字符'));
                            }else {
                                callback();
                            }
                        },
                        trigger: 'blur' 
                    }
                ],
                sort: [
                    {required: true, message: '请输入排序', trigger: 'blur'}
                ]
            },
            // 表格 - 数据
            tableLoading: true, //表格loading
            tableData: []
      };
    },
    methods: {
        // 列表 - 获取
        getList() {
            const _this = this;
            LinksCategoryList().then(res => {
                // console.log(res);
                const { data } = res;
                /* _this.tableData = list.map((item) => {
                    return item
                }) */
                _this.tableData = data;
                _this.tableLoading = false;
            });
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
                LinksCategoryDel(row.id).then(res => {
                    const { code } = res;
                    _this.$set(_this.tableData[index], 'delLoading', false);
                    if (code === 0 ) {
                        _this.$message({ message: '删除成功！', type: 'success' });

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
                        alias: _this.addForm.alias,
                        sort: _this.addForm.sort              
                    };
                    LinksCategoryAdd(paramData).then(res => {
                        const { code, data } = res;
                        if (code === 0 ) {
                            const { id } = data;
                            _this.$message({ message: '新增成功！', type: 'success' });
                            _this.tableData.push({
                                id: id,
                                name: _this.addForm.name,
                                alias: _this.addForm.alias,
                                sort: _this.addForm.sort
                            });                      
                            _this.dialogFormVisible = false;
                            _this.addForm.name = '';
                            _this.addForm.alias = '';  
                            _this.addForm.sort = 0;  
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
            this.editForm.alias = row.alias;
            this.editForm.sort = row.sort;
            this.editForm.id = row.id;
            this.editForm.oldname = row.name;
            this.editForm.oldalias = row.alias;
            this.editForm.oldsort = row.sort;
            this.editForm.dataIndex = index;
            this.dialogEditFormVisible = true;
        },
        // 修改表单 - 提交
        editSubmitForm(formName) {
            const _this = this;
            _this.$refs[formName].validate((valid) => {
                if (valid) {

                    if(_this.editForm.name === _this.editForm.oldname && _this.editForm.alias === _this.editForm.oldalias && _this.editForm.sort === _this.editForm.oldsort) {
                        /* _this.$message({ message: '没有修改，请修改内容再保存！', type: 'error' }); */
                        _this.dialogEditFormVisible = false;
                        return false;
                    }

                    _this.editSubmitFormLoading = true;
                
                    const paramData = {
                        name: _this.editForm.name,
                        alias: _this.editForm.alias,
                        sort: _this.editForm.sort             
                    };
                    LinksCategoryEdit(_this.editForm.id, paramData).then(res => {
                        const { code } = res;
                        if (code === 0 ) {
                            _this.$message({ message: '修改成功！', type: 'success' });
                            _this.tableData[_this.editForm.dataIndex].name = _this.editForm.name;
                            _this.tableData[_this.editForm.dataIndex].alias = _this.editForm.alias;
                            _this.tableData[_this.editForm.dataIndex].sort = _this.editForm.sort;
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