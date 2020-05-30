import request from '@/service/lib/request';

/**
 * 随笔管理 - 列表 - 有分页
 * @param {Object} params 请求参数
 * @author LiQingSong
 */
export function ArticleList(params) {
    return request({
      url: '/articles',
      method: 'get',
      params
    });
}

/**
 * 随笔管理 - 新增
 * @param {Object} data 请求参数
 * @author LiQingSong
 */
export function ArticleAdd(data) {
  return request({
    url: '/articles',
    method: 'post',
    data
  });
}

/**
 * 随笔管理 - 编辑
 * @param {Number} id ID
 * @param {Object} data 请求参数
 * @author LiQingSong
 */
export function ArticleEdit(id, data) {
  return request({
    url: '/articles/' + id,
    method: 'put',
    data
  });
}

/**
 * 随笔管理 - 删除
 * @param {Number} id ID
 * @author LiQingSong
 */
export function ArticleDel(id) {
  return request({
    url: '/articles/' + id,
    method: 'delete'
  });
}

/**
 * 随笔管理 - 获取指定随笔
 * @param {Number} id ID
 * @author LiQingSong
 */
export function ArticleDetail(id) {
  return request({
    url: '/articles/' + id,
    method: 'get'
  });
}

/**
 * 随笔管理 - 分类 - 列表
 * @param {Number} pid 父级id
 * @author LiQingSong
 */
export function ArticleCategoryList(pid) {
  return request({
    url: '/article/categorys',
    method: 'get',
    params: {
      pid
    }
  });
}

/**
 * 随笔管理 - 分类 - 新增
 * @param {Object} data 请求参数
 * @author LiQingSong
 */
export function ArticleCategoryAdd(data) {
  return request({
    url: '/article/categorys',
    method: 'post',
    data
  });
}

/**
 * 随笔管理 - 分类 - 编辑
 * @param {Number} id ID
 * @param {Object} data 请求参数
 * @author LiQingSong
 */
export function ArticleCategoryEdit(id, data) {
  return request({
    url: '/article/categorys/' + id,
    method: 'put',
    data
  });
}

/**
 * 随笔管理 - 分类 - 删除
 * @param {Number} id ID
 * @author LiQingSong
 */
export function ArticleCategoryDel(id) {
  return request({
    url: '/article/categorys/' + id,
    method: 'delete'
  });
}