<template>
  <div class="chat-input-wrapper">
    <div class="chat-input-container">
    <textarea
        ref="textareaRef"
      v-model="message"
      :placeholder="placeholderText"
      @keydown="handleKeydown"
      :disabled="isInputDisabled"
        @input="adjustTextareaHeight"
        rows="1"
    ></textarea>
      <button 
        @click="submitMessage" 
        :disabled="isSubmitDisabled" 
        class="send-btn"
        title="전송"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
        </svg>
      </button>
    </div>
    <div class="input-footer">
      <span class="turn-counter">남은 질문: {{ maxTurns - turnCount }}회</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue';

const props = defineProps<{
  turnCount: number;
  maxTurns: number;
  isLoading: boolean;
}>();

const message = ref('');
const emit = defineEmits(['sendMessage']);
const textareaRef = ref<HTMLTextAreaElement | null>(null);

const adjustTextareaHeight = () => {
  if (textareaRef.value) {
    textareaRef.value.style.height = 'auto';
    textareaRef.value.style.height = `${textareaRef.value.scrollHeight}px`;
  }
};

watch(message, () => {
  nextTick(adjustTextareaHeight);
});

const isInputDisabled = computed(() => props.isLoading);
const isSubmitDisabled = computed(() => message.value.trim() === '' || props.turnCount >= props.maxTurns || props.isLoading);

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
  nextTick(adjustTextareaHeight);
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
.chat-input-wrapper {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.chat-input-container {
  position: relative;
  display: flex;
  align-items: flex-end;
}

textarea {
  flex-grow: 1;
  padding: 10px 48px 10px 16px; /* 오른쪽 패딩 확보 */
  border-radius: 22px; /* 둥근 모서리 */
  border: 1px solid var(--color-border);
  background-color: #2a2a2a;
  color: var(--color-text);
  font-family: inherit;
  font-size: 1rem;
  resize: none;
  line-height: 1.5;
  max-height: 200px;
  overflow-y: auto;
  transition: border-color 0.2s, background-color 0.2s;
}

textarea:focus {
  outline: none;
  border-color: var(--color-border-hover);
  background-color: #333;
}

.send-btn {
  position: absolute;
  right: 8px;
  bottom: 8px;
  width: 32px;
  height: 32px;
  padding: 0;
  border-radius: 50%;
  background-color: #3b82f6;
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s, opacity 0.2s, transform 0.2s;
}

.send-btn:hover {
  background-color: #2563eb;
}

.send-btn:disabled {
  background-color: #555;
  cursor: not-allowed;
  opacity: 0.5;
  transform: scale(0.9);
}

.input-footer {
  text-align: center;
}

.turn-counter {
  color: #888;
  font-size: 0.8em;
}

textarea:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}
</style> 