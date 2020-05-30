<template>
    <div class="main-conent main-conent-screen main-conent-bgFFF main-conent-borderradius">
            <div class="screen-header">
                <el-row>
                    <el-col :span="8">
                        <el-button type="primary" @click="dialogFormVisible = true"><svg-icon icon-class="button-add" /> 新增账号</el-button>
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
                        prop="nickname"
                        label="昵称"
                        min-width="150">
                    </el-table-column>
                    <el-table-column
                        prop="username"
                        label="用户名"
                        min-width="150">
                    </el-table-column>
                    <el-table-column
                        prop="roles"
                        label="角色"
                        min-width="300">
                        <template slot-scope="scope">
                            <span v-for="(item, index) in scope.row.roles" :key="item.id">
                                <span v-if="index > 0">,</span>
                                {{item.name}}
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        fixed="right"
                        label="操作"
                        width="120">
                        <template slot-scope="scope">
                            <el-button
                                type="text"
                                size="mini"
                                :loading="scope.row.editLoading"
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
                title="新增账号"
                width="500px"
                :close-on-click-modal="false"
                :visible.sync="dialogFormVisible">

                    <el-form :model="addForm" :rules="formRules" ref="addForm" label-width="100px" @submit.native.prevent>
                        <el-form-item label="昵称" prop="nickname">
                            <el-input v-model.trim="addForm.nickname" placeholder="请输入昵称" class="width-200"></el-input>
                        </el-form-item>
                        <el-form-item label="用户名" prop="username">
                            <el-input v-model.trim="addForm.username" placeholder="请输入用户名" class="width-200"></el-input>
                        </el-form-item>
                        <el-form-item label="密码" prop="password">
                            <el-input type="password" show-password v-model.trim="addForm.password" placeholder="请输入密码" class="width-200"></el-input>
                        </el-form-item>
                        <el-form-item label="角色" >
                            <role-select v-model="addForm.role" multiple clearable class="width-200"></role-select>
                        </el-form-item>
                    </el-form>

                <div slot="footer">
                    <el-button @click="dialogFormVisible = false">取消</el-button>
                    <el-button type="primary" @click="addSubmitForm('addForm')" :loading="addSubmitFormLoading">保存</el-button>
                </div>
            </el-dialog>

            <el-dialog
                title="修改账号"
                width="500px"
                :close-on-click-modal="false"
                :visible.sync="dialogEditFormVisible">

                    <el-form :model="editForm" :rules="formRulesEdit" ref="editForm" label-width="100px" @submit.native.prevent>
                        <el-form-item label="昵称" prop="nickname">
                            <el-input v-model.trim="editForm.nickname" placeholder="请输入昵称" class="width-200"></el-input>
                        </el-form-item>
                        <el-form-item label="用户名" prop="username">
                            <el-input v-model.trim="editForm.username" placeholder="请输入用户名" class="width-200"></el-input>
                        </el-form-item>
                        <el-form-item label="密码" prop="password">
                            <el-input type="password" show-password v-model.trim="editForm.password" placeholder="为空则不修改密码" class="width-200"></el-input>
                        </el-form-item>
                        <el-form-item label="角色" >
                            <role-select v-model="editForm.role" multiple clearable :defaultOptions="roleSelectDefaultOption" class="width-200"></role-select>
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
import { AccountList, AccountAdd, AccountDetail, AccountEdit, AccountDel } from '@/service/setting';
import ScreenTable from '@/components/ScreenTable';
import RoleSelect from '@/components/Custom/RoleSelect';
import mixin from '@/views/mixin';
export default {
    mixins: [mixin],
    components: {
        ScreenTable,
        RoleSelect
    },
    data () {

        const nicknameRule = [
            { required: true, message: '请输入昵称', trigger: 'blur' },
            { max: 8, message: '最长 8 个字', trigger: 'blur' }
        ];
        const usernameRule = [
            { 
                required: true,
                validator: (rule, value, callback) => {
                    if (value === '') {
                        callback(new Error('请输入用户名'));
                    } else if (!/^[a-z0-9]+$/.test(value)) {
                        callback(new Error('必须是小写字母、数字'));
                    } else if (value.length < 6 || value.length > 16) {
                        callback(new Error('6-16 个字'));
                    }else {
                        callback();
                    }
                },
                trigger: 'blur' 
            }
        ];

        return {
            // 角色 - 默认选中的下拉
            roleSelectDefaultOption: [],
            // 新增表单
            dialogFormVisible: false,
            addSubmitFormLoading: false,
            addForm: {
                nickname: '',
                username: '',
                password: '',
                role: []
            },
            // 修改表单
            dialogEditFormVisible: false,
            editSubmitFormLoading: false,
            editForm: {
                id: 0,
                nickname: '',
                username: '',
                password: '',
                role:[]
            },
            // 表单验证
            formRules: {
                nickname: nicknameRule,
                username: usernameRule,
                password: [
                    { 
                        required: true,
                        validator: (rule, value, callback) => {
                            if (value === '') {
                                callback(new Error('请输入密码'));
                            } else if (!/^[A-Za-z0-9.]+$/.test(value)) {
                                callback(new Error('必须是字母、数字'));
                            } else if (value.length < 6 || value.length > 16) {
                                callback(new Error('6-16 个字'));
                            }else {
                                callback();
                            }
                        },
                        trigger: 'blur' 
                    }
                ]
            },
            // 表单验证 - 编辑
            formRulesEdit: {
                nickname: nicknameRule,
                username: usernameRule,
                password: [
                    { 
                        validator: (rule, value, callback) => {
                            if (value === '') {
                                callback();
                            } else if (!/^[A-Za-z0-9.]+$/.test(value)) {
                                callback(new Error('必须是字母、数字'));
                            } else if ((value.length < 6 && value.length < 0) || value.length > 16) {
                                callback(new Error('6-16 个字'));
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
            AccountList(paramData).then(res => {
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
                AccountDel(row.id).then(res => {
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
                        username: _this.addForm.username,
                        password: _this.addForm.password,
                        nickname: _this.addForm.nickname,
                        roles: _this.addForm.role              
                    };
                    AccountAdd(paramData).then(res => {
                        const { code } = res;
                        if (code === 0 ) {
                            _this.$message({ message: '新增成功！', type: 'success' });
                            _this.keywords = '';
                            _this.handleSearch();
                            _this.dialogFormVisible = false;
                            _this.addForm.username = ''; 
                            _this.addForm.password = '';  
                            _this.addForm.nickname = '';
                            _this.addForm.role = [];   
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
            const _this = this;
            _this.$set(_this.tableData[index], 'editLoading', true);

            AccountDetail(row.id).then(res => {
                const { code, data } = res;
                _this.$set(_this.tableData[index], 'editLoading', false);
                if (code === 0 ) {

                    const { id, username, nickname, roles } = data;

                    const rolesLen = roles.length;
                    let role = [];
                    let roleOption = [];
                    for (let index = 0; index < rolesLen; index++) {
                        const element = roles[index];
                        const roleId = element['id'] * 1;
                        role.push(roleId);
                        roleOption.push({ value: roleId, label: element['name']});
                    }                    

                    _this.editForm.password = '';
                    _this.editForm.id = id;
                    _this.editForm.username = username;
                    _this.editForm.nickname = nickname;
                    _this.editForm.role = role;
                    _this.roleSelectDefaultOption = roleOption;

                    _this.dialogEditFormVisible = true;
                    
                }
            }).catch(() => {
                _this.$set(_this.tableData[index], 'editLoading', false);
            });
        },
        // 修改表单 - 提交
        editSubmitForm(formName) {
            const _this = this;
            _this.$refs[formName].validate((valid) => {
                if (valid) {

                    _this.editSubmitFormLoading = true;
                
                    const paramData = {
                        username: _this.editForm.username,
                        password: _this.editForm.password,
                        nickname: _this.editForm.nickname,
                        roles: _this.editForm.role              
                    };
                    AccountEdit(_this.editForm.id, paramData).then(res => {
                        const { code } = res;
                        if (code === 0 ) {
                            _this.$message({ message: '修改成功！', type: 'success' });
                            _this.tableLoading = true;
                            _this.getList();
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