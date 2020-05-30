import request from '@/service/lib/request';

/**
 * 左邻右舍 - 列表 - 有分页
 * @param {Object} params 请求参数
 * @author LiQingSong
 */
export function LinksList(params) {
    return request({
      url: '/links',
      method: 'get',
      params
    });
}

/**
 * 左邻右舍 - 新增
 * @param {Object} data 请求参数
 * @author LiQingSong
 */
export function LinksAdd(data) {
  return request({
    url: '/links',
    method: 'post',
    data
  });
}

/**
 * 左邻右舍 - 编辑
 * @param {Number} id ID
 * @param {Object} data 请求参数
 * @author LiQingSong
 */
export function LinksEdit(id, data) {
  return request({
    url: '/links/' + id,
    method: 'put',
    data
  });
}

/**
 * 左邻右舍 - 删除
 * @param {Number} id ID
 * @author LiQingSong
 */
export function LinksDel(id) {
  return request({
    url: '/links/' + id,
    method: 'delete'
  });
}

/**
 * 左邻右舍 - 获取指定详情
 * @param {Number} id ID
 * @author LiQingSong
 */
export function LinksDetail(id) {
  return request({
    url: '/links/' + id,
    method: 'get'
  });
}

/**
 * 左邻右舍 - 分类 - 列表
 * @author LiQingSong
 */
export function LinksCategoryList() {
  return request({
    url: '/link/categorys',
    method: 'get'
  });
}

/**
 * 左邻右舍 - 分类 - 新增
 * @param {Object} data 请求参数
 * @author LiQingSong
 */
export function LinksCategoryAdd(data) {
  return request({
    url: '/link/categorys',
    method: 'post',
    data
  });
}

/**
 * 左邻右舍 - 分类 - 编辑
 * @param {Number} id ID
 * @param {Object} data 请求参数
 * @author LiQingSong
 */
export function LinksCategoryEdit(id, data) {
  return request({
    url: '/link/categorys/' + id,
    method: 'put',
    data
  });
}

/**
 * 左邻右舍 - 分类 - 删除
 * @param {Number} id ID
 * @author LiQingSong
 */
export function LinksCategoryDel(id) {
  return request({
    url: '/link/categorys/' + id,
    method: 'delete'
  });
}