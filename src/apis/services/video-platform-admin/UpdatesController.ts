// @ts-ignore
/* eslint-disable */
import { request } from './base';

/** 获取所有动态 GET /updates/all */
export async function allUpdatesUsingGET(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.allUpdatesUsingGETParams,
  options?: { [key: string]: any },
) {
  return request<API.CommonResultListUpdate_>('/updates/all', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 获取指定分区的动态 GET /updates/byPartition */
export async function getUpdatesByTypeUsingGET(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getUpdatesByTypeUsingGETParams,
  options?: { [key: string]: any },
) {
  return request<API.CommonResultListUpdate_>('/updates/byPartition', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 删除指定动态 DELETE /updates/delete */
export async function deleteByIdUsingDELETE(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deleteByIdUsingDELETEParams,
  options?: { [key: string]: any },
) {
  return request<API.CommonResultString_>('/updates/delete', {
    method: 'DELETE',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 获取指定图片 GET /updates/getImage */
export async function getImagesUsingGET(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getImagesUsingGETParams,
  options?: { [key: string]: any },
) {
  return request<API.CommonResultArrayByte_>('/updates/getImage', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 发布动态 POST /updates/publish */
export async function publishUsingPOST(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.publishUsingPOSTParams,
  body: string[],
  options?: { [key: string]: any },
) {
  return request<API.CommonResultString_>('/updates/publish', {
    method: 'POST',
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

/** 修改动态 POST /updates/update */
export async function updateUsingPOST(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.updateUsingPOSTParams,
  body: string[],
  options?: { [key: string]: any },
) {
  return request<API.CommonResultString_>('/updates/update', {
    method: 'POST',
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
