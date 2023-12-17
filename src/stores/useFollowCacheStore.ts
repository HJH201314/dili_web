/**
 * 本地记录已经关注过的东西，骗过上帝
 *
 */
import { defineStore } from "pinia";
import { useLocalStorage } from "@vueuse/core";

const useLikeCacheStore = defineStore('followCache', () => {

  const followCacheStorage = useLocalStorage<Record<number, boolean>>('follow-cache', {});

  /**
   * 关注
   * @param uid
   */
  function follow(uid: number) {
    followCacheStorage.value[uid] = true;
  }

  /**
   * 取消关注
   * @param uid
   */
  function unfollow(uid: number) {
    followCacheStorage.value[uid] = false;
  }

  function isFollowed(uid: number) {
    return followCacheStorage.value[`${uid}`];
  }

  return {
    follow,
    unfollow,
    isFollowed,
  }
});

export default useLikeCacheStore;