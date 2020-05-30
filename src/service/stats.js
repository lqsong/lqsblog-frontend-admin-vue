import request from '@/service/lib/request';

/**
 * 统计 - 随笔 - 日新增，总量，日同比，周同比 
 * @author LiQingSong
 */
export function StatsArticleDailyNew() {
    return request({
      url: '/stats/articles/dailynew',
      method: 'get'
    });
}

/**
 * 统计 - 作品 - 周新增，总量，chart数据-get
 * @author LiQingSong
 */
export function StatsWorksWeekNew() {
    return request({
      url: '/stats/works/weeknew',
      method: 'get'
    });
}

/**
 * 统计 - 专题 - 月新增，总量，chart数据-get
 * @author LiQingSong
 */
export function StatsTopicsMonthNew() {
    return request({
      url: '/stats/topics/monthnew',
      method: 'get'
    });
}

/**
 * 统计 - 左邻右舍 - 年新增，总量，chart数据-get
 * @author LiQingSong
 */
export function StatsLinksAnnualNew() {
    return request({
      url: '/stats/links/annualnew',
      method: 'get'
    });
}
