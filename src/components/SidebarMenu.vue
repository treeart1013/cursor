<template>
  <div class="sidebar-menu" :class="{ collapsed: isCollapsed }">
    <div class="sidebar-header">
      <button class="icon-btn hamburger-btn" @click="emit('toggle-sidebar')" aria-label="메뉴 토글">☰</button>
      <button v-if="!isCollapsed" class="icon-btn search-btn" aria-label="검색">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
      </button>
    </div>
    <button class="new-chat-btn" @click="emit('new-chat')">
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
      </svg>
      <span v-if="!isCollapsed" class="btn-text">새 채팅</span>
    </button>
    <div v-if="!isCollapsed" class="menu-group" ref="menuGroupRef">
      <h3 class="menu-title">채팅 목록</h3>
      <ul class="menu-list">
        <li
          v-for="(item, index) in chatHistory"
          :key="index"
          :class="{ active: openedMenuIndex === index }"
        >
          <span class="chat-title" :title="item">{{ item }}</span>
          <button class="more-btn" @click.stop="toggleMenu(index)">⋯</button>
          <div v-if="openedMenuIndex === index" class="context-menu">
            <button @click="emitRename(index)">
              <span class="icon">✏️</span> 이름 바꾸기
            </button>
            <button @click="emitDelete(index)" class="delete">
              <span class="icon">🗑️</span> 삭제
            </button>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

defineProps<{
  chatHistory: string[];
  isCollapsed: boolean;
}>();

const emit = defineEmits(['new-chat', 'rename-chat', 'delete-chat', 'toggle-sidebar']);

const openedMenuIndex = ref<number | null>(null);
const menuGroupRef = ref<HTMLElement | null>(null);

const toggleMenu = (index: number) => {
  openedMenuIndex.value = openedMenuIndex.value === index ? null : index;
};

const emitRename = (index: number) => {
  emit('rename-chat', index);
  openedMenuIndex.value = null;
};

const emitDelete = (index: number) => {
  emit('delete-chat', index);
  openedMenuIndex.value = null;
};

const handleClickOutside = (event: MouseEvent) => {
  if (menuGroupRef.value && !menuGroupRef.value.contains(event.target as Node)) {
    openedMenuIndex.value = null;
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<style scoped>
.sidebar-menu {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.sidebar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px 0;
  margin-bottom: 8px;
}

.icon-btn {
  background: none;
  border: none;
  color: #a0a0a0;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  transition: background-color 0.2s, color 0.2s;
}

.icon-btn:hover {
  background-color: #2a2a2a;
  color: #fff;
}

.search-btn svg {
  width: 22px;
  height: 22px;
}

.new-chat-btn {
  background-color: #2c3e50;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 8px;
  cursor: pointer;
  text-align: left;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: background-color 0.2s;
}

.new-chat-btn:hover {
  background-color: #3a506b;
}

.sidebar-menu.collapsed .new-chat-btn {
  justify-content: center;
  padding: 10px;
}

.btn-text {
  transition: opacity 0.2s;
}

.sidebar-menu.collapsed .btn-text {
  opacity: 0;
  width: 0;
  overflow: hidden;
}

.menu-group {
}

.menu-title {
  font-size: 0.8rem;
  color: #888;
  padding: 0 10px;
  margin-bottom: 8px;
  text-transform: uppercase;
}

.menu-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.menu-list li {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 15px;
  border-radius: 6px;
  cursor: pointer;
}

.chat-title {
  max-width: 220px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.more-btn {
  display: none;
  background: none;
  border: none;
  color: #fff;
  cursor: pointer;
  font-size: 1rem;
  font-weight: bold;
  line-height: 1;
  padding: 0 5px;
}

.menu-list li:hover,
.menu-list li.active {
  background-color: #2a2a2a;
}

.menu-list li:hover .more-btn,
.menu-list li.active .more-btn {
  display: block;
}

.context-menu {
  position: absolute;
  top: 0;
  left: 100%;
  margin-left: 8px;
  background-color: #2c2c2c;
  border: 1px solid #444;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  z-index: 20;
  width: 200px;
  padding: 8px;
  display: flex;
  flex-direction: column;
}

.context-menu button {
  background: none;
  border: none;
  color: #ededed;
  padding: 10px 12px;
  text-align: left;
  cursor: pointer;
  border-radius: 6px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.95rem;
}

.context-menu button:hover {
  background-color: #3a506b;
}

.context-menu button.delete {
  color: #ff5e5e;
}

.context-menu button.delete:hover {
  background-color: #5e3a3a;
}
</style> 