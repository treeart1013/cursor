<template>
  <header class="common-header">
    <ChatmonLogo />
    <div class="header-right">
      <button @click="toggleRightPanel" class="toggle-button" :class="{ active: !isRightPanelEnabled }">
        모델 비교 {{ isRightPanelEnabled ? '끄기' : '켜기' }}
      </button>
      <span class="username" v-if="authStore.user">{{ authStore.user.name }}님</span>
      <button @click="handleLogout" class="logout-button">로그아웃</button>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';
import ChatmonLogo from './ChatmonLogo.vue';

const authStore = useAuthStore();
const router = useRouter();
const isRightPanelEnabled = ref(false);

const emit = defineEmits(['toggle-right-panel']);

const handleLogout = () => {
  authStore.logout();
  router.push('/login');
};

const toggleRightPanel = () => {
  isRightPanelEnabled.value = !isRightPanelEnabled.value;
  emit('toggle-right-panel');
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

.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.username {
  font-size: 0.9em;
  color: #ccc;
}

.toggle-button,
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

.toggle-button.active {
  background-color: #3a506b;
  color: white;
}

.toggle-button:hover,
.logout-button:hover {
  background: #5a5a5a;
}

.toggle-button.active:hover {
  background-color: #34495e;
}
</style> 