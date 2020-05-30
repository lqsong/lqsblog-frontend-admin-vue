<template>
    <el-select 
        :loading="optionsLoading"
        :multiple="multiple"
        :value="value"
        @input="$emit('input', $event)"
        :placeholder="placeholder"
        :clearable="clearable"
        filterable
        remote
        reserve-keyword
        :remote-method="remoteMethod">
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
 * 标签 下拉 远程搜索
 * @author LiQingSong
 */
import request from '@/service/lib/request';
export default {
  name: 'TagSelect',
  props: {
      placeholder: {
          type: String,
          default: '请搜索选择'
      },
      clearable: {
          type: Boolean,
          default: true
      },
      multiple: {
          type: Boolean,
          default: true
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
          type: [String, Number, Array],
          default: ''
      }
  },
  data() {
    return {
        optionsLoading: false,
        options: []
    };
  },
  computed: {
    getOptions: function() {
        return this.options.length > 0 ? this.options : this.defaultOptions;
    }
  },
  methods: {
      remoteMethod(query) {
        const _this = this;       
        if (query !== '') {
            _this.optionsLoading = true;
            request({
                url: '/tags/search',
                method: 'get',
                params: {
                    keywords: query
                }
            }).then(res => {  
                const { code, data } = res;      
                if(code === 0 ) {
                    const options = data || [];

                    _this.options = options.map(item => {
                        return {
                            // value: item.id,
                            value: item.name,
                            label: item.name
                        };
                    });
                    _this.optionsLoading = false;
                }
            }).catch(err => {                       
                console.log(err);
            });
        } else {
          _this.options = [];
        }
      }
  },
  mounted() {
      // console.log(this.getOptions);
  }
};
</script>
