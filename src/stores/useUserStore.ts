import { defineStore } from "pinia";
import { computed, onMounted, ref } from "vue";
import securityApi from "@/apis/services/video-platform-security";
import { useLocalStorage } from "@vueuse/core";

const useUserStore = defineStore('user', () => {

  const avatar = ref<string|undefined>();
  const userId = ref(-1);
  const tokenStorage = useLocalStorage('token', '');
  const token = computed(() => tokenStorage.value);
  const userInfo = ref({});
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

  return {
    userId,
    userUUID: token,
    avatar,
    userInfo,
    isLogin,
    login,
    logout,
  }
});

export default useUserStore;