import { createRouter, createWebHistory } from 'vue-router'
import HomePage from "@/pages/common/home/HomePage.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/home'
    },
    {
      path: '/home',
      name: 'home',
      component: HomePage
    },
    {
      path: '/post',
      name: 'post',
      component: () => import('@/pages/common/post/PostPage.vue')
    }
  ]
})

export default router