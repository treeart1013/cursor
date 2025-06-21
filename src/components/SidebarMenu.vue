<template>
  <div class="sidebar-menu">
    <button class="new-chat-btn" @click="emit('new-chat')">
      <span>+</span> 새 채팅
    </button>
    <div class="menu-group">
      <h3 class="menu-title">채팅 목록</h3>
      <ul class="menu-list">
        <li>검색 결과의 활용 방안</li>
        <li>최근 배포 관련 이슈</li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits(['new-chat']);
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
  padding: 10px 15px;
  border-radius: 6px;
  cursor: pointer;
}

.menu-list li:hover, .menu-list li.active {
  background-color: #2a2a2a;
}
</style> 