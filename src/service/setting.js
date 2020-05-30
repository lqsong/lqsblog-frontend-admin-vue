import request from '@/service/lib/request';

/**
 * 关于我 - 详情
 * @author LiQingSong
 */
export function AboutDetail() {
  return request({
    url: '/about',
    method: 'get'
  });
}

/**
* 关于我 - 新增
* @param {Object} data 请求参数
* @author LiQingSong
*/
export function AboutAdd(data) {
  return request({
    url: '/about',
    method: 'post',
    data
  });
}

/**
 * 标签管理 - 列表 - 有分页
 * @param {Object} params 请求参数
 * @author LiQingSong
 */
export function TagList(params) {
    return request({
      url: '/tags',
      method: 'get',
      params
    });
}

/**
 * 标签管理 - 新增
 * @param {Object} data 请求参数
 * @author LiQingSong
 */
export function TagAdd(data) {
    return request({
      url: '/tags',
      method: 'post',
      data
    });
}

/**
 * 标签管理 - 编辑
 * @param {Number} id ID
 * @param {Object} data 请求参数
 * @author LiQingSong
 */
export function TagEdit(id, data) {
    return request({
      url: '/tags/' + id,
      method: 'put',
      data
    });
}

/**
 * 标签管理 - 删除
 * @param {Number} id ID
 * @author LiQingSong
 */
export function TagDel(id) {
    return request({
      url: '/tags/' + id,
      method: 'delete'
    });
}

/**
 * 账号 - 列表 - 有分页
 * @param {Object} params 请求参数
 * @author LiQingSong
 */
export function AccountList(params) {
  return request({
    url: '/accounts',
    method: 'get',
    params
  });
}

/**
* 账号 - 新增
* @param {Object} data 请求参数
* @author LiQingSong
*/
export function AccountAdd(data) {
  return request({
    url: '/accounts',
    method: 'post',
    data
  });
}

/**
* 账号 - 编辑
* @param {Number} id ID
* @param {Object} data 请求参数
* @author LiQingSong
*/
export function AccountEdit(id, data) {
  return request({
    url: '/accounts/' + id,
    method: 'put',
    data
  });
}

/**
* 账号 - 删除
* @param {Number} id ID
* @author LiQingSong
*/
export function AccountDel(id) {
  return request({
    url: '/accounts/' + id,
    method: 'delete'
  });
}

/**
* 账号 - 详情
* @param {Number} id ID
* @author LiQingSong
*/
export function AccountDetail(id) {
  return request({
    url: '/accounts/' + id,
    method: 'get'
  });
}


/**
 * 角色 - 列表
 * @author LiQingSong
 */
export function RoleList() {
  return request({
    url: '/roles',
    method: 'get'
  });
}

/**
 * 角色 - 新增
 * @param {Object} data 请求参数
 * @author LiQingSong
 */
export function RoleAdd(data) {
  return request({
    url: '/roles',
    method: 'post',
    data
  });
}

/**
 * 角色 - 编辑
 * @param {Number} id ID
 * @param {Object} data 请求参数
 * @author LiQingSong
 */
export function RoleEdit(id, data) {
  return request({
    url: '/roles/' + id,
    method: 'put',
    data
  });
}

/**
 * 角色 - 删除
 * @param {Number} id ID
 * @author LiQingSong
 */
export function RoleDel(id) {
  return request({
    url: '/roles/' + id,
    method: 'delete'
  });
}

/**
 * 菜单 - 列表
 * @param {Number} pid 父级id
 * @author LiQingSong
 */
export function MenuList(pid) {
  return request({
    url: '/menus',
    method: 'get',
    params: {
      pid
    }
  });
}

/**
 * 菜单 - 新增
 * @param {Object} data 请求参数
 * @author LiQingSong
 */
export function MenuAdd(data) {
  return request({
    url: '/menus',
    method: 'post',
    data
  });
}

/**
 * 菜单 - 编辑
 * @param {Number} id ID
 * @param {Object} data 请求参数
 * @author LiQingSong
 */
export function MenuEdit(id, data) {
  return request({
    url: '/menus/' + id,
    method: 'put',
    data
  });
}

/**
 * 菜单 - 删除
 * @param {Number} id ID
 * @author LiQingSong
 */
export function MenuDel(id) {
  return request({
    url: '/menus/' + id,
    method: 'delete'
  });
}


/**
 * API - 列表
 * @param {Number} pid 父级id
 * @author LiQingSong
 */
export function ApiList(pid) {
  return request({
    url: '/apis',
    method: 'get',
    params: {
      pid
    }
  });
}

/**
 * API - 新增
 * @param {Object} data 请求参数
 * @author LiQingSong
 */
export function ApiAdd(data) {
  return request({
    url: '/apis',
    method: 'post',
    data
  });
}

/**
 * API - 编辑
 * @param {Number} id ID
 * @param {Object} data 请求参数
 * @author LiQingSong
 */
export function ApiEdit(id, data) {
  return request({
    url: '/apis/' + id,
    method: 'put',
    data
  });
}

/**
 * API - 删除
 * @param {Number} id ID
 * @author LiQingSong
 */
export function ApiDel(id) {
  return request({
    url: '/apis/' + id,
    method: 'delete'
  });
}

/**
 * 站点配置 - 详情
 * @author LiQingSong
 */
export function ConfigDetail() {
  return request({
    url: '/config',
    method: 'get'
  });
}

/**
* 站点配置 - 新增
* @param {Object} data 请求参数
* @author LiQingSong
*/
export function ConfigAdd(data) {
  return request({
    url: '/config',
    method: 'post',
    data
  });
}