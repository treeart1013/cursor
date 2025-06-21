import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('token') || null);
  const user = ref(localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!) : null);

  const isAuthenticated = computed(() => !!token.value);

  function login(password: string, username: string = 'user') {
    return new Promise<void>((resolve, reject) => {
      // Dummy authentication: any username, password must be '1234'
      if (password === '1234') {
        const dummyToken = crypto.randomUUID();
        token.value = dummyToken;
        user.value = { name: username };

        localStorage.setItem('token', dummyToken);
        localStorage.setItem('user', JSON.stringify({ name: username }));
        
        resolve();
      } else {
        reject(new Error('로그인 정보가 올바르지 않습니다.'));
      }
    });
  }

  function logout() {
    token.value = null;
    user.value = null;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  return {
    token,
    user,
    isAuthenticated,
    login,
    logout,
  };
}); 