<template>
  <div class="chat-header">
    <span class="header-title">{{ title }}</span>
    <div class="model-selector" ref="dropdownRef">
      <div class="model-info" @click="toggleDropdown">
        <span class="model-name">{{ modelValue.name }}</span>
        <span class="dropdown-icon" :class="{ open: isOpen }">▼</span>
      </div>
      <Transition name="fade">
        <div v-if="isOpen" class="dropdown-menu">
          <ul>
            <li v-for="model in availableModels" :key="model.id" @click="selectModel(model)">
              <div class="model-details">
                <span class="model-list-name">{{ model.name }}</span>
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
}

.model-name {
  font-weight: 600;
  font-size: 1.1rem;
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
  width: 280px;
  background-color: #2a2a2a;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  z-index: 10;
  padding: 8px;
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
}

.dropdown-menu li:hover {
  background-color: #3a506b;
}

.model-details {
  display: flex;
  flex-direction: column;
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

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style> 