<template>
  <header class="common-header">
    <h1 class="title">챗몬(Chatmon)</h1>
    <div class="header-right">
      <span class="username" v-if="authStore.user">{{ authStore.user.name }}님</span>
      <button @click="handleLogout" class="logout-button">로그아웃</button>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

const handleLogout = () => {
  authStore.logout();
  router.push('/login');
};
</script>

<style scoped>
.common-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  background-color: #1E1E1E;
  color: var(--color-text);
  border-bottom: 1px solid var(--color-border);
}

.title {
  margin: 0;
  font-size: 1.2rem;
}

.header-right {
  display: flex;
  align-items: center;
}

.username {
  margin-right: 16px;
  font-size: 0.9em;
  color: #ccc;
}

.logout-button {
  background: #4a4a4a;
  color: #fff;
  border: none;
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9em;
  transition: background-color 0.2s;
}

.logout-button:hover {
  background: #5a5a5a;
}
</style> 