// @ts-ignore
/* eslint-disable */
import { request } from './base';

/** 获取所有图文动态 GET /updates/all */
export async function allEssayUsingGet(options?: { [key: string]: any }) {
  return request<API.CommonResultListUpdate_>('/updates/all', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 删除指定图文动态 DELETE /updates/delete */
export async function deleteEssayByIdUsingDelete(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deleteEssayByIdUsingDELETEParams,
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

/** 修改图文动态 PUT /updates/essay */
export async function updateUsingPut(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.updateUsingPUTParams,
  body: string[],
  options?: { [key: string]: any },
) {
  return request<API.CommonResultString_>('/updates/essay', {
    method: 'PUT',
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

/** 发布图文动态 POST /updates/essay */
export async function publishUsingPost(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.publishUsingPOSTParams,
  body: string[],
  options?: { [key: string]: any },
) {
  return request<API.CommonResultString_>('/updates/essay', {
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

/** 获取指定图片，暂时也可以用来获取视频资源 GET /updates/getImage */
export async function getImagesUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getImagesUsingGETParams,
  options?: { [key: string]: any },
) {
  return request<string>('/updates/getImage', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 获取首页视频动态的简略推送，返回拼接好的vo GET /updates/homePage */
export async function getHomePageUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getHomePageUsingGETParams,
  options?: { [key: string]: any },
) {
  return request<API.CommonResultListVo2>('/updates/homePage', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 获取单条图文动态 GET /updates/info/${param0} */
export async function getEssayByIdUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getEssayByIdUsingGETParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.CommonResultUpdate_>(`/updates/info/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 分页获取图文动态 GET /updates/inPage */
export async function getInPageUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getInPageUsingGETParams,
  options?: { [key: string]: any },
) {
  return request<API.CommonResultListUpdate_>('/updates/inPage', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 获取所有视频分区 GET /updates/partition */
export async function allPartitionsUsingGet(options?: { [key: string]: any }) {
  return request<API.CommonResultListPartition_>('/updates/partition', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 发布视频动态 POST /updates/video */
export async function publishVideoUsingPost(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.publishVideoUsingPOSTParams,
  body: string,
  options?: { [key: string]: any },
) {
  const formData = new FormData();

  Object.keys(body).forEach((ele) => {
    const item = (body as any)[ele];

    if (item !== undefined && item !== null) {
      if (typeof item === 'object' && !(item instanceof File)) {
        if (item instanceof Array) {
          item.forEach((f) => formData.append(ele, f || ''));
        } else {
          formData.append(ele, JSON.stringify(item));
        }
      } else {
        formData.append(ele, item);
      }
    }
  });

  return request<API.CommonResultString_>('/updates/video', {
    method: 'POST',
    params: {
      ...params,
    },
    data: formData,
    requestType: 'form',
    ...(options || {}),
  });
}

/** 删除指定视频动态 DELETE /updates/video */
export async function deleteVideoByIdUsingDelete(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deleteVideoByIdUsingDELETEParams,
  options?: { [key: string]: any },
) {
  return request<API.CommonResultString_>('/updates/video', {
    method: 'DELETE',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}
