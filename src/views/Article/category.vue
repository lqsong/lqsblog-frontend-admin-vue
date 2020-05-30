<template>
    <div class="main-conent main-conent-screen main-conent-bgFFF main-conent-borderradius">
            <div class="screen-header">
                <el-row>
                    <el-col :span="24">
                        <el-button type="primary" @click="showAddDialog()" ><svg-icon icon-class="button-add" /> 新增一级分类</el-button>
                    </el-col>
                </el-row>              
            </div>

            <div class="screen-conent">
                <tree-table
                    ref="treetable"
                    v-loading="tableLoading"
                    class="height-100"
                    :column="treeTableColumn"
                    :lazy="true"
                    :load="loadNode"
                    node-key="id"
                    >
                    <template v-slot:default="{ node, data }">
                        <el-button
                            type="text"
                            size="mini"
                            @click.stop="() => showAddDialog(node, data)">
                            新增下级
                        </el-button>
                        <el-button
                            type="text"
                            size="mini"
                            @click.stop="() => showEditDialog(node, data)">
                            修改
                        </el-button>
                        <el-button
                            type="text"
                            size="mini"
                            :loading="data.delLoading"
                            @click.stop="() => handleDelete(node, data)">
                            删除
                        </el-button> 
                    </template>
                </tree-table>
            </div>


            <div class="padding-t20"></div>


        <el-dialog
            title="新增分类"
            width="500px"
            :close-on-click-modal="false"
            :visible.sync="dialogAddFormVisible">

                <el-form :model="addForm" :rules="formRules" ref="addForm" label-width="130px" @submit.native.prevent>
                    <el-form-item label="分类名称" prop="name">
                        <el-input v-model.trim="addForm.name" placeholder="请输入名称" class="width-200"></el-input>
                    </el-form-item>
                    <el-form-item label="分类别名" prop="alias">
                        <el-input v-model.trim="addForm.alias" placeholder="请输入别名" class="width-200"></el-input>
                    </el-form-item>
                    <el-form-item label="分类Title" prop="title">
                        <el-input v-model.trim="addForm.title" placeholder="请输入Title" class="width-200"></el-input>
                    </el-form-item>
                    <el-form-item label="分类Keywords" prop="keywords">
                        <el-input v-model.trim="addForm.keywords" placeholder="请输入Keywords" class="width-200"></el-input>
                    </el-form-item>
                    <el-form-item label="分类Description" prop="description">
                        <el-input v-model.trim="addForm.description" type="textarea" placeholder="请输入Description" class="width-200"></el-input>
                    </el-form-item>
                    <el-form-item label="上级分类">
                        <el-input v-model.trim="addForm.prename" disabled class="width-200"></el-input>
                    </el-form-item>
                </el-form>

            <div slot="footer">
                <el-button @click="dialogAddFormVisible = false">取消</el-button>
                <el-button type="primary" @click="addSubmitForm('addForm')" :loading="addSubmitFormLoading">保存</el-button>
            </div>
        </el-dialog>

        <el-dialog
            title="修改分类"
            width="500px"
            :close-on-click-modal="false"
            :visible.sync="dialogEditFormVisible">

                <el-form :model="editForm" :rules="formRules" ref="editForm" label-width="130px" @submit.native.prevent>
                    <el-form-item label="分类名称" prop="name">
                        <el-input v-model.trim="editForm.name" placeholder="请输入名称" class="width-200"></el-input>
                    </el-form-item>
                    <el-form-item label="分类别名" prop="alias">
                        <el-input v-model.trim="editForm.alias" placeholder="请输入别名" class="width-200"></el-input>
                    </el-form-item>
                    <el-form-item label="分类Title" prop="title">
                        <el-input v-model.trim="editForm.title" placeholder="请输入Title" class="width-200"></el-input>
                    </el-form-item>
                    <el-form-item label="分类Keywords" prop="keywords">
                        <el-input v-model.trim="editForm.keywords" placeholder="请输入Keywords" class="width-200"></el-input>
                    </el-form-item>
                    <el-form-item label="分类Description" prop="description">
                        <el-input v-model.trim="editForm.description" type="textarea" placeholder="请输入Description" class="width-200"></el-input>
                    </el-form-item>
                    <el-form-item label="上级分类">
                        <el-input v-model.trim="editForm.prename" disabled class="width-200"></el-input>
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
import { ArticleCategoryList, ArticleCategoryAdd, ArticleCategoryEdit, ArticleCategoryDel } from '@/service/article';
import TreeTable from '@/components/TreeTable';
export default {
    components: {
        TreeTable
    },
    data () {
      return {
            // 列表
            treeTableColumn: [
                {
                    title: '分类列表',
                    label: 'name',
                    minWidth: 300
                },
                {
                    title: '分类别名',
                    label: 'alias',
                    minWidth: 300
                }
            ],
            tableLoading: true, //表格loading           
            // 添加 - 表单
            dialogAddFormVisible: false,
            addSubmitFormLoading: false,
            addForm: {
                node: null,
                data: null,
                pid: 0,
                name: '',
                alias: '',
                title: '',
                keywords: '',
                description: '',
                prename: '--'
            },
            // 修改 - 表单
            dialogEditFormVisible: false,
            editSubmitFormLoading: false,
            editForm: {
                node: null,
                data: null,
                id: 0,
                pid: 0,
                name: '',
                alias: '',
                title: '',
                keywords: '',
                description: '',
                prename: '--'
            },
            formRules: {
                name: [
                    { required: true, message: '请输入名称', trigger: 'blur' },
                    { max: 8, message: '最长 8 个字', trigger: 'blur' }
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
                title: [
                    { max: 30, message: '最长 30 个字', trigger: 'blur' }
                ],
                keywords: [
                    { max: 50, message: '最长 50 个字', trigger: 'blur' }
                ],
                description: [
                    { max: 100, message: '最长 100 个字', trigger: 'blur' }
                ]
            }
            
      };
    },
    computed: {
    },
    methods: {
        // 列表
        loadNode(node, resolve) {
            const _this = this;
            let pid = 0;
            if (node.level > 0) {
                pid = node.data.id;
            }
            ArticleCategoryList(pid).then(res => {
                // console.log(res);
                _this.tableLoading = false;
                const { data } = res;
                resolve(data);
            });
        },
        // 列表 - 删除
        handleDelete(node, data) {
            const _this = this;
            _this.$confirm('是否确认删除?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {

                _this.$set(data, 'delLoading', true);
                ArticleCategoryDel(data.id).then(res => {
                    const { code } = res;
                    _this.$set(data, 'delLoading', false);
                    if (code === 0 ) {

                        _this.$message({ message: '删除成功！', type: 'success' });

                        _this.$refs.treetable.$refs['el-tree'].remove(node);
                        
                    }
                }).catch(() => {
                    _this.$set(data, 'delLoading', false);
                });

            }).catch(()=>{});
        },
        // 添加表单 - 显示
        showAddDialog(node, data) {
            const level = node ? node.level : 0;
            this.addForm.node = node;
            this.addForm.data = data;
            this.addForm.pid = level < 1 ? 0 : data.id; 
            this.addForm.name = '';
            this.addForm.alias = '';
            this.addForm.title = '';
            this.addForm.keywords = '';
            this.addForm.description = '';
            this.addForm.prename = level < 1 ? '--' : data.name; 
            this.dialogAddFormVisible = true;
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
                        title: _this.addForm.title,
                        keywords: _this.addForm.keywords,
                        description: _this.addForm.description,
                        pid: _this.addForm.pid                  
                    };
                    ArticleCategoryAdd(paramData).then(res => {
                        const { code, data } = res;
                        if (code === 0 ) {
                            _this.$message({ message: '新增成功！', type: 'success' });

                            const item = {
                                name: _this.addForm.name,
                                alias: _this.addForm.alias,
                                title: _this.addForm.title,
                                keywords: _this.addForm.keywords,
                                description: _this.addForm.description,
                                pid: _this.addForm.pid,
                                id: data.id || 0
                            };

                            if (_this.addForm.pid > 0) {
                                _this.$refs.treetable.$refs['el-tree'].append(item, _this.addForm.node);
                            } else { // 顶级(第一级)
                               _this.$refs.treetable.$refs['el-tree'].append(item);
                            }

                            _this.dialogAddFormVisible = false;
                            _this.addForm.name = '';
                            _this.addForm.alias = '';
                            _this.addForm.title = '';
                            _this.addForm.keywords = '';
                            _this.addForm.description = '';
                            _this.addForm.pid = 0;
                            _this.addForm.node = null;
                            _this.addForm.data = null;
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
        showEditDialog(node, data) {
            const level =  node.level;
            this.editForm.node = node;
            this.editForm.data = data;
            this.editForm.name = data.name;
            this.editForm.alias = data.alias;
            this.editForm.title = data.title;
            this.editForm.keywords = data.keywords;
            this.editForm.description = data.description;
            this.editForm.id = data.id;
            this.editForm.pid = data.pid;
            this.editForm.prename = level < 2 ? '--' : node.parent.data.name; 
            this.dialogEditFormVisible = true;
        },
        // 修改表单 - 提交
        editSubmitForm(formName) {
            const _this = this;
            _this.$refs[formName].validate((valid) => {
                if (valid) {
                    _this.editSubmitFormLoading = true;
                
                    const paramData = {
                        name: _this.editForm.name,               
                        alias: _this.editForm.alias,               
                        title: _this.editForm.title,               
                        keywords: _this.editForm.keywords,               
                        description: _this.editForm.description  
                    };
                    ArticleCategoryEdit(_this.editForm.id, paramData).then(res => {
                        const { code } = res;
                        if (code === 0 ) {
                            _this.$message({ message: '修改成功！', type: 'success' });
                            
                            _this.editForm.data.name = _this.editForm.name;
                            _this.editForm.data.alias = _this.editForm.alias;
                            _this.editForm.data.title = _this.editForm.title;
                            _this.editForm.data.keywords = _this.editForm.keywords;
                            _this.editForm.data.description = _this.editForm.description;

                            _this.editForm.node = null;
                            _this.editForm.data = null;

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
    }
};
</script>