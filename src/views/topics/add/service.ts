import request from '@/utils/request';
import { DataItem } from './data.d';

/**
 * 专题管理 - 新增
 * @param data  请求参数
 * @returns 
 * @author LiQingSong
 */
export async function topicAdd(data?: DataItem): Promise<any> {
  return request({
    url: '/topics',
    method: 'post',
    data,
  });
}


