import request from '@/service/lib/request';

/**
 * 作品管理 - 列表 - 有分页
 * @param {Object} params 请求参数
 * @author LiQingSong
 */
export function WorksList(params) {
    return request({
      url: '/works',
      method: 'get',
      params
    });
}

/**
 * 作品管理 - 新增
 * @param {Object} data 请求参数
 * @author LiQingSong
 */
export function WorksAdd(data) {
    return request({
        url: '/works',
        method: 'post',
        data
    });
}
  
/**
 * 作品管理 - 编辑
 * @param {Number} id ID
 * @param {Object} data 请求参数
 * @author LiQingSong
 */
export function WorksEdit(id, data) {
    return request({
        url: '/works/' + id,
        method: 'put',
        data
    });
}
  
/**
 * 作品管理 - 删除
 * @param {Number} id ID
 * @author LiQingSong
 */
export function WorksDel(id) {
    return request({
        url: '/works/' + id,
        method: 'delete'
    });
}

/**
 * 作品管理 - 获取指定作品
 * @param {Number} id ID
 * @author LiQingSong
 */
export function WorksDetail(id) {
  return request({
    url: '/works/' + id,
    method: 'get'
  });
}