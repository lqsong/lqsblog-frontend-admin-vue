<template>
    <div class="main-conent main-conent-screen main-conent-bgFFF main-conent-borderradius">
            <div class="screen-header">
                <el-row>
                    <el-col :span="8">
                        <router-link to="/works/add" class="el-button el-button--primary el-button--small text-decoration-none"><svg-icon icon-class="button-add" /> 新增</router-link>
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
                        label="标题"
                        min-width="330">
                    </el-table-column>
                    <el-table-column
                        prop="addtime"
                        label="发布时间"
                        width="140">
                    </el-table-column>
                    <el-table-column
                        label="标签"
                        width="130">
                        <template slot-scope="scope">
                            <el-tag v-for="item in scope.row.tags" :key="item">{{ item }}</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column
                        fixed="right"
                        label="操作"
                        width="120">
                        <template slot-scope="scope">

                            <router-link :to="`/works/edit-${scope.row.id}`" class="el-button el-button--text el-button--small text-decoration-none">修改</router-link>

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
                    </el-row>
                    <el-row :gutter="24">
                        <el-col :span="24">
                            <el-form-item label="发布时间">
                                <el-date-picker
                                    v-model="searchAddTime"
                                    type="datetimerange"
                                    range-separator="至"
                                    start-placeholder="开始日期"
                                    end-placeholder="结束日期"
                                    value-format="yyyy-MM-dd HH:mm:ss"
                                    class="width-100%">
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="24">
                            <el-form-item label="标签">
                                <tag-select
                                    v-model="searchTag"
                                    class="width-100%">
                                </tag-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>


                <div class="custom-drawer-footer">
                    <el-button @click="handleAdvancedSearchClear">清空</el-button>
                    <el-button type="primary" @click="handleAdvancedSearch">搜索</el-button>
                </div>
            </el-drawer>
           
            
    </div>
</template>
<script>
import { WorksList, WorksDel } from '@/service/works';
import { trimComma } from '@/utlis/trim';
import ScreenTable from '@/components/ScreenTable';
import TagSelect from '@/components/Custom/TagSelect';
import mixin from '@/views/mixin';
export default {
    mixins: [mixin],
    components: {
        ScreenTable,
        TagSelect
    },
    data () {
      return {
        // 搜索
        keywords: '',
        keywordsCopy: '',
        searchDrawerVisible: false, // 是否显示高级搜索
        searchAddTime: [],
        searchAddTimeCopy: [],
        searchTag: [],
        searchTagCopy: [],
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
                keywords: _this.keywords,
                addtimestart: _this.searchAddTime && _this.searchAddTime[0],
                addtimeend: _this.searchAddTime && _this.searchAddTime[1],
                tags: _this.searchTag.join(',')
            };
            WorksList(paramData).then(res => {
                // console.log(res);
                const { data } = res;
                const { total, list } = data;
                _this.page.total = total;
                _this.tableData = list.map(item => {
                    item.tag = trimComma(item.tag);
                    item.tags = item.tag.split(',');
                    return item;
                });
                //_this.tableData = list;
                _this.tableLoading = false;
            });
        },
        // 列表 - 点击分页
        handleCurrentChange(v) {
            const _this = this;
            _this.page['currentPage'] = v;
            _this.keywords = _this.keywordsCopy;
            _this.searchAddTime = _this.searchAddTimeCopy;
            _this.searchTag = _this.searchTagCopy;
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
            _this.searchAddTime = [];
            _this.searchTag = [];
            _this.handleCurrentChange(1);
        },
        // 列表 - 高级搜索
        handleAdvancedSearch() {
            const _this = this;
            _this.keywordsCopy = _this.keywords;
            _this.searchAddTimeCopy = _this.searchAddTime;
            _this.searchTagCopy = _this.searchTag;
            _this.handleCurrentChange(1);
            _this.searchDrawerVisible = false;
        },
        // 列表 - 高级搜索 - 清空
        handleAdvancedSearchClear() {
            const _this = this;
            _this.keywords = '';
            _this.searchAddTime = [];
            _this.searchTag = [];
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
                WorksDel(row.id).then(res => {
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