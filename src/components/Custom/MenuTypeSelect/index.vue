<template>
    <el-select 
        :loading="optionsLoading"
        :value="value"
        @input="$emit('input', $event)"
        :placeholder="placeholder"
        :clearable="clearable">
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
 * 菜单类型 下拉
 * @author LiQingSong
 */
export default {
  name: 'MenuTypeSelect',
  props: {
      placeholder: {
          type: String,
          default: '请选择'
      },
      clearable: {
          type: Boolean,
          default: true
      },
      value: {
          type: [String, Number, Array],
          default: ''
      }
  },
  data() {
    return {
        optionsLoading: false,
        options: [
            {value: 1,label:'菜单'},
            {value: 2,label:'按钮'}
        ]
    };
  },
  computed: {
    getOptions: function() {
        return this.options;
    }
  },
  methods: {
  }
};
</script>
