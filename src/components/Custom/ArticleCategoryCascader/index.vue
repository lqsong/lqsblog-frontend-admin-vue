<template>
    <el-input 
      v-if="params.isEdit"
      v-loading="true"
      :placeholder="placeholder">
    </el-input>
    <el-cascader    
        v-else
        v-loading="params.dataLoading"
        :separator="separator"
        :placeholder="placeholder"
        :clearable="clearable"
        :value="value"
        @input="$emit('input', $event)"
        :props="props"
        :options="options"
        >
    </el-cascader>
</template>
<script>
/**
 * 文章分类 联动下拉 - 异步获取数据
 * @author LiQingSong
 */
import request from '@/service/lib/request';
export default {
  name: 'ArticleCategoryCascader',
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
          expandTrigger: _this.checkStrictly ? 'hover' : 'click',
          lazy: true,
          lazyLoad (node, resolve) {
              const { level } = node;
              const pid = level === 0 ? 0 : node.value; 
              request({
                url: '/article/categorys/cascader',
                method: 'get',
                params: {
                  pid
                }
              }).then(res => {  
                    const { code, data } = res;      
                    if(code === 0 ) {
                      const nodes = data.map((v) => {
                          return {
                            value: v.id,
                            label: v.name,
                            leaf: v.leaf
                          };
                      });
                      if (_this.params.dataLoading) {
                        if(_this.value.length<= (level + 1)) { 
                          _this.params.dataLoading = false;
                        }
                      }
                      resolve(nodes);
                    } else {
                      resolve(null);
                    }
              }).catch(err => {                       
                  console.log(err);
              });

          }
        }
    };
  },
  methods: {
  },
  mounted() {
  }
};
</script>
