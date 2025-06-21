import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

// Define the User type for better type safety
interface User {
  id: string;
  name: string;
}

export const useAuthStore = defineStore('auth', () => {
  // Initialize state from localStorage
  const token = ref<string | null>(localStorage.getItem('token'));
  const user = ref<User | null>(JSON.parse(localStorage.getItem('user') || 'null'));

  const isAuthenticated = computed(() => !!token.value);

  function login(password: string, username: string = 'user') {
    return new Promise<void>((resolve, reject) => {
      // Dummy authentication: any username, password must be '1234'
      if (password === '1234') {
        const dummyToken = crypto.randomUUID();
        const userData: User = { id: username, name: username };
        
        // Update reactive state
        token.value = dummyToken;
        user.value = userData;

        // Persist state to localStorage
        localStorage.setItem('token', dummyToken);
        localStorage.setItem('user', JSON.stringify(userData));
        
        resolve();
      } else {
        reject(new Error('로그인 정보가 올바르지 않습니다.'));
      }
    });
  }

  function logout() {
    // Clear reactive state
    token.value = null;
    user.value = null;
    
    // Clear persisted state
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