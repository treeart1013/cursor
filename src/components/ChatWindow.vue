<template>
  <div class="chat-window">
    <div v-for="message in messages" :key="message.id" class="message-container">
      <div :class="['message', message.sender, { 'initial-message': message.isInitial }]">
        <TypingIndicator v-if="message.typing" />
        <HtmlRenderer v-else-if="message.isHtml" :html-content="message.text" />
        <span v-else>{{ message.text }}</span>
        <div v-if="message.error" class="error-message">{{ message.text }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import TypingIndicator from './TypingIndicator.vue';
import HtmlRenderer from './HtmlRenderer.vue';
import type { Message } from '@/types/models';

defineProps<{
  messages: Message[];
}>();
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
  padding: 12px 18px;
  border-radius: 18px;
  max-width: 80%;
  word-wrap: break-word;
  line-height: 1.6;
}

.message.user {
  background-color: #3a506b;
  color: #fff;
  align-self: flex-end;
  margin-left: auto;
}

.message.ai {
  background-color: #2a2a2a;
  color: var(--color-text);
  align-self: flex-start;
  margin-right: auto;
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