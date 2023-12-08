// @ts-ignore
/* eslint-disable */
import { request } from './base';

/** 获取最从cntStart到cntEnd条历史记录 GET /his */
export async function getRecentHistoryUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getRecentHistoryUsingGETParams,
  body: API.HisQueryDto,
  options?: { [key: string]: any },
) {
  return request<API.CommonResultListHistory_>('/his', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    params: {
      ...params,
    },
    data: body,
    ...(options || {}),
  });
}

/** updateHistory PUT /his */
export async function updateHistoryUsingPut(
  body: API.HistoryDto,
  options?: { [key: string]: any },
) {
  return request<API.CommonResultString_>('/his', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 添加历史记录 POST /his */
export async function addHistoryUsingPost(body: API.HistoryDto, options?: { [key: string]: any }) {
  return request<API.CommonResultString_>('/his', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 获取最近20条历史记录 GET /his/list */
export async function getRecentHistoryListUsingGet(
  body: API.HisQueryDto,
  options?: { [key: string]: any },
) {
  return request<API.CommonResultListVo_>('/his/list', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
