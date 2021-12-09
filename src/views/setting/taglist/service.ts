import request from '@/utils/request';
import { TableListQueryParams } from './data.d';
import { DataItem } from "./components/FormDialog/data.d";

/**
 * 标签管理 - 列表 - 有分页
 * @param params 请求参数
 * @returns 
 * @author LiQingSong
 */
export async function queryList(params?: TableListQueryParams): Promise<any> {
  return request({
    url: '/tags',
    method: 'get',
    params,
  });
}

/**
 * 标签管理 - 删除
 * @param id ID
 * @returns 
 * @author LiQingSong
 */
export async function removeData(id: number): Promise<any> {
  return request({
    url: `/tags/${id}`, 
    method: 'delete',
  });
}



/**
 * 标签管理 - 新增
 * @param {Object} data 请求参数
 * @author LiQingSong
 */
 export async function tagAdd(data: DataItem): Promise<any> {
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
export async function tagEdit(id: number, data: DataItem): Promise<any> {
  return request({
    url: `/tags/${id}`, 
    method: 'put',
    data
  });
}
