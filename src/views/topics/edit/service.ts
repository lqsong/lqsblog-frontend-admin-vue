import request from '@/utils/request';
import { DataItem } from './data.d';

/**
 * 专题管理 - 编辑
 * @param id ID
 * @param data 请求参数
 * @returns 
 * @author LiQingSong
 */
export async function topicEdit(id:number, data?: DataItem): Promise<any> {
  return request({
    url: '/topics/' + id,
    method: 'put',
    data
  });
}


/**
 * 专题管理 - 获取指定专题
 * @param id ID
 * @returns 
 * @author LiQingSong
 */
export async function topicDetail(id: number): Promise<any> {
  return request({
    url: '/topics/' + id,
    method: 'get'
  });
}


