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
      component: HomePage,
      meta: { showCommonHeader: false }
    },
    {
      path: '/post',
      name: 'post',
      component: () => import('@/pages/common/post/PostPage.vue'),
    },
    {
      path: '/post/detail',
      name: 'post-detail',
      component: () => import('@/pages/common/post/PostDetail.vue'),
    }
  ]
})

export default router