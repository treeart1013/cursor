<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import ChatmonLogo from '@/components/ChatmonLogo.vue';

const username = ref('');
const password = ref('');
const errorMessage = ref('');
const isLoading = ref(false);

const authStore = useAuthStore();
const router = useRouter();

const handleLogin = async () => {
  errorMessage.value = '';
  isLoading.value = true;
  try {
    await authStore.login(password.value, username.value || 'user');
    router.push('/');
  } catch (error: any) {
    errorMessage.value = error.message;
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="login-container">
    <div class="login-box">
      <div class="login-logo-wrapper">
        <ChatmonLogo />
      </div>
      <form @submit.prevent="handleLogin">
        <div class="input-group">
          <label for="username">ID</label>
          <input type="text" id="username" v-model="username" placeholder="ID를 입력하세요" />
        </div>
        <div class="input-group">
          <label for="password">Password</label>
          <input type="password" id="password" v-model="password" placeholder="비밀번호(1234)" />
        </div>
        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
        <button type="submit" :disabled="isLoading">
          {{ isLoading ? '로그인 중...' : '로그인' }}
        </button>
      </form>
    </div>
  </div>
</template>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #1a1a1a;
}
.login-box {
  background-color: #2c2c2c;
  padding: 80px 40px;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
  width: 100%;
  max-width: 450px;
  text-align: center;
  border: 1px solid var(--color-border);
}
.login-logo-wrapper {
  margin-bottom: 32px;
  transform: scale(1.5);
  display: inline-block;
}
.input-group {
  margin-bottom: 20px;
  text-align: left;
}
label {
  display: block;
  margin-bottom: 8px;
  color: #a0a0a0;
  font-size: 1rem;
}
input {
  width: 100%;
  padding: 14px;
  border-radius: 8px;
  border: 1px solid #444;
  background-color: #1e1e1e;
  color: #fff;
  font-size: 1rem;
  box-sizing: border-box;
  transition: border-color 0.3s;
}
input::placeholder {
  color: #777;
}
input:focus {
  outline: none;
  border-color: #4a90e2;
}
button {
  width: 100%;
  padding: 14px;
  border: none;
  border-radius: 8px;
  background-color: #3a506b;
  color: white;
  cursor: pointer;
  font-size: 1.1rem;
  font-weight: 600;
  transition: background-color 0.3s;
}
button:hover {
  background-color: #4a90e2;
}
button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
.error-message {
  color: #e57373;
  margin-bottom: 16px;
}
.login-logo-wrapper :deep(.logo-text) {
  font-size: 2.2rem;
}
.login-logo-wrapper :deep(.logo-icon) {
  width: 48px;
  height: 48px;
}
</style> 