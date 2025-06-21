<template>
  <div class="sidebar-menu">
    <button class="new-chat-btn" @click="emit('new-chat')">
      <span>+</span> 새 채팅
    </button>
    <div class="menu-group" ref="menuGroupRef">
      <h3 class="menu-title">채팅 목록</h3>
      <ul class="menu-list">
        <li
          v-for="(item, index) in chatHistory"
          :key="index"
          :class="{ active: openedMenuIndex === index }"
        >
          <span class="chat-title">{{ item }}</span>
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

const props = defineProps<{
  chatHistory: string[];
}>();

const emit = defineEmits(['new-chat', 'rename-chat', 'delete-chat']);

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
  gap: 24px;
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
  gap: 8px;
}

.new-chat-btn:hover {
  background-color: #3a506b;
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