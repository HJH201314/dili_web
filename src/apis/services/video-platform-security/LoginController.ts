// @ts-ignore
/* eslint-disable */
import { request } from './base';

/** login POST /scy/login */
export async function loginUsingPOST(body: API.LoginDto, options?: { [key: string]: any }) {
  return request<API.CommonResultString_>('/scy/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** logout GET /scy/logout */
export async function logoutUsingGET(options?: { [key: string]: any }) {
  return request<API.CommonResultString_>('/scy/logout', {
    method: 'GET',
    ...(options || {}),
  });
}

/** p1 GET /scy/p1 */
export async function p1UsingGET(options?: { [key: string]: any }) {
  return request<API.CommonResultString_>('/scy/p1', {
    method: 'GET',
    ...(options || {}),
  });
}

/** p6 GET /scy/p6 */
export async function p6UsingGET(options?: { [key: string]: any }) {
  return request<API.CommonResultString_>('/scy/p6', {
    method: 'GET',
    ...(options || {}),
  });
}

/** getPin POST /scy/pin */
export async function getPinUsingPOST(body: API.AuthDto, options?: { [key: string]: any }) {
  return request<API.CommonResultString_>('/scy/pin', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** register POST /scy/register */
export async function registerUsingPOST(body: API.RegisterDto, options?: { [key: string]: any }) {
  return request<API.CommonResultString_>('/scy/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
