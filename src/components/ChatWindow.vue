<template>
  <div class="chat-window">
    <div v-for="message in messages" :key="message.id" class="message-wrapper">
      <!-- Case 1: 초기 웰컴 메시지 -->
      <div v-if="message.isInitial" class="initial-message">
        <ChatmonLogo :is-small="false" />
        <HtmlRenderer :htmlContent="message.text" />
      </div>

      <!-- Case 2: 일반 대화 메시지 (사용자 & AI) -->
      <div v-else :class="['message-container', `message-${message.sender}`]">
        <div v-if="message.sender === 'ai'" class="avatar">🤖</div>
        <div class="message-bubble">
          <TypingIndicator v-if="message.typing" />
          <HtmlRenderer v-else-if="message.isHtml" :htmlContent="message.text" />
          <p v-else>{{ message.text }}</p>
          <div v-if="message.error" class="error-message">
            <p>오류가 발생했습니다: {{ message.text }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import TypingIndicator from './TypingIndicator.vue';
import HtmlRenderer from './HtmlRenderer.vue';
import type { Message } from '@/types/models';
import ChatmonLogo from './ChatmonLogo.vue';

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
}

.message-wrapper {
  margin-bottom: 24px;
}

.initial-message {
  text-align: center;
  color: #a0a0a0;
  padding: 20px;
}

.initial-message > :deep(p) {
  margin: 8px 0;
}

.message-container {
  display: flex;
  max-width: 85%;
  align-items: flex-end;
}

.message-container.message-user {
  margin-left: auto;
  flex-direction: row-reverse;
}

.message-container.message-ai {
  margin-right: auto;
}

.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: #333;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  flex-shrink: 0;
  margin: 0 10px;
}

.message-bubble {
  padding: 12px 18px;
  border-radius: 20px;
  position: relative;
  word-wrap: break-word;
  overflow-wrap: break-word;
  background-color: #333;
  color: #fff;
}

.message-container.message-user .message-bubble {
  background-color: #3a506b;
}

.error-message {
  color: #ff6b6b;
  margin-top: 8px;
}
</style> 