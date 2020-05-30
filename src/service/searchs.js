import request from '@/service/lib/request';

/**
 * 搜索表 - 热门关键词 - 有分页
 * @param {Object} params 请求参数
 * @author LiQingSong
 */
export function SearchsKeywords(params) {
    return request({
      url: '/searchs/keywords',
      method: 'get',
      params
    });
}