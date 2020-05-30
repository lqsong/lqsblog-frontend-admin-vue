<template>
    <div class="main-conent main-conent-screen main-conent-bgFFF main-conent-borderradius">
            <div class="screen-header">
                <el-row>
                    <el-col :span="24">
                        <el-button type="primary" @click="dialogFormVisible = true"><svg-icon icon-class="button-add" /> 新增角色</el-button>
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
                        prop="description"
                        label="备注"
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
                title="新增角色"
                width="500px"
                :close-on-click-modal="false"
                :visible.sync="dialogFormVisible">

                    <el-form :model="addForm" :rules="formRules" ref="addForm" label-width="100px" @submit.native.prevent>
                        <el-form-item label="角色名称" prop="name">
                            <el-input v-model.trim="addForm.name" placeholder="请输入名称" class="width-200"></el-input>
                        </el-form-item>
                        <el-form-item label="角色备注">
                            <el-input v-model.trim="addForm.description" placeholder="请输入备注" class="width-200"></el-input>
                        </el-form-item>
                        <el-form-item label="菜单权限">
                            <menu-cascader v-model.trim="addForm.menu" :multipleSelection="true" :checkStrictly="true"></menu-cascader>
                        </el-form-item>
                    </el-form>

                <div slot="footer">
                    <el-button @click="dialogFormVisible = false">取消</el-button>
                    <el-button type="primary" @click="addSubmitForm('addForm')" :loading="addSubmitFormLoading">保存</el-button>
                </div>
            </el-dialog>

            <el-dialog
                title="修改角色"
                width="500px"
                :close-on-click-modal="false"
                :visible.sync="dialogEditFormVisible">

                    <el-form :model="editForm" :rules="formRules" ref="editForm" label-width="100px" @submit.native.prevent>
                        <el-form-item label="角色名称" prop="name">
                            <el-input v-model.trim="editForm.name" placeholder="请输入名称" class="width-200"></el-input>
                        </el-form-item>
                        <el-form-item label="角色备注">
                            <el-input v-model.trim="editForm.description" placeholder="请输入备注" class="width-200"></el-input>
                        </el-form-item>
                        <el-form-item label="菜单权限">
                            <menu-cascader-sync v-model.trim="editForm.menu" :params="menuCascaderParam" :multipleSelection="true" :checkStrictly="true"></menu-cascader-sync>
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
import { RoleList, RoleAdd, RoleEdit, RoleDel } from '@/service/setting';
import ScreenTable from '@/components/ScreenTable';
import MenuCascader from '@/components/Custom/MenuCascader';
import MenuCascaderSync from '@/components/Custom/MenuCascader/sync';
import { Array2dToString, StringToArray2d } from '@/utlis/formatData';
export default {
    components: {
        ScreenTable,
        MenuCascader,
        MenuCascaderSync
    },
    data () {
      return {
            // 新增表单
            dialogFormVisible: false,
            addSubmitFormLoading: false,
            addForm: {
                name: '',
                description: '',
                menu: []
            },
            // 修改表单
            dialogEditFormVisible: false,
            editSubmitFormLoading: false,
            editForm: {
                dataIndex: '',
                id: 0,
                name: '',
                description: '',
                menu: []
            },
            // 表单验证
            formRules: {
                name: [
                    { required: true, message: '请输入名称', trigger: 'blur' },
                    { max: 10, message: '最长 10 个字', trigger: 'blur' }
                ]
            },
            // 菜单联动插件 - 参数
            menuCascaderParam: {
                isEdit: false
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
            RoleList().then(res => {
                // console.log(res);
                const { data } = res;
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
                RoleDel(row.id).then(res => {
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

                    const idObj = Array2dToString(_this.addForm.menu);
                
                    const paramData = {
                        name: _this.addForm.name,
                        description: _this.addForm.description,
                        resources: idObj['idStr'],
                        resourcesLevel: idObj['idsStr']              
                    };
                    RoleAdd(paramData).then(res => {
                        const { code } = res;
                        if (code === 0 ) {
                            _this.$message({ message: '新增成功！', type: 'success' });
                            _this.tableLoading = true;
                            _this.getList();
                            _this.dialogFormVisible = false;
                            _this.addForm.name = ''; 
                            _this.addForm.description = '';
                            _this.addForm.menu = [];   
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
            this.editForm.description = row.description;
            this.editForm.id = row.id;
            this.editForm.menu = StringToArray2d(row.resourcesLevel);
            this.editForm.dataIndex = index;
            this.menuCascaderParam.isEdit = true;
            this.dialogEditFormVisible = true;
        },
        // 修改表单 - 提交
        editSubmitForm(formName) {
            const _this = this;
            _this.$refs[formName].validate((valid) => {
                if (valid) {

                    _this.editSubmitFormLoading = true;
                
                    const idObj = Array2dToString(_this.editForm.menu);
                
                    const paramData = {
                        name: _this.editForm.name,
                        description: _this.editForm.description,
                        resources: idObj['idStr'],
                        resourcesLevel: idObj['idsStr']              
                    };
                    RoleEdit(_this.editForm.id, paramData).then(res => {
                        const { code } = res;
                        if (code === 0 ) {
                            _this.$message({ message: '修改成功！', type: 'success' });
                            _this.tableData[_this.editForm.dataIndex].name = _this.editForm.name;
                            _this.tableData[_this.editForm.dataIndex].description = _this.editForm.description;
                            _this.tableData[_this.editForm.dataIndex].resources = idObj['idStr'];
                            _this.tableData[_this.editForm.dataIndex].resourcesLevel = idObj['idsStr'];
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