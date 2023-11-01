import './assets/main.scss';

import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from './App.vue';
import router from './router';

const app = createApp(App);

// 注册pinia进行状态管理
app.use(createPinia());
// 注册路由
app.use(router);

app.mount('#app');
