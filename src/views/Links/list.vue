<template>
    <div class="main-conent main-conent-screen main-conent-bgFFF main-conent-borderradius">
            <div class="screen-header">
                <el-row>
                    <el-col :span="8">
                        <el-button type="primary" @click="dialogFormVisible = true"><svg-icon icon-class="button-add" /> 新增</el-button>
                    </el-col>
                    <el-col :span="16" class="text-right">
                        <el-input
                            class="margin-l10 width-200"                            
                            placeholder="标题搜索"
                            v-model.trim="keywords"
                            @keyup.enter.native="handleSearch">
                            <i slot="suffix" class="el-input__icon el-icon-search cursor-pointer" @click="handleSearch"></i>
                        </el-input>
                        <el-button class="margin-l10" @click="searchDrawerVisible = true"><svg-icon icon-class="button-advanced-search" /> 高级搜索</el-button>
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
                        fixed
                        label="序号"
                        type="index"
                        :index="tableIndexMethod"
                        width="100">
                    </el-table-column>
                    <el-table-column
                        fixed
                        prop="title"
                        label="名称"
                        min-width="330">
                    </el-table-column>
                    <el-table-column
                        label="分类"
                        min-width="100">
                        <template slot-scope="scope">
                            {{ scope.row.category && scope.row.category.name }}                            
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


            <el-drawer
                custom-class="custom-drawer"
                :visible.sync="searchDrawerVisible"
                :wrapperClosable="false"
                size="390px"
                append-to-body
                title="高级搜索">
                
                <el-form>
                    <el-row :gutter="24">
                        <el-col :span="24">
                            <el-form-item label="标题">
                                <el-input v-model.trim="keywords"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="24">
                            <el-form-item label="分类">
                                <links-category-select
                                    v-model="searchCategory"
                                    class="width-100%">                        
                                </links-category-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>


                <div class="custom-drawer-footer">
                    <el-button @click="handleAdvancedSearchClear">清空</el-button>
                    <el-button type="primary" @click="handleAdvancedSearch">搜索</el-button>
                </div>
            </el-drawer>



            <el-dialog
                title="新增链接"
                width="430px"
                :close-on-click-modal="false"
                :visible.sync="dialogFormVisible">

                    <el-form :model="addForm" :rules="formRules" ref="addForm" label-width="100px" @submit.native.prevent>
                        <el-form-item label="分类" prop="category">
                           <links-category-select
                                v-model="addForm.category"
                                class="width-200">                        
                           </links-category-select>
                        </el-form-item>
                        <el-form-item label="名称" prop="title">
                            <el-input v-model.trim="addForm.title" placeholder="请输入名称" class="width-200"></el-input>
                        </el-form-item>
                        <el-form-item label="网址" prop="href">
                            <el-input v-model.trim="addForm.href" placeholder="请输入网址" class="width-200"></el-input>
                        </el-form-item>
                        <el-form-item label="简介" prop="description">
                            <el-input v-model.trim="addForm.description" type="textarea" autosize placeholder="请输入简介" class="width-200"></el-input>
                        </el-form-item>
                        <el-form-item label="Logo">
                            <server-image-selection-list :value="addForm.thumb"></server-image-selection-list>
                        </el-form-item>
                    </el-form>

                <div slot="footer">
                    <el-button @click="dialogFormVisible = false">取消</el-button>
                    <el-button type="primary" @click="addSubmitForm('addForm')" :loading="addSubmitFormLoading">保存</el-button>
                </div>
            </el-dialog>
           
            <el-dialog
                title="修改链接"
                width="430px"
                :close-on-click-modal="false"
                :visible.sync="dialogEditFormVisible">

                    <el-form :model="editForm" :rules="formRules" ref="editForm" label-width="100px" @submit.native.prevent>
                        <el-form-item label="分类" prop="category">
                           <links-category-select
                                v-model="editForm.category"
                                :default-options="editForm.categoryDefaultOptions"
                                class="width-200">                        
                           </links-category-select>
                        </el-form-item>
                        <el-form-item label="名称" prop="title">
                            <el-input v-model.trim="editForm.title" placeholder="请输入名称" class="width-200"></el-input>
                        </el-form-item>
                        <el-form-item label="网址" prop="href">
                            <el-input v-model.trim="editForm.href" placeholder="请输入网址" class="width-200"></el-input>
                        </el-form-item>
                        <el-form-item label="简介" prop="description">
                            <el-input v-model.trim="editForm.description" type="textarea" autosize placeholder="请输入简介" class="width-200"></el-input>
                        </el-form-item>
                        <el-form-item label="Logo">
                            <server-image-selection-list :value="editForm.thumb"></server-image-selection-list>
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
import { LinksList, LinksDel, LinksAdd, LinksDetail, LinksEdit } from '@/service/links';
import ScreenTable from '@/components/ScreenTable';
import LinksCategorySelect from '@/components/Custom/LinksCategorySelect';
import ServerImageSelectionList from '@/components/Custom/ServerImage/SelectionList';
import mixin from '@/views/mixin';
export default {
    mixins: [mixin],
    components: {
        ScreenTable,
        LinksCategorySelect,
        ServerImageSelectionList
    },
    data () {
      return {
        // 搜索
        keywords: '',
        keywordsCopy: '',
        searchDrawerVisible: false, // 是否显示高级搜索
        searchCategory: '',
        searchCategoryCopy: '',
        // 表格 - 数据
        tableLoading: true, //表格loading
        tableData: [],
        // 新增表单
        dialogFormVisible: false,
        addSubmitFormLoading: false,
        addForm: {
            category: '',
            title: '',
            description: '',
            href: '',
            thumb: []
        },
        // 修改表单
        dialogEditFormVisible: false,
        editSubmitFormLoading: false,
        editForm: {
            id: 0,
            category: '',
            categoryDefaultOptions: [],
            title: '',
            description: '',
            href: '',
            thumb: []
        },
        // 表单验证
        formRules: {
            category: [
                { required: true, message: '请选择分类', trigger: 'change' }
            ],
            title: [
                { required: true, message: '请输入名称', trigger: 'blur' },
                { max: 50, message: '最长 50 个字', trigger: 'blur' }
            ],
            description: [
                { required: true, message: '请输入简介', trigger: 'blur' },
                { max: 100, message: '最长 100 个字', trigger: 'blur' }
            ],
            href: [
                { 
                    required: true,
                    validator: (rule, value, callback) => {
                        if (value === '') {
                            callback(new Error('请输入网址'));
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
    methods: {
        // 列表 - 获取
        getList() {
            const _this = this;
            const paramData = {
                per: _this.page.pageSize,
                page: _this.page.currentPage,
                keywords: _this.keywords,
                categoryid: _this.searchCategory
            };
            LinksList(paramData).then(res => {
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
            _this.searchCategory = _this.searchCategoryCopy;
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
            _this.searchCategory = '';
            _this.handleCurrentChange(1);
        },
        // 列表 - 高级搜索
        handleAdvancedSearch() {
            const _this = this;
            _this.keywordsCopy = _this.keywords;
            _this.searchCategoryCopy = _this.searchCategory;
            _this.handleCurrentChange(1);
            _this.searchDrawerVisible = false;
        },
        // 列表 - 高级搜索 - 清空
        handleAdvancedSearchClear() {
            const _this = this;
            _this.keywords = '';
            _this.searchCategory = '';
            _this.handleAdvancedSearch();
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
                LinksDel(row.id).then(res => {
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
                        categoryId: _this.addForm.category,                
                        title: _this.addForm.title,
                        description: _this.addForm.description,
                        href: _this.addForm.href,
                        logo: _this.addForm.thumb.length > 0 ? _this.addForm.thumb[0] : ''
                    };
                    LinksAdd(paramData).then(res => {
                        const { code } = res;
                        if (code === 0 ) {
                            _this.$message({ message: '新增成功！', type: 'success' });
                            _this.handleCurrentChange(1);

                            _this.dialogFormVisible = false;
                            _this.addForm.category = '';
                            _this.addForm.title = '';
                            _this.addForm.description = '';
                            _this.addForm.href = '';
                            _this.addForm.thumb = [];
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
           
            LinksDetail(row.id).then(res => {
                const { code, data } = res;
                _this.$set(_this.tableData[index], 'editLoading', false);
                if (code === 0 ) {

                    const { title, description, category, href, logo } = data;

                    _this.editForm.id = row.id;           
                    _this.editForm.category = category.id;   
                    _this.editForm.categoryDefaultOptions = [{value: category.id, label:category.name }];      
                    _this.editForm.title = title;           
                    _this.editForm.description = description;  
                    _this.editForm.href = href;           
                    _this.editForm.thumb = logo !== '' ? [logo] : [];
                                        
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
                        categoryId: _this.editForm.category,                
                        title: _this.editForm.title,
                        description: _this.editForm.description,
                        href: _this.editForm.href,
                        logo: _this.editForm.thumb.length > 0 ? _this.editForm.thumb[0] : ''
                    };
                    LinksEdit(_this.editForm.id, paramData).then(res => {
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