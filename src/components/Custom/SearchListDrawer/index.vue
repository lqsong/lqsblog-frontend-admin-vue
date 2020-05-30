<template>
    <el-drawer
        custom-class="custom-drawer"
        :visible.sync="params.visible"
        :wrapperClosable="wrapperClosable"
        :size="size"
        append-to-body
        :title="title">

                <el-form :inline="true" @submit.native.prevent>
                    <el-form-item label="标题:">
                        <el-input v-model="searchVal" 
                            placeholder="请输入标题" class="width-200" 
                            clearable @keyup.enter.native="handleSearch">
                        </el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="handleSearch">搜索</el-button>
                    </el-form-item>
                </el-form>                  
        
                <el-table
                    header-row-class-name="custom-table-header"
                    border
                    stripe
                    v-loading="tableLoading"
                    :data="tableData">
                    <el-table-column
                        type="index"
                        label="序号"
                        width="80"
                        :index="tableIndexMethod">
                    </el-table-column>
                    <el-table-column
                        label="类型"
                        width="65">
                        <template slot-scope="scope">
                            <el-tag v-if="scope.row.type === 1">随笔</el-tag>
                            <el-tag type="success" v-else>作品</el-tag>                  
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="title"
                        label="标题"
                        min-width="260">
                    </el-table-column>
                    <el-table-column
                        label="分类"
                        min-width="100">
                        <template slot-scope="scope">
                            <template v-if="scope.row.type === 1">{{ scope.row.category.name }} </template>
                            <template v-else>--</template>                       
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="addtime"
                        label="发布时间"
                        min-width="140">
                    </el-table-column>

                    <slot name="el-table-column"></slot>   

                </el-table>

        <div class="custom-drawer-footer">
            <el-pagination 
                background
                @current-change="handleCurrentChange"
                :current-page.sync="page.currentPage"
                :page-size="page.pageSize"
                layout="total, prev, pager, next"
                :total="page.total">
            </el-pagination>
        </div>
    </el-drawer>
</template>
<script>
import request from '@/service/lib/request';
export default {
    name: 'SearchListDrawer',
    props: {
        params: {
            type: Object,
            default: function() {
                return {
                    'visible': false // 弹框是否显示
                };
            }
        },
        title: {
            type: String,
            default: '内容列表'
        },
        size: {
            type: String,
            default: '80%'
        },
        wrapperClosable: {
            type: Boolean,
            default: true
        }
    },
    data() {
        return {
                // 列表 - 搜索
                searchVal: '',
                searchValCopy: '',

                // 列表 - 分页
                page: {
                    pageSize: 20, //每页显示多少条
                    currentPage: 1, //当前页码
                    total: 0 //总条数
                },
                // 列表
                tableLoading: false,
                tableData: [] 
        };
    },
    computed: {
        getVisible: function() {
            return this.params.visible;
        }
    },
    watch: {
        getVisible(v) {
            const _this = this;
            if(v) {
                _this.handleCurrentChange(1);
            }
        }
    },
    methods: {
        // 列表 - ajax
        listAjax(params) {
            return request({
                url: '/searchs',
                method: 'get',
                params
            });
        },
        // 列表 - 设置表格序号
        tableIndexMethod(index) {
            return index + (this.page.currentPage - 1) * this.page.pageSize + 1;
        },
        // 列表 - 获取
        getList() {
            const _this = this;
            const paramData = {
                per: _this.page.pageSize,
                page: _this.page.currentPage,
                keywords: _this.searchVal
            };
            _this.listAjax(paramData).then(res => {
                // console.log(res);
                const { data } = res;
                const { total, list } = data;
                
                _this.page.total = total;
                
                _this.tableData = list.map((item) => {
                    return {
                        type: item.type,
                        id: item.id,
                        title: item.title,
                        description: item.description,
                        thumb: item.thumb,
                        addtime: item.addtime,
                        category: item.category
                    };
                });
                _this.tableLoading = false;
            });
        },
        // 列表 - 点击分页
        handleCurrentChange(v) {
            const _this = this;
            _this.page['currentPage'] = v;
            _this.searchVal = _this.searchValCopy;
            _this.tableLoading = true;
            _this.getList();
        },
        // 列表 - 搜索
        handleSearch() {
            const _this = this;
            _this.searchValCopy = _this.searchVal;
            _this.handleCurrentChange(1);
        }
        
    }
};
</script>