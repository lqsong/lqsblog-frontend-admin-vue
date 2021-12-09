import request from '@/utils/request';
import { TableListQueryParams } from './data.d';

/**
 * 专题管理 - 列表 - 有分页
 * @param params 请求参数
 * @returns 
 * @author LiQingSong
 */
export async function queryList(params?: TableListQueryParams): Promise<any> {
  return request({
    url: '/topics',
    method: 'get',
    params,
  });
}

/**
 * 专题管理 - 删除
 * @param id ID
 * @returns 
 * @author LiQingSong
 */
export async function removeData(id: number): Promise<any> {
  return request({
    url: `/topics/${id}`, 
    method: 'delete',
  });
}

