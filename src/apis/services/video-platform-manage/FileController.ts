// @ts-ignore
/* eslint-disable */
import { request } from './base';

/** 文件上传，上传时固定key=file，返回值为文件存储的路径 POST /file/upload */
export async function uploadUsingPOST(body: string, options?: { [key: string]: any }) {
  const formData = new FormData();

  Object.keys(body).forEach((ele) => {
    const item = (body as any)[ele];

    if (item !== undefined && item !== null) {
      formData.append(
        ele,
        typeof item === 'object' && !(item instanceof File) ? JSON.stringify(item) : item,
      );
    }
  });

  return request<API.CommonResultString_>('/file/upload', {
    method: 'POST',
    data: formData,
    requestType: 'form',
    ...(options || {}),
  });
}
