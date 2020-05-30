<template>
  <div class="main-conent main-conent-minheight">

    <el-row :gutter="24">
        <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
          <el-card class="home-box-card" shadow="never" v-loading="articleChartLoading">
            <div slot="header">
              <span>随笔</span>
              <el-tag class="float-right">日</el-tag>
            </div>
            <div class="num">{{ articleChartData.num.toLocaleString() }}</div>

            <div class="height-40">
              <div class="padding-t20 home-article-text">
                <span>日同比 {{ Math.abs(articleChartData.day) }}% <i class="el-icon-caret-bottom" :class="{'top': articleChartData.day > 0}"></i></span>
                <span class="margin-l10">周同比 {{ Math.abs(articleChartData.week) }}% <i class="el-icon-caret-bottom" :class="{'top': articleChartData.week > 0}"></i></span>
              </div>
            </div>

            <el-divider></el-divider>
            <el-row class="bot">
                <el-col :span="12">
                  总数量
                </el-col>
                <el-col :span="12" class="text-right">
                   {{ articleChartData.total.toLocaleString() }}
                </el-col>
            </el-row>
          </el-card>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
          <el-card class="home-box-card" shadow="never" v-loading="worksChartLoading">
            <div slot="header">
              <span>作品</span>
              <el-tag class="float-right" type="success">周</el-tag>
            </div>
            <div class="num">{{ worksChartData.num.toLocaleString() }}</div>

            <div id="home-works-chart" class="height-40"></div>
            
            <el-divider></el-divider>
            <el-row class="bot">
                <el-col :span="12">
                  总数量
                </el-col>
                <el-col :span="12" class="text-right">
                   {{ worksChartData.total.toLocaleString() }}
                </el-col>
            </el-row>
          </el-card>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
          <el-card class="home-box-card" shadow="never" v-loading="topicsChartLoading">
            <div slot="header">
              <span>专题</span>
              <el-tag class="float-right" type="warning">月</el-tag>
            </div>
            <div class="num">{{ topicsChartData.num.toLocaleString() }}</div>

            <div id="home-topics-chart" class="height-40"></div>

            <el-divider></el-divider>
            <el-row class="bot">
                <el-col :span="12">
                  总数量
                </el-col>
                <el-col :span="12" class="text-right">
                   {{ topicsChartData.total.toLocaleString() }}
                </el-col>
            </el-row>
          </el-card>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
          <el-card class="home-box-card" shadow="never" v-loading="linksChartLoading">
            <div slot="header">
              <span>左邻右舍</span>
              <el-tag class="float-right" type="danger">年</el-tag>
            </div>
            <div class="num">{{ linksChartData.num.toLocaleString() }}</div>

            <div id="home-links-chart" class="height-40"></div>

            <el-divider></el-divider>
            <el-row class="bot">
                <el-col :span="12">
                  总数量
                </el-col>
                <el-col :span="12" class="text-right">
                   {{ linksChartData.total.toLocaleString() }}
                </el-col>
            </el-row>
          </el-card>
        </el-col>
    </el-row>


    <el-row :gutter="24">
        <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
          <el-card class="home-box-card" shadow="never">
            <div slot="header">
              <span>热门搜索</span>
            </div>

            <el-table
               v-loading="searchTableLoading"
               header-row-class-name="custom-table-header"
               stripe
              :data="searchTableData">
              <el-table-column
                show-overflow-tooltip
                type="index"
                label="序号"
                :index="index => { return tableIndexMethod(searchTablePage, index); }"
                min-width="50">
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                prop="name"
                label="关键词"
                min-width="300">
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                prop="hit"
                label="次数"
                min-width="100">
              </el-table-column>
            </el-table>

            <div class="text-right padding-t10">
              <el-pagination
                small
                layout="prev, pager, next"
                @current-change="searchKeywordsHandleCurrentChange"
                :current-page.sync="searchTablePage.currentPage"
                :page-size="searchTablePage.pageSize"
                :total="searchTablePage.total">
              </el-pagination>
            </div>
            
          </el-card>
        </el-col>
        <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
          <el-card class="home-box-card" shadow="never">
            <div slot="header">
              <span>热门标签</span>
            </div>

            <el-table
               v-loading="tagTableLoading"
               header-row-class-name="custom-table-header"
               stripe
              :data="tagTableData">
              <el-table-column
                show-overflow-tooltip
                type="index"
                label="序号"
                :index="index => { return tableIndexMethod(tagTablePage, index); }"
                min-width="50">
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                prop="name"
                label="标签"
                min-width="300">
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                prop="hit"
                label="次数"
                min-width="100">
              </el-table-column>
            </el-table>

            <div class="text-right padding-t10">
              <el-pagination
                small
                layout="prev, pager, next"
                @current-change="tagHandleCurrentChange"
                :current-page.sync="tagTablePage.currentPage"
                :page-size="tagTablePage.pageSize"
                :total="tagTablePage.total">
              </el-pagination>
            </div>
            
          </el-card>
        </el-col>
    </el-row>


    <el-row :gutter="24">
        <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
          <el-card class="home-box-card" shadow="never">
            <div slot="header">
              <span>随笔浏览量排行</span>
            </div>

            <el-table
               v-loading="articleTableLoading"
               header-row-class-name="custom-table-header"
               stripe
              :data="articleTableData">
              <el-table-column
                show-overflow-tooltip
                type="index"
                label="序号"
                :index="index => { return tableIndexMethod(articleTablePage, index); }"
                min-width="50">
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                prop="title"
                label="标题"
                min-width="300">
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                prop="hit"
                label="浏览量"
                min-width="100">
              </el-table-column>
            </el-table>

            <div class="text-right padding-t10">
              <el-pagination
                small
                layout="prev, pager, next"
                @current-change="articleHandleCurrentChange"
                :current-page.sync="articleTablePage.currentPage"
                :page-size="articleTablePage.pageSize"
                :total="articleTablePage.total">
              </el-pagination>
            </div>
            
          </el-card>
        </el-col>
        <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
          <el-card class="home-box-card" shadow="never">
            <div slot="header">
              <span>作品浏览量排行</span>
            </div>
            
            <el-table
               v-loading="worksTableLoading"
               header-row-class-name="custom-table-header"
               stripe
              :data="worksTableData">
              <el-table-column
                show-overflow-tooltip
                type="index"
                label="序号"
                :index="index => { return tableIndexMethod(worksTablePage, index); }"
                min-width="50">
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                prop="title"
                label="标题"
                min-width="300">
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                prop="hit"
                label="浏览量"
                min-width="100">
              </el-table-column>
            </el-table>

            <div class="text-right padding-t10">
              <el-pagination
                small
                layout="prev, pager, next"
                @current-change="worksHandleCurrentChange"
                :current-page.sync="worksTablePage.currentPage"
                :page-size="worksTablePage.pageSize"
                :total="worksTablePage.total">
              </el-pagination>
            </div>
            
            
          </el-card>
        </el-col>
    </el-row>



  </div>
</template>
<script>
import { StatsArticleDailyNew, StatsWorksWeekNew, StatsTopicsMonthNew, StatsLinksAnnualNew } from '@/service/stats';
import { SearchsKeywords } from '@/service/searchs';
import { TagList } from '@/service/setting';
import { ArticleList } from '@/service/article';
import { WorksList } from '@/service/works';
import { mapGetters } from 'vuex';
import echarts from 'echarts';
require('echarts/theme/macarons'); // echarts theme
import { debounce } from '@/utlis';
export default {
  name: 'Home',
  data() {
    return {
      // 随笔浏览量排行 - 表格
      articleTableLoading: true,
      articleTableData: [
        /* {
          title: '标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题',
          pageview: 1024
        } */
      ],
      // 随笔浏览量排行 - 表格 - 分页
      articleTablePage: {
        pageSize: 5, //每页显示多少条
        currentPage: 1, //当前页码
        total: 0 //总条数
      },
      // 作品浏览量排行 - 表格
      worksTableLoading: true,
      worksTableData: [
        /* {
          title: '标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题',
          pageview: 1024
        } */
      ],
      // 作品浏览量排行 - 表格 - 分页
      worksTablePage: {
        pageSize: 5, //每页显示多少条
        currentPage: 1, //当前页码
        total: 0 //总条数
      },
      // 热门搜索 - 表格
      searchTableLoading: true,
      searchTableData: [
        /* {
          title: '标题标题',
          num: 1024
        } */
      ],
      // 热门搜索 - 表格 - 分页      
      searchTablePage: {
        pageSize: 5, //每页显示多少条
        currentPage: 1, //当前页码
        total: 100 //总条数
      },
      // 热门标签 - 表格
      tagTableLoading: true,
      tagTableData: [
        /* {
          name: '标题标题',
          viewcount: 1024
        } */
      ],
      // 热门标签 - 表格 - 分页
      tagTablePage: {
        pageSize: 5, //每页显示多少条
        currentPage: 1, //当前页码
        total: 100 //总条数
      },
      // 随笔 - chart
      articleChartLoading: true,
      articleChartData: {
        total: 0,
        num: 0,
        day: 0,
        week: 0
      },
      // 作品 - chart
      worksChartLoading: true,
      worksChartData: {
        total: 0,
        num: 0,
        option: {}
      },
      worksChart: null,
      // 专题 - chart
      topicsChartLoading: true,
      topicsChartData: {
        total: 0,
        num: 0,
        option: {}
      },
      topicsChart: null,
      // 左邻右舍 - chart
      linksChartLoading: true,
      linksChartData: {
        total: 0,
        num: 0,
        option: {}
      },
      linksChart: null,
      resizeHandler: null
    };
  },
  computed: {
    ...mapGetters([
        'sidebarOpened'
      ])
  },
  watch: {
    sidebarOpened() {
      this.resizeHandler();
    }
  },
  methods: {
    // 图表初始化
    initChart() {

      const worksOption = {
          tooltip: {
              trigger: 'axis'
          },
          grid: {
            left: '0',
            right: '0',
            top: '0',
            bottom: '0'
          },
          xAxis: {
              show: false,
              boundaryGap: false,
              data: [/* '03-01','03-02','03-03','03-04','03-05','03-06','03-07' */]
          },
          yAxis: {
              show: false
          },
          series: [{
              name: '新增',
              type: 'line',
              data: [/* 23,60,20,36,23,85,23 */],
              areaStyle: {
                color: {
                    colorStops: [{
                        offset: 0,
                        color: '#A9F387' // 0% 处的颜色
                    }, {
                        offset: 1,
                        color: '#48D8BF' // 100% 处的颜色
                    }],
                    globalCoord: false // 缺省为 false
                }
              },
              lineStyle: {
                normal: {
                      width: 0
                }
              },
              itemStyle: {
                  normal: {
                      borderWidth: 1
                  }
              }
          }]
      };
      this.worksChart = echarts.init(document.getElementById('home-works-chart'),'macarons');
      this.worksChart.setOption(worksOption);

      const topicsOption = {
          tooltip: {
              trigger: 'axis'
          },
          grid: {
            left: '0',
            right: '0',
            top: '0',
            bottom: '0'
          },
          xAxis: {
              show: false,
              data: [/* '03-01','03-02','03-03','03-04','03-05','03-06','03-07','03-08','03-09','03-10','03-11','03-12','03-13','03-15','03-15','03-16','03-17','03-18','03-19','03-20','03-21','03-22','03-23','03-24','03-25','03-26','03-27','03-28','03-29','03-30' */]
          },
          yAxis: {
              show: false
          },
          series: [{
              name: '新增',
              type: 'line',
              data: [/* 23,60,20,36,23,85,23,60,20,36,23,85,23,60,20,36,23,85,23,60,20,36,23,85,23,60,20,36,23,85 */],
              lineStyle: {
                  normal: {
                      width: 3,
                      color: {
                          type: 'linear',
                          colorStops: [{
                              offset: 0,
                              color: '#A9F387' // 0% 处的颜色
                          }, {
                              offset: 1,
                              color: '#48D8BF' // 100% 处的颜色
                          }],
                          globalCoord: false // 缺省为 false
                      },
                      shadowColor: 'rgba(72,216,191, 0.3)',
                      shadowBlur: 10,
                      shadowOffsetY: 20
                  }
              },
              itemStyle: {
                  normal: {
                      borderWidth: 6,
                      borderColor: "#A9F387"
                  }
              },
              smooth: true
          }]
      };
      this.topicsChart = echarts.init(document.getElementById('home-topics-chart'),'macarons');
      this.topicsChart.setOption(topicsOption);

      const linksOption = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                  type: 'shadow'
                }
            },
            grid: {
              left: '0',
              right: '0',
              top: '0',
              bottom: '0'
            },
            xAxis: {
              show: false,
              data: [/* '2019-04', '2019-05', '2019-06','2019-07', '2019-08', '2019-09', '2019-10', '2019-11', '2019-12', '2020-01', '2020-02', '2020-03' */]
            },
            yAxis: {
              show: false
            },
            series: [{
                name: '新增',
                type: 'bar',
                data: [/* 5888, 3838, 15880, 12888, 18888, 16888,5888, 3838, 15880, 12888, 18888, 16888 */]
            }]
      };
      this.linksChart = echarts.init(document.getElementById('home-links-chart'),'macarons');
      this.linksChart.setOption(linksOption);
      

    },
    // 监听
    initResizeEvent() {
      window.addEventListener('resize', this.resizeHandler);
    },
    // 随笔统计
    getArticleStats() {
        const _this = this;
        StatsArticleDailyNew().then(res => {
            // console.log(res);
            const { data } = res;
            const { total, num, day, week } = data;
            _this.articleChartData.total = total;
            _this.articleChartData.num = num;
            _this.articleChartData.day = day;
            _this.articleChartData.week = week;
            _this.articleChartLoading = false;
        });
    },
    // 作品统计
    getWorksStats() {
        const _this = this;
        StatsWorksWeekNew().then(res => {
            // console.log(res);
            const { data } = res;
            const { total, num, chart } = data;
            _this.worksChartData.total = total;
            _this.worksChartData.num = num;

            _this.worksChartData.option = {
              xAxis: {
                  data: chart.day
              },
              series: [{
                  name: '新增',
                  data: chart.num
              }]
            };
            _this.worksChart.setOption(_this.worksChartData.option);
           
            _this.worksChartLoading = false;
        });
    },
    // 专题统计
    getTopicsStats() {
        const _this = this;
        StatsTopicsMonthNew().then(res => {
            // console.log(res);
            const { data } = res;
            const { total, num, chart } = data;
            _this.topicsChartData.total = total;
            _this.topicsChartData.num = num;

            _this.topicsChartData.option = {
              xAxis: {
                  data: chart.day
              },
              series: [{
                  name: '新增',
                  data: chart.num
              }]
            };
            _this.topicsChart.setOption(_this.topicsChartData.option);
           
            _this.topicsChartLoading = false;
        });
    },
    // 左邻右舍统计
    getLinksStats() {
        const _this = this;
        StatsLinksAnnualNew().then(res => {
            // console.log(res);
            const { data } = res;
            const { total, num, chart } = data;
            _this.linksChartData.total = total;
            _this.linksChartData.num = num;

            _this.linksChartData.option = {
              xAxis: {
                  data: chart.day
              },
              series: [{
                  name: '新增',
                  data: chart.num
              }]
            };
            _this.linksChart.setOption(_this.linksChartData.option);
           
            _this.linksChartLoading = false;
        });
    },
    // 列表 - 设置表格序号
    tableIndexMethod(page, index) {
      let num = index + (page.currentPage - 1) * page.pageSize + 1;
      return num;
    },  
    // 随笔浏览量排行 - 表格 - 获取
    getArticleList() {
        const _this = this;
        const paramData = {
            per: _this.articleTablePage.pageSize,
            page: _this.articleTablePage.currentPage,
            sort: 1
        };
        ArticleList(paramData).then(res => {
            // console.log(res);
            const { data } = res;
            const { total, list } = data;
            _this.articleTablePage.total = total;
            _this.articleTableData = list;
            _this.articleTableLoading = false;
        });
    },
    // 随笔浏览量排行 - 表格 - 点击分页
    articleHandleCurrentChange(v) {
        const _this = this;
        _this.articleTablePage['currentPage'] = v;
        _this.articleTableLoading = true;
        _this.getArticleList();
    },
    // 作品浏览量排行 - 表格 - 获取
    getWorksList() {
        const _this = this;
        const paramData = {
            per: _this.worksTablePage.pageSize,
            page: _this.worksTablePage.currentPage,
            sort: 1
        };
        WorksList(paramData).then(res => {
            // console.log(res);
            const { data } = res;
            const { total, list } = data;
            _this.worksTablePage.total = total;
            _this.worksTableData = list;
            _this.worksTableLoading = false;
        });
    },
    // 作品浏览量排行 - 表格 - 点击分页
    worksHandleCurrentChange(v) {
        const _this = this;
        _this.worksTablePage['currentPage'] = v;
        _this.worksTableLoading = true;
        _this.getWorksList();
    },
    // 热门搜索 - 表格 - 获取
    getSearchKeywordsList() {
        const _this = this;
        const paramData = {
            per: _this.searchTablePage.pageSize,
            page: _this.searchTablePage.currentPage
        };
        SearchsKeywords(paramData).then(res => {
            // console.log(res);
            const { data } = res;
            const { total, list } = data;
            _this.searchTablePage.total = total;
            _this.searchTableData = list;
            _this.searchTableLoading = false;
        });
    },
    // 热门搜索 - 表格 - 点击分页
    searchKeywordsHandleCurrentChange(v) {
        const _this = this;
        _this.searchTablePage['currentPage'] = v;
        _this.searchTableLoading = true;
        _this.getSearchKeywordsList();
    },
    // 热门标签 - 表格 - 获取
    getTagList() {
        const _this = this;
        const paramData = {
            per: _this.tagTablePage.pageSize,
            page: _this.tagTablePage.currentPage,
            sort: 1
        };
        TagList(paramData).then(res => {
            // console.log(res);
            const { data } = res;
            const { total, list } = data;
            _this.tagTablePage.total = total;
            _this.tagTableData = list;
            _this.tagTableLoading = false;
        });
    },
    // 热门标签 - 表格 - 点击分页
    tagHandleCurrentChange(v) {
        const _this = this;
        _this.tagTablePage['currentPage'] = v;
        _this.tagTableLoading = true;
        _this.getTagList();
    }
  },
  mounted() {
    const _this = this;
    _this.resizeHandler = debounce(() => {


      // 作品 - chart
      if (_this.worksChart) {
        _this.worksChart.resize();
      }

      // 专题 - chart
      if (_this.topicsChart) {
        _this.topicsChart.resize();
      }

      // 左邻右舍 - chart
      if (_this.linksChart) {
        _this.linksChart.resize();
      }

    }, 100);
   
    _this.initChart();
    _this.initResizeEvent();

    _this.getArticleStats();
    _this.getWorksStats();
    _this.getTopicsStats();
    _this.getLinksStats();
    

    _this.getArticleList();
    _this.getWorksList();
    _this.getSearchKeywordsList();
    _this.getTagList();
  }
};
</script>
<style lang="scss">
.height-40{
  height: 40px;
  .el-icon-caret-bottom {
    color: #19be6b;
    &.top {
      transform: rotate(180deg);
      color: #ed4014;
    }
  }
}
.home-article-text{
  font-size: 14px;
}
.home-box-card {
  border: 0;
  margin-bottom: 24px;
  .el-card__header {
      padding-left: 12px;
      padding-right: 12px;
  }
  .el-card__body{
    padding: 12px;
  }
  .num {
    font-size: 30px;
    color: #515a6e;
  }
  .el-divider--horizontal{
     margin: 8px 0;
  }
  .bot {
    font-size: 14px;
  }
  .traffic-title{
    margin: 0;
    margin-bottom: 10px;
  }
  .traffic-li{
    height: 24px;
    line-height: 24px;
    font-size: 14px;
    margin-top: 10px;
  }
  .traffic-num{
    width: 24px;
    height: 24px;
    line-height: 24px;
    margin-right: 8px;
    &.hot{
      background-color: rgba($color: #209e91, $alpha: 0.8) ;
      color: #FFFFFF;
    }
  }
}
</style>
