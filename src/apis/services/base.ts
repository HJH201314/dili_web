/**
 * 本文件为axios的浅层封装
 * 关于接口调用：
 * 1. 为解决不同模块的接口调用问题，由各模块的base中的request再做一层处理，并调用此处的request
 * 2. 接口控制代码（如LoginController）在dili-manage中使用@umijs/max的openAPI插件生成标准格式的代码，并分模块复制到此项目
 * 3. 每个模块的base.ts需手写，指定正确的SERVICE_PATH；其余文件保持生成的默认值即可
 *
 * @author HJH201314
 * */

import axios from "axios";
import type { AxiosResponse, AxiosRequestConfig } from "axios";

const axiosInstance = axios.create({
  baseURL: "/api",
});

/**
 * 为解决不同模块的接口调用问题，由各模块的base中的request做第一层处理，调用此处的request
 * @param path 请求相对路径
 * @param args 请求参数
 * @return Promise<AxiosResponse<TRes>> axios的response
 * */
export const request = <TRes>(path: string, args: AxiosRequestConfig) => {
  return axiosInstance.request<any, AxiosResponse<TRes>>({
    headers: {
      "token": localStorage.getItem("token") ?? "",
    },
    url: path,
    ...args,
  });
}