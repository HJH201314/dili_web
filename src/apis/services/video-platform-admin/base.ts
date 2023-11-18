import type { AxiosRequestConfig } from "axios";
import { request as baseRequest } from "@/apis/services/base";

const SERVICE_PATH = "/admin";

export const request = <TRes>(path: string, args: AxiosRequestConfig) => {
  return baseRequest<TRes>(`${SERVICE_PATH}/${path}`, args);
}