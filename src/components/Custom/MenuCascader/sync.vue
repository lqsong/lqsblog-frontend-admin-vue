<template>
    <el-cascader    
        v-loading="params.isEdit? true: params.dataLoading"
        :separator="separator"
        :placeholder="placeholder"
        :clearable="clearable"
        :value="value"
        @input="$emit('input', $event)"
        :props="props"
        :options="options"
        @visible-change="visibleChange"
        >
    </el-cascader>
</template>
<script>
/**
 * 菜单 联动下拉 - 获取全部数据
 * @author LiQingSong
 */
import request from '@/service/lib/request';
import { formatEleUiLevelData } from '@/utlis/formatData';
export default {
  name: 'MenuCascaderSync',
  props: {
      params: {
        type: Object,
        default: function() {
          return {
            'isEdit': false, // 此参数在编辑页面的时候调用 设置为true ,获取完数据后再设置false
            'dataLoading': false // 此参数的作用是编辑页面的时候调用 设置为true，获取数据的loading
          };
        }
      },
      // 是否严格的遵守父子节点不互相关联
      checkStrictly: {
        type: Boolean,
        default: false
      },
      separator: {
          type: String,
          default: '>'
      },
      placeholder: {
          type: String,
          default: '请选择'
      },
      clearable: {
          type: Boolean,
          default: true
      },
      value: {
          type: Array,
          default: function() {
                return [];
          }
      },
      multipleSelection: {//多选
          type: Boolean,
          default: false
      }
  },
  data() {
    const _this = this;
    return {
        // 数据
        options: [],
        props: {
          multiple: _this.multipleSelection,
          checkStrictly: _this.checkStrictly,
          expandTrigger: _this.checkStrictly ? 'hover' : 'click'
        }
    };
  },
  computed: {
    getIsEdit: function() {
      return this.params.isEdit;
    }
  },
  watch: {
    getIsEdit(v) {
      if(v){
          this.visibleChange(true);
      }
    }
  },
  methods: {
      // 获取 options 列表
      getOptionListAjax() {
            const _this = this;
            _this.params.dataLoading = true;
            request({
                url: '/menus/all',
                method: 'get',
                params: {}
            }).then(res => {  
                const { code, data } = res;    
                if(code === 0 ) {
                    const options = data || [];
                    _this.options = formatEleUiLevelData(options, 'id', 'name', 'pid', 0);
                    _this.params.dataLoading = false;
                    _this.params.isEdit = false;
                }
            }).catch(err => {                       
                console.log(err);
            });
      },
      // 下拉框 显示/隐藏 调用
      visibleChange(v) {
          if(!v){
              return false;
          }
          if(this.options.length > 0) {
              this.params.dataLoading = false;
              this.params.isEdit = false;
              return false;
          }
          this.getOptionListAjax();
      }
  },
  mounted() {
      if(this.params.isEdit) {
        this.visibleChange(true);
      }
  }
};
</script>
