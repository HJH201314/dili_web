import { defineStore } from "pinia";
import { computed, nextTick, onMounted, ref, watch } from "vue";
import securityApi from "@/apis/services/video-platform-security";
import { useLocalStorage } from "@vueuse/core";

const useUserStore = defineStore('user', () => {

  const avatar = ref<string|undefined>();
  const userId = ref(-1);
  const tokenStorage = useLocalStorage('token', '');
  const token = computed(() => tokenStorage.value);
  const userInfoStorage = useLocalStorage<API.User>('user-info', {});
  const userInfo = computed(() => userInfoStorage.value);
  const isLogin = computed(() => !!token.value);

  const login = async (type: 'pwd' | 'pin', principal: string, credential: string) => {
    const res = await securityApi.LoginController.loginUsingPOST({phone: principal, pswd: credential});
    if (res.data.code === 200) {
      tokenStorage.value = res.data.data ?? '';
      return true;
    } else {
      return false;
    }
    // setTimeout(() => {
    //   if ((type === 'password' && principal === 'guest' && credential === '123456') ||
    //       (type === 'sms' && principal === '11111111111' && credential === '654321')
    //   ) {
    //     userId.value = 1;
    //     avatar.value = 'https://img.yzcdn.cn/vant/cat.jpeg';
    //
    //   } else {
    //
    //   }
    // }, 1000);
  };

  const logout = async () => {
    const res = await securityApi.LoginController.logoutUsingGET({token: token.value});
    tokenStorage.value = '';
    return res.data.code === 200;
  }

  watch(isLogin, async (newVal, oldVal) => {
    // 等一下个tick，不然token可能还没写入storage
    await nextTick(async() => {
      if (newVal && !oldVal) {
        avatar.value = 'https://img.yzcdn.cn/vant/cat.jpeg';
        const res = await securityApi.LoginController.getCurrentUserUsingGET({token: token.value});
        userInfoStorage.value = res.data.data ?? {};
      }
    });
  });

  return {
    userId,
    token,
    avatar,
    userInfo,
    isLogin,
    login,
    logout,
  }
});

export default useUserStore;