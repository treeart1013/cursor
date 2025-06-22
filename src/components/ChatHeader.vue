<template>
  <div class="chat-header">
    <span class="header-title">{{ title }}</span>
    <div class="model-selector" ref="dropdownRef">
      <div class="model-info" @click="toggleDropdown">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="model-icon"><path d="M12 2a2.83 2.83 0 0 0-2 5 2.83 2.83 0 0 0-2 5 2.83 2.83 0 0 0 2 5 2.83 2.83 0 0 0 2 5 2.83 2.83 0 0 0 2-5 2.83 2.83 0 0 0 2-5Z"/><path d="M6.34 7.34 4.5 9.5l-2-2.5"/><path d="m17.66 7.34 1.84 2.16 2-2.5"/><path d="m17.66 16.66 1.84-2.16 2 2.5"/><path d="M6.34 16.66 4.5 14.5l-2 2.5"/></svg>
        <span class="model-name">{{ modelValue.name }}</span>
        <span class="dropdown-icon" :class="{ open: isOpen }">▼</span>
      </div>
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

const props = defineProps<{
  modelValue: AiModel;
  title: string;
}>();

const emit = defineEmits(['update:modelValue']);

const isOpen = ref(false);
const dropdownRef = ref<HTMLElement | null>(null);

const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
};

const selectModel = (model: AiModel) => {
  emit('update:modelValue', model);
  isOpen.value = false;
};

const handleClickOutside = (event: MouseEvent) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    isOpen.value = false;
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
.chat-header {
  position: relative;
  padding: 15px 20px;
  border-bottom: 1px solid var(--color-border);
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
  color: #9e9e9e;
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