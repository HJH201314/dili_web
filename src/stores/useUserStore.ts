import { defineStore } from "pinia";
import { computed, nextTick, ref, watch } from "vue";
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

  const login = async (type: 'phone' | 'email', principal: string, credential: string) => {
    let res;
    if (type == 'phone') {
      res = await securityApi.LoginController.loginUsingPOST({phone: principal, pswd: credential, type: 0});
    } else if (type == 'email') {
      res = await securityApi.LoginController.loginUsingPOST({email: principal, pin: credential, type: 1});
    }
    if (res?.data.code === 200) {
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

  const sendPin = async (type: 'phone' | 'email', principal: string) => {
    const res = await securityApi.LoginController.getPinUsingPOST({auth: principal, type: type == 'email' ? 0 : 1});
    return res.data.code === 200;
  }

  const register = async (type: 'phone' | 'email', principal: string, credential: string) => {
    const param: API.RegisterDto = {
      name: `匿名用户${principal.slice(0, 3)}`,
      email: type === 'email' ? principal : undefined,
      phone: type === 'phone' ? principal : undefined,
      pswd: type === 'phone' ? credential : undefined,
      pin: type === 'email' ? credential : undefined,
      type: type === 'phone' ? 1 : 2,
    }
    const res = await securityApi.LoginController.registerUsingPOST(param);
    return res?.data.code === 200;
  }

  const logout = async () => {
    if (token.value) {
      const res = await securityApi.LoginController.logoutUsingGET({token: token.value});
      if (res?.data.code === 200) {
        tokenStorage.value = '';
        return true;
      }
    }
    tokenStorage.value = '';
    return false;
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
    sendPin,
    register,
  }
});

export default useUserStore;