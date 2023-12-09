/**
 *  @description 缓存用户公开信息，减少多次请求消耗
 *  提供useUserInfo响应式获取，getUserInfo异步获取
 *
 *  */

import services from '@/apis/services';
import { ref, toValue, watch, watchEffect } from "vue";
import type { MaybeRefOrGetter } from "vue";

/**
 * 获取用户公开信息
 * @param uid 用户UID
 */
export const getUserInfo = async (uid: number): Promise<API.UserInfo> => new Promise((resolve, reject) => {
  const userInfo = sessionStorage.getItem(`user-info-${uid}`);
  if (userInfo) {
    resolve(JSON.parse(userInfo) as API.UserInfo);
  } else {
    services.adminService.userInfoController.getUserInfoByUidUsingGet({ uid }).then(res => {
      if (res.data.code === 200) {
        sessionStorage.setItem(`user-info-${uid}`, JSON.stringify(res.data.data));
        resolve(res.data.data ?? {});
      }
    }).finally(() =>resolve({} as API.UserInfo));
  }
});

/**
 * 响应式获取用户公开信息
 * @param uid 用户UID
 * @param callback 请求成功回调函数
 */
export default function useUserInfo(uid: MaybeRefOrGetter<number | undefined>, callback?: (userInfo: API.UserInfo) => void) {
  // 获取状态，none-无操作、loading-请求中、success-请求成功、failed-请求失败
  const status = ref<'success' | 'failed' | 'loading' | 'none'>('none');
  // 用户公开信息
  const userInfo = ref<API.UserInfo>();

  watch(() => toValue(uid), async (val) => {
    // 判断uid是否有值
    if (!val) {
      status.value = 'none';
      return;
    }
    try {
      // 发起请求
      status.value = 'loading'
      userInfo.value = await getUserInfo(val);
      // 请求成功
      status.value = 'success';
      callback?.(userInfo.value);
    } catch (e) {
      status.value = 'failed';
    }
  }, { immediate: true });

  return {
    status, userInfo
  };
}