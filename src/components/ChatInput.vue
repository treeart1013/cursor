<template>
  <div class="chat-input">
    <textarea
      v-model="message"
      :placeholder="placeholderText"
      @keydown="handleKeydown"
      :disabled="isInputDisabled"
    ></textarea>
    <div class="input-controls">
      <span class="turn-counter">({{ turnCount }}/{{ maxTurns }})</span>
      <button @click="submitMessage" :disabled="isInputDisabled">전송</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const props = defineProps<{
  turnCount: number;
  maxTurns: number;
  isLoading: boolean;
}>();

const message = ref('');
const emit = defineEmits(['sendMessage']);

const isInputDisabled = computed(
  () => props.turnCount >= props.maxTurns || props.isLoading
);
const placeholderText = computed(() => {
  if (props.turnCount >= props.maxTurns) {
    return '최대 질문 횟수에 도달했습니다. 새 채팅을 시작해주세요.';
  }
  if (props.isLoading) {
    return '응답을 기다리는 중...';
  }
  return '메시지를 입력하세요...';
});

const submitMessage = () => {
  if (message.value.trim() === '' || isInputDisabled.value) return;
  emit('sendMessage', message.value);
  message.value = '';
};

const handleKeydown = (event: KeyboardEvent) => {
  if (isInputDisabled.value) return;

  if (event.isComposing) {
    return;
  }

  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    submitMessage();
  } else if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
    event.preventDefault();
    submitMessage();
  }
};
</script>

<style scoped>
.chat-input {
  display: flex;
  align-items: center;
  gap: 10px;
}

textarea {
  flex-grow: 1;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid var(--color-border);
  background-color: #2a2a2a;
  color: var(--color-text);
  font-family: inherit;
  font-size: 1rem;
  resize: none;
  min-height: 40px;
  max-height: 200px;
  line-height: 1.5;
}

textarea:focus {
  outline: none;
  border-color: var(--color-border-hover);
}

.input-controls {
  display: flex;
  align-items: center;
  gap: 10px;
}

.turn-counter {
  color: #888;
  font-size: 0.9em;
  white-space: nowrap;
}

button {
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  background-color: #2c3e50;
  color: white;
  cursor: pointer;
  font-size: 1rem;
}

button:hover {
  background-color: #3a506b;
}

button:disabled,
textarea:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}
</style> 