import request from '@/utils/request';
import { DataItem } from './data.d';

/**
 * 作品管理 - 新增
 * @param data  请求参数
 * @returns 
 * @author LiQingSong
 */
export async function workAdd(data?: DataItem): Promise<any> {
  return request({
    url: '/works',
    method: 'post',
    data,
  });
}


