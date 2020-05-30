import request from '@/service/lib/request';

/**
 * 专题管理 - 列表 - 有分页
 * @param {Object} params 请求参数
 * @author LiQingSong
 */
export function TopicsList(params) {
    return request({
      url: '/topics',
      method: 'get',
      params
    });
}

/**
 * 专题管理 - 新增
 * @param {Object} data 请求参数
 * @author LiQingSong
 */
export function TopicsAdd(data) {
    return request({
        url: '/topics',
        method: 'post',
        data
    });
}
  
/**
 * 专题管理 - 编辑
 * @param {Number} id ID
 * @param {Object} data 请求参数
 * @author LiQingSong
 */
export function TopicsEdit(id, data) {
    return request({
        url: '/topics/' + id,
        method: 'put',
        data
    });
}
  
/**
 * 专题管理 - 删除
 * @param {Number} id ID
 * @author LiQingSong
 */
export function TopicsDel(id) {
    return request({
        url: '/topics/' + id,
        method: 'delete'
    });
}

/**
 * 专题管理 - 获取指定专题
 * @param {Number} id ID
 * @author LiQingSong
 */
export function TopicsDetail(id) {
  return request({
    url: '/topics/' + id,
    method: 'get'
  });
}