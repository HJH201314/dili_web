import { defineStore } from "pinia";
import { computed, ref } from "vue";

const useUserStore = defineStore('user', () => {

  const avatar = ref<string|undefined>();
  const userId = ref(-1);
  const isLogin = computed(() => userId.value > 0);

  function login() {
    userId.value = 1;
  }

  return {
    userId,
    avatar,
    isLogin,
    login,
  }
});

export default useUserStore;