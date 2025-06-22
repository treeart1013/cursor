import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { requiresAuth: true }
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    }
  ]
})

/**
 * 네비게이션 가드 (Navigation Guard)
 * 라우터가 페이지를 이동하기 전에 항상 실행됨.
 * to: 이동할 페이지의 라우트 정보
 * from: 현재 페이지의 라우트 정보
 * next: 페이지 이동을 제어하는 함수
 */
router.beforeEach((to, from, next) => {
  // Pinia 인증 스토어를 가져옴
  const authStore = useAuthStore();
  
  // 1. 이동할 페이지(to)가 인증을 필요로 하고(requiresAuth), 현재 로그인 상태가 아니라면
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    // 로그인 페이지로 강제 이동
    next({ name: 'login' });
  } 
  // 2. 이동할 페이지가 로그인 페이지인데, 이미 로그인 상태라면
  else if (to.name === 'login' && authStore.isAuthenticated) {
    // 홈 페이지로 강제 이동 (중복 로그인 방지)
    next({ name: 'home' });
  }
  // 3. 위 조건에 해당하지 않는 모든 경우
  else {
    // 정상적으로 해당 페이지로 이동
    next();
  }
});

export default router
