// @ts-ignore
/* eslint-disable */
import { request } from './base';

/** getUserInfoByUid GET /user-info/get-by-uid */
export async function getUserInfoByUidUsingGET(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getUserInfoByUidUsingGETParams,
  options?: { [key: string]: any },
) {
  return request<API.CommonResultUserInfo_>('/user-info/get-by-uid', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}
