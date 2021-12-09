import request from '@/utils/request';
import { TableListQueryParams } from './data.d';

export async function dailynewArticles(): Promise<any> {
  return request({
      url: '/stats/articles/dailynew',
      method: 'get'
  });
}

export async function weeknewWorks(): Promise<any> {
  return request({
      url: '/stats/works/weeknew',
      method: 'get'
  });
}

export async function monthnewTopics(): Promise<any> {
  return request({
      url: '/stats/topics/monthnew',
      method: 'get'
  });
}

export async function annualnewLinks(): Promise<any> {
  return request({
      url: '/stats/links/annualnew',
      method: 'get'
  });
}

export async function hotSearchQueryList(params?: TableListQueryParams): Promise<any> {
  return request({
    url: '/searchs/keywords',
    method: 'get',
    params,
  });
}

export async function hotTagsQueryList(params?: TableListQueryParams): Promise<any> {
  return request({
    url: '/tags',
    method: 'get',
    params,
  });
}

export async function articleHitQueryList(params?: TableListQueryParams): Promise<any> {
  return request({
    url: '/articles',
    method: 'get',
    params,
  });
}

export async function worksHitQueryList(params?: TableListQueryParams): Promise<any> {
  return request({
    url: '/works',
    method: 'get',
    params,
  });
}