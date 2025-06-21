<template>
  <div class="chat-window">
    <div v-for="msg in messages" :key="msg.id" class="message-container" :class="`message-${msg.sender}`">
      <div class="message-bubble">
        <TypingIndicator v-if="msg.typing" />
        <HtmlRenderer v-else-if="msg.isHtml" :html-content="msg.text" />
        <p v-else>{{ msg.text }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import TypingIndicator from './TypingIndicator.vue';
import HtmlRenderer from './HtmlRenderer.vue';

interface Message {
  id: number;
  text: string;
  sender: 'ai' | 'user';
  isHtml?: boolean;
  typing?: boolean;
}

defineProps<{
  messages: Message[];
}>();
</script>

<style scoped>
.chat-window {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.message-container {
  display: flex;
}

.message-container.message-user {
  justify-content: flex-end;
}

.message-container.message-ai {
  justify-content: flex-start;
}

.message-bubble {
  padding: 12px 18px;
  border-radius: 18px;
  max-width: 70%;
  line-height: 1.6;
}

.message-user .message-bubble {
  background-color: #2c3e50;
  color: white;
}

.message-ai .message-bubble {
  background-color: #2a2a2a;
  color: var(--color-text);
}
</style> 