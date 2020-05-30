<template>
    <el-dialog
        class="custom-dialog custom1"
        append-to-body
        :title="title"
        :width="width"
        :close-on-click-modal="clickModalClose"
        :visible.sync="params.visible">

                <el-table
                    header-row-class-name="custom-table-header"
                    border
                    stripe
                    v-loading="tableLoading"
                    :data="tableData"
                    height="320">
                    <el-table-column
                        type="index"
                        label="序号"
                        width="80"
                        :index="tableIndexMethod">
                    </el-table-column>
                    <el-table-column
                        prop="imgurl"
                        label="图片"
                        min-width="93">
                        <template slot-scope="scope">
                            <el-image
                              style="width: 70px; height: 70px"
                              :src="scope.row.imgurl"
                              :preview-src-list="[scope.row.imgurl]"
                              fit="contain">
                            </el-image>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="size"
                        label="大小"
                        min-width="100">
                    </el-table-column>

                    <slot name="el-table-column"></slot>   

                </el-table>
            

        <div slot="footer">
            <el-row>
                <el-col :span="5" class="text-left">
                    <el-popover
                        placement="top-start"
                        width="300"
                        trigger="manual"
                        v-model="visiblePopover">

                        <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
                            <el-form-item label="图片地址" prop="url">
                                <el-input v-model="ruleForm.url"></el-input>
                            </el-form-item>
                            <el-form-item>
                                <el-button @click="insertUrl('ruleForm')">确认</el-button>
                                <el-button @click="visiblePopover = !visiblePopover">取消</el-button>
                            </el-form-item>
                        </el-form>

                        <el-button slot="reference" class="float-left" size="small" type="primary" @click="visiblePopover = !visiblePopover">外链</el-button>
                        
                    </el-popover>
                    

                    <el-button v-if="uploadLoading" class="margin-l5" size="small" type="primary" :loading="true" >上传</el-button>
                    <!-- with-credentials 用的是token 所以不需要设置为true -->
                    <el-upload
                        v-else
                        :with-credentials="false"
                        :headers="uploadHeaders"
                        :action="uploadAction"
                        :show-file-list="false"
                        :on-success="fileUploadSuccess"
                        :on-error="fileUploadError"
                        :before-upload="fileUploadBeforeUpload">
                        <el-button  class="margin-l5" size="small" type="primary" >上传</el-button>
                    </el-upload>

                </el-col>
                <el-col :span="19">
                    <el-pagination 
                        background
                        @current-change="handleCurrentChange"
                        :current-page.sync="page.currentPage"
                        :page-size="page.pageSize"
                        layout="total, prev, pager, next"
                        :total="page.total">
                    </el-pagination>
                </el-col>
            </el-row>
        </div>
    </el-dialog>
</template>
<script>
import { ajaxHeadersTokenKey } from '@/settings';
import { isExternal } from '@/utlis/validate';
import request from '@/service/lib/request';
export default {
    name: 'ServerImageDialog',
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
            default: '图片列表'
        },
        width: {
            type: String,
            default: '780px'
        },
        clickModalClose: {
            type: Boolean,
            default: true
        },
        // 允许文件上传的类型
        isFileType: {
            type: Array,
            default: function() {
                return ['image/png','image/gif','image/jpeg'];
            }
        },
        // 单文件最大上传大小，单位M
        maxsize: {
            type: Number,
            default: 1
        }
    },
    data() {
        return {
                // 列表 - 分页
                page: {
                    pageSize: 5, //每页显示多少条
                    currentPage: 1, //当前页码
                    total: 0 //总条数
                },
                // 列表
                tableLoading: false,
                tableData: [
                    /* {
                        imgurl: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
                        size: '2.98 KB'
                    } */
                ],
                // 上传 - loading
                uploadLoading: false,
                // 外链图片弹框是否显示
                visiblePopover: false,
                // 外链图片表单
                ruleForm: {
                    url: ''
                },
                rules: {
                    url: [
                       { 
                        required: true,
                        validator: (rule, value, callback) => {
                            if (value === '') {
                                callback(new Error('请输入外链图片地址'));
                            } else if (!isExternal(value)) {
                                callback(new Error('外链图片地址不正确'));
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
    computed: {
        getVisible: function() {
            return this.params.visible;
        },
        uploadHeaders: function() {
            const headers = {};
            if(this.$store.getters.token) {
                headers[ajaxHeadersTokenKey] = this.$store.getters.token;
            }
            return headers;
        },
        uploadAction: function() {
            // https://jsonplaceholder.typicode.com/posts/
            return process.env.VUE_APP_APIHOST + '/upload/images';
        }
    },
    watch: {
        getVisible(v) {
            const _this = this;
            if(v) {
                _this.handleCurrentChange(1);
            } else {
                _this.visiblePopover = false;
            }
        }
    },
    methods: {
        // 列表 - ajax
        listAjax(params) {
            return request({
                url: '/upload/images',
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
                page: _this.page.currentPage
            };
            _this.listAjax(paramData).then(res => {
                // console.log(res);
                const { data } = res;
                const { total, list } = data;
                _this.page.total = total;
                
                _this.tableData = list.map((item) => {
                    return {
                        imgurl: item.imgurl,
                        size: item.size
                    };
                });
                _this.tableLoading = false;
            });
        },
        // 列表 - 点击分页
        handleCurrentChange(v) {
            const _this = this;
            _this.page['currentPage'] = v;
            _this.tableLoading = true;
            _this.getList();
        },
        // 上传 - 上传之前
        fileUploadBeforeUpload(file) {
            // console.log(file);
            const _this = this;
            const isType = _this.isFileType.length > 0 ? _this.isFileType.includes(file.type) : true;
            if(!isType) {
              _this.$message.error('上传图片只能是 ' + _this.isFileType.join('、') + ' 格式!');
              return false;
            }

            const isLtMaxSize = file.size / 1024 / 1024 < _this.maxsize;
            if (!isLtMaxSize) {
                _this.$message.error('上传图片大小不能超过 ' + _this.maxsize + 'M!');
                return false;
            }            

            _this.uploadLoading = true;
        },
        // 上传 - 成功时 
        fileUploadSuccess(){
            // console.log(response, file, fileList);
            this.uploadLoading = false;
            this.handleCurrentChange(1);
        } , 
        // 上传 - 失败时 
        fileUploadError(err) {
            // console.log(err, file, fileList);
            this.uploadLoading = false;
            this.$message.warning('文件上传失败:' + err);
        },
        // 插入外链图片
        insertUrl(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.$emit("insertImgUrl",this.ruleForm.url);
                    this.$refs[formName].resetFields();
                    this.visiblePopover = false;
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        }
        
    }
};
</script>