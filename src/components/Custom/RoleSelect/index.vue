<template>
    <el-select 
        :loading="optionsLoading"
        :multiple="multiple"
        :value="value"
        @input="$emit('input', $event)"
        :placeholder="placeholder"
        :clearable="clearable"
        @visible-change="visibleChange">
        <el-option
            v-for="item in getOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
        </el-option>
    </el-select>
</template>
<script>
/**
 * 角色 下拉
 * @author LiQingSong
 */
import request from '@/service/lib/request';
export default {
  name: 'RoleSelect',
  props: {
      placeholder: {
          type: String,
          default: '请选择'
      },
      clearable: {
          type: Boolean,
          default: true
      },
      multiple: {
          type: Boolean,
          default: false
      },
      /** 
       * 此参数 为编辑页面用到的时候 设置
       * 数据格式: [{value:1,label:'文字'}]
       */
      defaultOptions: {
          type: Array,
          default: function() {
            return [];
          } 
      },
      value: {
          type: [String, Number , Array],
          default: ''
      }
  },
  data() {
    return {
        optionsLoading: false,
        options: [
            /* {value:1,label:'文字1'},
            {value:2,label:'文字2'} */
        ]
    };
  },
  computed: {
    getOptions: function() {
        return this.options.length > 0 ? this.options : this.defaultOptions;
    }
  },
  methods: {
      // 获取 options 列表
      getOptionListAjax() {
            const _this = this;
            _this.optionsLoading = true;
            request({
                url: '/roles',
                method: 'get',
                params: {}
            }).then(res => {  
                const { code, data } = res;    
                if(code === 0 ) {

                    const options = data || [];

                    _this.options = options.map(item => {
                        return {
                            value: item.id,
                            label: item.name
                        };
                    });
                    _this.optionsLoading = false;
                }
            }).catch(err => {                       
                console.log(err);
            });
      },
      // select 下拉框 显示/隐藏 调用
      visibleChange(v) {
          if(!v){
              return false;
          }
          if(this.options.length > 0) {
              return false;
          }
          this.getOptionListAjax();
      }
  },
  mounted() {
      // console.log(this.getOptions);
  }
};
</script>
