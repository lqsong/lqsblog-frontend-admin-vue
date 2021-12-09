import request from '@/utils/request';
import { DataItem } from './data.d';

/**
 * 关于我 - 详情
 * @author LiQingSong
 */
export async function aboutDetail(): Promise<any> {
  return request({
    url: '/about',
    method: 'get'
  });
}

/**
* 关于我 - 新增/编辑
* @param  data 请求参数
* @author LiQingSong
*/
export async function aboutAdd(data?: DataItem): Promise<any> {
  return request({
    url: '/about',
    method: 'post',
    data
  });
}


