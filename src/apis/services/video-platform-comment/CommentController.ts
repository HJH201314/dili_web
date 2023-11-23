// @ts-ignore
/* eslint-disable */
import { request } from './base';

/** 添加评论 POST /comment/add */
export async function addCommentUsingPOST(body: API.Comment, options?: { [key: string]: any }) {
  return request<API.CommonResultString_>('/comment/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 根据foreignId获取评论总数 GET /comment/countRootComment/${param0} */
export async function countCommentsByForeignIdUsingGET(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.countCommentsByForeignIdUsingGETParams,
  options?: { [key: string]: any },
) {
  const { foreignId: param0, ...queryParams } = params;
  return request<API.CommonResultLong_>(`/comment/countRootComment/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 根据foreignId获取评论总数 GET /comment/countSubComment/${param0} */
export async function countSubCommentByPidUsingGET(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.countSubCommentByPidUsingGETParams,
  options?: { [key: string]: any },
) {
  const { pid: param0, ...queryParams } = params;
  return request<API.CommonResultLong_>(`/comment/countSubComment/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 删除子评论 DELETE /comment/deleteChild/${param1}/${param0} */
export async function deleteChildCommentUsingDELETE(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deleteChildCommentUsingDELETEParams,
  options?: { [key: string]: any },
) {
  const { cid: param0, pid: param1, ...queryParams } = params;
  return request<API.CommonResultString_>(`/comment/deleteChild/${param1}/${param0}`, {
    method: 'DELETE',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 删除根评论 DELETE /comment/deleteRoot/${param0} */
export async function deleteRootCommentUsingDELETE(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deleteRootCommentUsingDELETEParams,
  options?: { [key: string]: any },
) {
  const { pid: param0, ...queryParams } = params;
  return request<API.CommonResultString_>(`/comment/deleteRoot/${param0}`, {
    method: 'DELETE',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 点赞子评论 POST /comment/likeChildren/${param1}/${param2}/${param0} */
export async function likeChildrenCommentUsingPOST(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.likeChildrenCommentUsingPOSTParams,
  options?: { [key: string]: any },
) {
  const { cid: param0, flag: param1, pid: param2, ...queryParams } = params;
  return request<API.CommonResultString_>(`/comment/likeChildren/${param1}/${param2}/${param0}`, {
    method: 'POST',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 点赞根评论 POST /comment/likeRoot/${param0}/${param1} */
export async function likeRootCommentUsingPOST(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.likeRootCommentUsingPOSTParams,
  options?: { [key: string]: any },
) {
  const { flag: param0, pid: param1, ...queryParams } = params;
  return request<API.CommonResultString_>(`/comment/likeRoot/${param0}/${param1}`, {
    method: 'POST',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 分页获取对应根评论下的子评论 GET /comment/listChildrenComment/${param1}/${param0}/${param2} */
export async function listChildrenCommentByPagesUsingGET(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.listChildrenCommentByPagesUsingGETParams,
  options?: { [key: string]: any },
) {
  const { page: param0, pid: param1, size: param2, ...queryParams } = params;
  return request<API.CommonResultListResultComment_>(
    `/comment/listChildrenComment/${param1}/${param0}/${param2}`,
    {
      method: 'GET',
      params: {
        ...queryParams,
      },
      ...(options || {}),
    },
  );
}

/** 分页获取评论 GET /comment/listRootComment/${param0}/${param1}/${param2} */
export async function listCommentByPagesUsingGET(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.listCommentByPagesUsingGETParams,
  options?: { [key: string]: any },
) {
  const { foreignId: param0, page: param1, size: param2, ...queryParams } = params;
  return request<API.CommonResultListResultComment_>(
    `/comment/listRootComment/${param0}/${param1}/${param2}`,
    {
      method: 'GET',
      params: {
        ...queryParams,
      },
      ...(options || {}),
    },
  );
}

/** 回复评论 POST /comment/reply/${param0} */
export async function replyCommentUsingPOST(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.replyCommentUsingPOSTParams,
  body: API.Comment,
  options?: { [key: string]: any },
) {
  const { pid: param0, ...queryParams } = params;
  return request<API.CommonResultString_>(`/comment/reply/${param0}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  });
}
