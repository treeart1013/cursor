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
        class="send-button"
        aria-label="Send message"
      >
        <span class="send-icon">▲</span>
      </button>
    </div>
    <div class="turn-indicator">
      대화 턴 {{ turnCount }} / {{ maxTurns }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from 'vue';

// --- Props ---
const props = defineProps<{
  turnCount: number; // 현재 대화 턴 수
  maxTurns: number;  // 최대 대화 턴 수
  isLoading: boolean; // 부모 컴포넌트(HomeView)의 로딩 상태
}>();

// --- Emits ---
const emit = defineEmits(['sendMessage']);

// --- State ---
const message = ref(''); // 사용자가 입력한 메시지
const textareaRef = ref<HTMLTextAreaElement | null>(null); // textarea의 DOM 참조

// --- Computed ---
// 입력창 비활성화 여부 계산. 로딩 중이거나 최대 턴에 도달하면 true.
const isInputDisabled = computed(() => props.isLoading || props.turnCount >= props.maxTurns);
// 전송 버튼 비활성화 여부 계산. 입력창이 비활성화 상태이거나 메시지가 비어있으면 true.
const isSubmitDisabled = computed(() => isInputDisabled.value || message.value.trim() === '');
// 입력창 placeholder 텍스트 계산.
const placeholderText = computed(() => {
  if (props.isLoading) return 'AI가 답변 중입니다...';
  if (props.turnCount >= props.maxTurns) return `최대 ${props.maxTurns}턴까지 대화할 수 있습니다.`;
  return '메시지를 입력하세요...';
});

// --- Methods ---
/**
 * 메시지를 부모 컴포넌트로 전송
 */
const submitMessage = () => {
  if (isSubmitDisabled.value) return;
  emit('sendMessage', message.value);
  message.value = ''; // 메시지 초기화
  nextTick(adjustTextareaHeight); // 높이 재조정
};

/**
 * 키보드 이벤트 핸들러. Shift+Enter는 줄바꿈, Enter는 메시지 전송.
 * @param {KeyboardEvent} event
 */
const handleKeydown = (event: KeyboardEvent) => {
  // isComposing이 true이면, 아직 한글 등 조합 문자가 완성되지 않은 상태이므로,
  // Enter 키 입력을 무시하여 마지막 글자가 누락되는 현상을 방지.
  if (event.isComposing) {
    return;
  }
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault(); // 기본 동작(줄바꿈) 방지
    submitMessage();
  }
};

/**
 * textarea의 높이를 내용에 맞게 자동으로 조절
 */
const adjustTextareaHeight = () => {
  const textarea = textareaRef.value;
  if (textarea) {
    textarea.style.height = 'auto'; // 높이를 초기화하여 scrollHeight를 정확히 계산
    textarea.style.height = `${textarea.scrollHeight}px`; // 실제 내용 높이로 설정
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

.send-button {
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

.send-button:hover {
  background-color: #2563eb;
}

.send-button:disabled {
  background-color: #555;
  cursor: not-allowed;
  opacity: 0.5;
  transform: scale(0.9);
}

.turn-indicator {
  text-align: center;
}

textarea:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}
</style> 