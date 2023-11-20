/**
 *  @description 缓存用户公开信息，减少多次请求消耗
 *
 *  */

import adminApi from '@/apis/services/video-platform-admin';

export const getUserInfo = async (uid: number): Promise<API.UserInfo> => new Promise((resolve, reject) => {
  const userInfo = sessionStorage.getItem(`user-info-${uid}`);
  if (userInfo) {
    resolve(JSON.parse(userInfo) as API.UserInfo);
  } else {
    adminApi.UserInfoController.getUserInfoByUidUsingGET({ uid }).then(res => {
      if (res.data.code === 200) {
        sessionStorage.setItem(`user-info-${uid}`, JSON.stringify(res.data.data));
        resolve(res.data.data);
      }
    }).finally(() =>resolve({} as API.UserInfo));
  }
});