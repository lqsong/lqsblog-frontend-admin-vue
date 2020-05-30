<template>
    <div class="main-conent main-conent-screen main-conent-bgFFF main-conent-borderradius">
            <div class="screen-header">
                <el-row>
                    <el-col :span="8">
                        <router-link to="/topics/add" class="el-button el-button--primary el-button--small text-decoration-none"><svg-icon icon-class="button-add" /> 新增</router-link>
                    </el-col>
                    <el-col :span="16" class="text-right">
                        <el-input
                            class="margin-l10 width-200"                            
                            placeholder="标题搜索"
                            v-model.trim="keywords"
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
                        fixed
                        label="序号"
                        type="index"
                        :index="tableIndexMethod"
                        width="100">
                    </el-table-column>
                    <el-table-column
                        fixed
                        prop="title"
                        label="标题"
                        min-width="330">
                    </el-table-column>
                    <el-table-column
                        prop="alias"
                        label="别名"
                        width="130">
                    </el-table-column>
                    <el-table-column
                        prop="addtime"
                        label="发布时间"
                        width="140">
                    </el-table-column>
                    <el-table-column
                        fixed="right"
                        label="操作"
                        width="120">
                        <template slot-scope="scope">

                            <router-link :to="`/topics/edit-${scope.row.id}`" class="el-button el-button--text el-button--small text-decoration-none">修改</router-link>

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


           
            
    </div>
</template>
<script>
import { TopicsList, TopicsDel } from '@/service/topics';
import ScreenTable from '@/components/ScreenTable';
import mixin from '@/views/mixin';
export default {
    mixins: [mixin],
    components: {
        ScreenTable
    },
    data () {
      return {
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
            TopicsList(paramData).then(res => {
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
                TopicsDel(row.id).then(res => {
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
        }
    },
    mounted() {
        this.getList();    
    }
};
</script>