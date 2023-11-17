import axios from 'axios';
import type { AxiosRequestConfig } from 'axios';

const SERVER_API_URL = '/api';

/* 创建axios实例 */
const axiosInstance = axios.create({
  baseURL: SERVER_API_URL,
  timeout: 10000,
  withCredentials: false,
});

/* 创建请求 */
export const createRequest = <TReq, TResp = any>(
    _: string,
    requestConfigCreator: (args: TReq) => AxiosRequestConfig,
) => {
  return (args?: TReq) => {
    if (!args) {
      return axiosInstance.request<TResp>(requestConfigCreator({} as TReq));
    }
    return axiosInstance.request<TResp>(requestConfigCreator(args));
  };
};