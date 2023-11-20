import '@/assets/main.scss';

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { VueQueryPlugin } from "@tanstack/vue-query";

import App from './App.vue';
import router from './router';
import shake from "@/commands/shake";
import publicRoutes from "@/router/publicRoutes";
import useUserStore from "@/stores/useUserStore";
import showToast from "@/components/toast/toast";

const app = createApp(App);

// 注册pinia进行状态管理
app.use(createPinia());
// 注册路由
app.use(router);
// VueQuery
app.use(VueQueryPlugin);

// 路由拦截
router.beforeEach((to, from, next) => {
  if (to.path === from.path) return;
  console.log('to.path', to.path)
  if (publicRoutes.indexOf(to.path) !== -1) {
    next();
    return;
  } else {
    if (!useUserStore().isLogin) {
      showToast({type: 'danger', text: '请先登录！'});
      next('/home');
      return;
    }
    next();
  }
});

// 自定义指令v-shake
app.directive('shake', {
  updated: shake
});

app.mount('#app');
