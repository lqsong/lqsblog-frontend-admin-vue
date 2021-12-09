import request from '@/utils/request';
import { DataItem } from './data.d';

/**
 * 站点配置 - 详情
 * @author LiQingSong
 */
export async function configDetail(): Promise<any> {
  return request({
    url: '/config',
    method: 'get'
  });
}

/**
* 站点配置 - 新增/编辑
* @param  data 请求参数
* @author LiQingSong
*/
export async function configAdd(data?: DataItem): Promise<any> {
  return request({
    url: '/config',
    method: 'post',
    data
  });
}



