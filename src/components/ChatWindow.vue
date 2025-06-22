<template>
  <div class="chat-window">
    <div v-for="message in messages" :key="message.id" class="message-container">
      <div :class="['message', message.sender, { 'initial-message': message.isInitial }]">
        <TypingIndicator v-if="message.typing" />
        <HtmlRenderer v-else-if="message.isHtml" :html-content="message.text" />
        <span v-else>{{ message.text }}</span>
        <div v-if="message.error" class="error-message">{{ message.text }}</div>

        <button 
          v-if="message.sender === 'ai' && !message.typing && !message.error && message.text"
          @click="copyToClipboard(message)"
          class="copy-btn"
          :class="{ 'copied': copiedMessageId === message.id }"
          :title="copiedMessageId === message.id ? '복사됨' : '내용 복사'"
        >
          <span v-if="copiedMessageId === message.id">✓</span>
          <span v-else>📋</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import TypingIndicator from './TypingIndicator.vue';
import HtmlRenderer from './HtmlRenderer.vue';
import type { Message } from '@/types/models';

defineProps<{
  messages: Message[];
}>();

const copiedMessageId = ref<number | null>(null);

const copyToClipboard = async (message: Message) => {
  if (copiedMessageId.value === message.id) return;

  try {
    const plainText = new DOMParser().parseFromString(message.text, 'text/html').documentElement.textContent || '';
    await navigator.clipboard.writeText(plainText);
    copiedMessageId.value = message.id;
    setTimeout(() => {
      copiedMessageId.value = null;
    }, 2000);
  } catch (err) {
    console.error('클립보드 복사 실패:', err);
    alert('클립보드 복사에 실패했습니다.');
  }
};
</script>

<style scoped>
.chat-window {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.message-container {
  display: flex;
}

.message {
  position: relative;
  padding: 12px 18px;
  border-radius: 18px;
  max-width: 80%;
  word-wrap: break-word;
  line-height: 1.45;
}

.message.user {
  background-color: #3a506b;
  color: #fff;
  align-self: flex-end;
  margin-left: auto;
  white-space: pre-wrap;
}

.message.ai {
  background-color: #2a2a2a;
  color: var(--color-text);
  align-self: flex-start;
  margin-right: auto;
}

.copy-btn {
  position: absolute;
  bottom: 8px;
  right: 8px;
  background-color: rgba(255, 255, 255, 0.1);
  color: #fff;
  border: none;
  padding: 4px 8px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.8em;
  opacity: 0;
  transition: opacity 0.2s, background-color 0.2s;
}

.message.ai:hover .copy-btn {
  opacity: 1;
}

.copy-btn.copied,
.message.ai:hover .copy-btn.copied {
  background-color: #4caf50;
  opacity: 1;
}

.initial-message {
  background-color: #2a2a2a;
  width: 100%;
  max-width: 100%;
  padding: 20px;
  text-align: left;
}

.initial-message :deep(p) {
  margin: 5px 0;
  color: var(--color-text);
}

.initial-message :deep(.highlight) {
  color: #ffe490;
  font-weight: bold;
}

.error-message {
  color: #ff5c5c;
  font-size: 0.9em;
}
</style> 