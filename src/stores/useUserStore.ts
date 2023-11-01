import { defineStore } from "pinia";
import { ref } from "vue";

const useUserStore = defineStore('user', () => {

  const avatar = ref('');
  const userId = ref(-1);

  function login() {

  }

  return {
    userId,
    avatar,

    login,
  }
});

export default useUserStore;