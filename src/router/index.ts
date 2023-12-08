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
      // 使用showCommonHeader: false来关闭CommonHeader的显示
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
    },
    {
      path: '/space/:pathId',
      name: 'space',
      component: () => import('@/pages/personal/space/SpacePage.vue'),
      props: true, // 将路由参数传为prop
    },
  ]
})

export default router