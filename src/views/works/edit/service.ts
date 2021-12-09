import request from '@/utils/request';
import { DataItem } from './data.d';

/**
 * 作品管理 - 编辑
 * @param id ID
 * @param data 请求参数
 * @returns 
 * @author LiQingSong
 */
export async function workEdit(id:number, data?: DataItem): Promise<any> {
  return request({
    url: '/works/' + id,
    method: 'put',
    data
  });
}


/**
 * 作品管理 - 获取指定
 * @param id ID
 * @returns 
 * @author LiQingSong
 */
export async function workDetail(id: number): Promise<any> {
  return request({
    url: '/works/' + id,
    method: 'get'
  });
}


