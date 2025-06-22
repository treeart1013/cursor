<template>
  <div class="chat-header">
    <span class="header-title">{{ title }}</span>
    <div class="model-selector" ref="dropdownRef">
      <!-- 현재 선택된 모델 정보 표시 및 드롭다운 토글 버튼 -->
      <div class="model-info" @click="toggleDropdown">
        <span class="model-icon">🤖</span>
        <span class="model-name">{{ modelValue.name }}</span>
        <span class="dropdown-icon" :class="{ open: isOpen }">▼</span>
      </div>
      <!-- 모델 선택 드롭다운 메뉴 -->
      <Transition name="slide-fade">
        <div v-if="isOpen" class="dropdown-menu">
          <ul>
            <li v-for="model in availableModels" :key="model.id" @click="selectModel(model)">
              <div class="model-details">
                <div class="model-list-name-wrapper">
                  <span class="cost-dot" :class="model.cost"></span>
                  <span class="model-list-name">{{ model.name }}</span>
                </div>
                <span class="model-description">{{ model.description }}</span>
              </div>
              <!-- 현재 선택된 모델에 체크마크 표시 -->
              <span v-if="model.id === modelValue.id" class="checkmark">✓</span>
            </li>
          </ul>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import type { AiModel } from '@/types/models';
import { models as availableModels } from '@/types/models';

// --- Props ---
// v-model을 위해 modelValue prop을 정의
defineProps<{
  modelValue: AiModel; // 현재 선택된 AI 모델 객체
  title: string;       // 채팅 헤더에 표시될 제목
}>();

// --- Emits ---
// v-model을 위해 update:modelValue 이벤트를 정의
const emit = defineEmits(['update:modelValue']);

// --- State ---
const isOpen = ref(false); // 드롭다운 메뉴의 열림/닫힘 상태
const dropdownRef = ref<HTMLElement | null>(null); // 드롭다운 DOM 요소 참조

// --- Methods ---
/**
 * 드롭다운 메뉴를 열고 닫음
 */
const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
};

/**
 * 새로운 AI 모델을 선택하고, 부모 컴포넌트로 이벤트를 발생시킴
 * @param model - 사용자가 선택한 AI 모델 객체
 */
const selectModel = (model: AiModel) => {
  emit('update:modelValue', model); // v-model 업데이트
  isOpen.value = false; // 드롭다운 닫기
};

/**
 * 드롭다운 외부 영역 클릭 시 드롭다운을 닫는 이벤트 핸들러
 * @param event - MouseEvent
 */
const handleClickOutside = (event: MouseEvent) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    isOpen.value = false;
  }
};

// 컴포넌트 마운트 시 document에 클릭 이벤트 리스너 추가
onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

// 컴포넌트 언마운트 시 이벤트 리스너 제거 (메모리 누수 방지)
onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<style scoped>
.chat-header {
  position: relative;
  padding: 15px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-title {
  font-size: 1.2rem;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  min-width: 0;
}

.model-selector {
  position: relative;
}

.model-info {
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: #2c2c2c;
  padding: 6px 12px;
  border-radius: 8px;
  border: 1px solid transparent;
  transition: all 0.2s ease;
}

.model-info:hover {
  border-color: var(--color-border-hover);
  background-color: #333;
}

.model-icon {
  font-size: 1.2rem;
  line-height: 1;
}

.model-name {
  font-weight: 500;
  font-size: 1rem;
}

.dropdown-icon {
  font-size: 0.8rem;
  transition: transform 0.3s;
}

.dropdown-icon.open {
  transform: rotate(180deg);
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 8px;
  width: 300px;
  background-color: #252525;
  border: 1px solid var(--color-border);
  border-radius: 10px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
  z-index: 10;
  padding: 8px;
  overflow: hidden;
}

.dropdown-menu ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.dropdown-menu li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  cursor: pointer;
  border-radius: 6px;
  transition: background-color 0.2s;
}

.dropdown-menu li:hover {
  background-color: #3a506b;
}

.model-details {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.model-list-name-wrapper {
  display: flex;
  align-items: center;
}

.cost-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 10px;
  flex-shrink: 0;
}

.cost-dot.low {
  background-color: #42b983; /* Vue green */
}

.cost-dot.high {
  background-color: #f6ad55; /* Orange */
}

.model-list-name {
  font-weight: 500;
}

.model-description {
  font-size: 0.85em;
  color: #aaa;
}

.checkmark {
  color: #42b983; /* Vue green */
  font-size: 1.2rem;
}

.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.2s ease;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(-10px);
  opacity: 0;
}
</style> 