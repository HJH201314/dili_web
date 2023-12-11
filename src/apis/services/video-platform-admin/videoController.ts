// @ts-ignore
/* eslint-disable */
import { request } from './base';

/** 获取视频详情（点开视频详情页），传入路径参数id GET /video/detail/${param0} */
export async function getVideoDetailUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getVideoDetailUsingGETParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.CommonResultVo_>(`/video/detail/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 获取视频预览信息，传入路径参数id GET /video/info/${param0} */
export async function getVideoInfoUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getVideoInfoUsingGETParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.CommonResultVo2>(`/video/info/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 根据传参搜索视频，除key外其他值均有默认值，可不传 GET /video/search */
export async function searchUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.searchUsingGETParams,
  options?: { [key: string]: any },
) {
  return request<API.CommonResultListResult2>('/video/search', {
    method: 'GET',
    params: {
      // page has a default value: 1
      page: '1',

      // size has a default value: 30
      size: '30',

      ...params,
    },
    ...(options || {}),
  });
}

/** 根据传参搜索视频，除key外其他值均有默认值，可不传 GET /video/search/user */
export async function searchUserUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.searchUserUsingGETParams,
  options?: { [key: string]: any },
) {
  return request<API.CommonResultListResult_>('/video/search/user', {
    method: 'GET',
    params: {
      // page has a default value: 1
      page: '1',

      // size has a default value: 30
      size: '30',

      ...params,
    },
    ...(options || {}),
  });
}

/** 根据传参搜索视频，除key外其他值均有默认值，可不传 GET /video/search/video */
export async function searchVideoUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.searchVideoUsingGETParams,
  options?: { [key: string]: any },
) {
  return request<API.CommonResultListResultVo_>('/video/search/video', {
    method: 'GET',
    params: {
      // page has a default value: 1
      page: '1',

      // size has a default value: 30
      size: '30',

      ...params,
    },
    ...(options || {}),
  });
}

/** 根据输入框输入的词，进行补全推提示 GET /video/suggest */
export async function suggestUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.suggestUsingGETParams,
  options?: { [key: string]: any },
) {
  return request<string[]>('/video/suggest', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}
