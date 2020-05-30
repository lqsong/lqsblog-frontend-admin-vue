import { trim } from '@/utlis/trim';
export default {
  data() {
    return {
        // 分页
        page: {
          pageSize: 20, //每页显示多少条
          currentPage: 1, //当前页码
          total: 0 //总条数
       }
    };
  },
  computed: {
    pageSizes: function() {
      return [20, 50, 100];
    }
  },
  methods: {
    // 列表 - 设置表格序号
    tableIndexMethod(index) {
      let num = index + (this.page.currentPage - 1) * this.page.pageSize + 1;
      /* return num < 10 ? '0' + num : num; */
      return num;
    },    
    // 验证id
    verificationId(id) {
        if (id < 1 || isNaN(id)) {
            this.$alert('参数出错！', '警告', {
                showClose: false,
                confirmButtonText: '确定',
                callback: () => {
                    this.$router.replace({ path: '/' });
                }
            });
            return false;
        }
        return true;
    },
    // 验证字符串空
    verificationStrEmpty(ids) {
      ids = trim(ids);
      if(ids === '0' || ids === 0 || !ids ) {
            this.$alert('参数出错！', '警告', {
                showClose: false,
                confirmButtonText: '确定',
                callback: () => {
                    this.$router.replace({ path: '/' });
                }
            });
            return false;
      }
      return true;
    }
  }
};
