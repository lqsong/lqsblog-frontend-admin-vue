<template>
    <div>
            <div>
              <ul class="el-upload-list el-upload-list--picture-card">

                <li tabindex="0" class="el-upload-list__item is-success" v-for="(item, index) in value" :key="index">
                  <img :src="item" class="el-upload-list__item-thumbnail">
                  <label class="el-upload-list__item-status-label"><i class="el-icon-upload-success el-icon-check"></i></label>
                  
                  <span class="el-upload-list__item-actions">
                    <span class="el-upload-list__item-preview" @click="handlePictureCardPreview(item)">
                      <i class="el-icon-zoom-in"></i>
                    </span>
                    <span class="el-upload-list__item-delete" @click="handlePictureDel(index)">
                      <i class="el-icon-delete"></i>
                    </span>
                  </span>
                </li>               

            
              </ul>

              <div v-if="valueLen < limit" class="el-upload el-upload--picture-card" @click="serverImageDialogParam.visible=true"><i class="el-icon-plus"></i></div>

            </div>

            <el-dialog append-to-body :visible.sync="dialogVisible">
              <img width="100%" :src="dialogImageUrl" alt="">
            </el-dialog>

            <server-image-dialog title="选择图片" :params="serverImageDialogParam" @insertImgUrl="insertImgUrl">
                <template slot="el-table-column">
                    <el-table-column
                        fixed="right"
                        width="80"
                        label="操作">
                        <template slot-scope="scope">
                            <el-button
                                type="primary"
                                size="mini"
                                @click="selectData(scope.row)">
                                选择
                            </el-button>                     
                        </template>
                    </el-table-column>
                </template>
            </server-image-dialog>
    </div>
</template>
<script>
import ServerImageDialog from './Dialog';
export default {
    name: 'ServerImageSelectionList',
    props: {
        // 图片数据
        value: {
            type: Array,
            default: function() {
                return [];
            }
        },
        // 可以选择的数量
        limit: {
            type: Number,
            default: 1
        },
        // 选择图片后是否隐藏服务器图片弹框
        selectHideServerDialog: {
            type: Boolean,
            default: true
        }
    },
    components: {
      ServerImageDialog
    },
    data() {
      return {
        serverImageDialogParam: {
          visible: false
        },
        // 缩略图
        dialogImageUrl: '',
        dialogVisible: false
        
      };
    },
    computed: {
        valueLen: function() {
            return this.value.length;
        }
    },
    methods: {
        // 弹框图片列表 - 选择
        selectData(row) {
            const _this = this;
            if (_this.valueLen >= _this.limit) {
                _this.$message({ message: `最多选择 ${_this.limit} 张图片！`, type: 'error' });
                _this.serverImageDialogParam.visible = false;
                return false;
            }

            _this.value.push(row.imgurl);

            if (_this.selectHideServerDialog) {
                _this.serverImageDialogParam.visible = false;
            }
        },
        // 弹框图片列表 - 插入外链图片
        insertImgUrl(val) {
          this.selectData({imgurl:val});
        },
        // 显示列表 - 图片放大
        handlePictureCardPreview(fileurl) {
            this.dialogImageUrl = fileurl;
            this.dialogVisible = true;
        },
        // 显示列表 - 图片删除
        handlePictureDel(index) {
           this.value.splice(index,1);
        }
    }
};
</script>