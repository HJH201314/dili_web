import { defineStore } from "pinia";
import { computed, ref } from "vue";

const useUserStore = defineStore('user', () => {

  const avatar = ref<string|undefined>();
  const userId = ref(-1);
  const userInfo = ref({});
  const isLogin = computed(() => userId.value > 0);

  const login = (type: 'password' | 'sms', principal: string, credential: string) => new Promise<boolean>((resolve) => {
    setTimeout(() => {
      if ((type === 'password' && principal === 'guest' && credential === '123456') ||
          (type === 'sms' && principal === '11111111111' && credential === '654321')
      ) {
        userId.value = 1;
        avatar.value = 'https://avatars.githubusercontent.com/u/21263504?v=4';
        resolve(true);
      } else {
        resolve(false);
      }
    }, 1000);
  });

  return {
    userId,
    avatar,
    userInfo,
    isLogin,
    login,
  }
});

export default useUserStore;