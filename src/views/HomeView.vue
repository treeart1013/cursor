<script setup lang="ts">
import { ref } from 'vue';
import SidebarMenu from '@/components/SidebarMenu.vue'
import CommonHeader from '@/components/CommonHeader.vue'
import ChatHeader from '@/components/ChatHeader.vue'
import ChatWindow from '@/components/ChatWindow.vue'
import ChatInput from '@/components/ChatInput.vue'
import { useChat } from '@/composables/useChat';

// --- 상태 (State) ---
const isBannerVisible = ref(true); // 상단 배너 표시 여부 상태
const infoText = ref('<p>데모용으로 현재는 <span class="highlight">위키</span>만 지원합니다. 사용 후기 및 피드백 환영합니다.</p><p>자연어 질의에 대한 <span class="highlight">품질 개선</span>(응답속도, 정확도 등) 검토 예정이며, 조만간 <span class="highlight">아지트</span>도 지원할 예정입니다.</p>');

// 우측 채팅 패널의 활성화 여부
const isRightPanelActive = ref(false);

// useChat 컴포저블을 호출하여 채팅 관련 상태와 로직을 가져옴
const {
  modelLeft,
  modelRight,
  messagesLeft,
  messagesRight,
  isLoading,
  chatMessagesContainerLeft,
  chatMessagesContainerRight,
  startNewChatSession,
  processSendMessage,
  abortStream,
} = useChat(isRightPanelActive);

// 채팅 히스토리 및 제목 관련 상태는 HomeView에서 직접 관리
// (useChat은 개별 채팅 세션의 상태를 관리하므로, 전체 목록은 여기서 관리)
const chatTurnCount = ref(0); // 현재 대화의 턴 수
const MAX_TURNS = 5; // 최대 대화 턴 수 제한
const chatTitle = ref(''); // 현재 채팅의 제목
const chatHistory = ref<string[]>(['검색 결과의 활용 방안', '최근 배포 관련 이슈']); // 사이드바에 표시될 채팅 목록

// --- 메소드 (Methods) ---

/**
 * 상단 안내 배너를 닫는 함수
 */
const closeBanner = () => {
  isBannerVisible.value = false;
};

/**
 * CommonHeader에서 '모델 비교' 토글 시 호출되는 핸들러
 */
const handleToggleRightPanel = () => {
  isRightPanelActive.value = !isRightPanelActive.value;
};

/**
 * '새 채팅' 버튼 클릭 시 호출. 채팅 세션을 초기화.
 */
const startNewChat = () => {
  abortStream();          // 진행 중인 AI 응답이 있다면 중단
  startNewChatSession();  // 메시지 목록, UUID 등 세션 관련 상태 초기화 (from useChat)
  chatTurnCount.value = 0;// 턴 수 초기화
  chatTitle.value = '';   // 채팅 제목 초기화
};

/**
 * 사이드바에서 채팅 제목 변경 시 호출
 * @param index 변경할 채팅 히스토리의 인덱스
 */
const handleRenameChat = (index: number) => {
  const currentTitle = chatHistory.value[index];
  const newTitle = prompt('새로운 채팅 제목을 입력하세요:', currentTitle);
  if (newTitle && newTitle.trim() !== '') {
    chatHistory.value[index] = newTitle.trim();
  }
};

/**
 * 사이드바에서 채팅 삭제 시 호출
 * @param index 삭제할 채팅 히스토리의 인덱스
 */
const handleDeleteChat = (index: number) => {
  if (confirm(`'${chatHistory.value[index]}' 채팅을 삭제하시겠습니까?`)) {
    chatHistory.value.splice(index, 1);
  }
};

/**
 * ChatInput 컴포넌트에서 메시지 전송 시 호출
 * @param text 사용자가 입력한 메시지
 */
const handleSendMessage = async (text: string) => {
  // 최대 턴 수를 넘거나, 로딩 중일 때는 메시지 전송 방지
  if (chatTurnCount.value >= MAX_TURNS || isLoading.value) {
    return;
  }
  // 첫 번째 턴인 경우, 채팅 제목을 설정하고 히스토리에 추가
  if (chatTurnCount.value === 0 && text.trim() !== '') {
    chatTitle.value = text;
    chatHistory.value.unshift(text);
  }
  chatTurnCount.value++;
  
  // useChat에 정의된 메시지 처리 함수 호출
  await processSendMessage(text);
};
</script>

<template>
  <div class="chat-container">
    <aside class="sidebar">
      <SidebarMenu
        @new-chat="startNewChat"
        :chat-history="chatHistory"
        @rename-chat="handleRenameChat"
        @delete-chat="handleDeleteChat"
      />
    </aside>
    <main class="chat-area">
      <CommonHeader @toggle-right-panel="handleToggleRightPanel" />
      
      <!-- 상단 안내 배너 -->
      <div v-if="isBannerVisible" class="info-banner">
        <div class="info-banner-content" v-html="infoText"></div>
        <button @click="closeBanner" class="close-banner-btn" aria-label="Close banner">×</button>
      </div>

      <div class="dual-chat-windows" :class="{ 'single-view': !isRightPanelActive }">
        <div class="chat-messages-wrapper">
          <ChatHeader v-model:modelValue="modelLeft" :title="chatTitle" />
          <div class="chat-messages" ref="chatMessagesContainerLeft">
            <ChatWindow :messages="messagesLeft" />
          </div>
        </div>
        <div v-if="isRightPanelActive" class="chat-messages-wrapper">
          <ChatHeader v-model:modelValue="modelRight" :title="chatTitle" />
          <div class="chat-messages" ref="chatMessagesContainerRight">
            <ChatWindow :messages="messagesRight" />
          </div>
        </div>
      </div>
      <div class="chat-input-container">
        <ChatInput
          @sendMessage="handleSendMessage"
          :turn-count="chatTurnCount"
          :max-turns="MAX_TURNS"
          :is-loading="isLoading"
        />
      </div>
    </main>
  </div>
</template>

<style scoped>
.home-view {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  background-color: var(--color-background);
  color: var(--color-text);
  overflow: hidden;
}

.chat-container {
  display: flex;
  flex-grow: 1;
  overflow: hidden;
  width: 100%;
}

.sidebar {
  width: 280px;
  flex-shrink: 0;
  background-color: #1e1e1e;
  padding: 20px;
  display: flex;
  flex-direction: column;
  border-right: 1px solid var(--color-border);
}

.chat-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: #1E1E1E;
  height: 100%;
}

.dual-chat-windows {
  display: flex;
  flex-grow: 1;
  gap: 1px;
  background-color: var(--color-border);
  overflow-y: hidden;
}

.dual-chat-windows.single-view .chat-messages-wrapper {
  flex-basis: 100%;
}

.chat-messages-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: #1E1E1E;
  border: 2px solid transparent;
  overflow-y: hidden;
}

.chat-messages {
  flex-grow: 1;
  overflow-y: auto;
  padding: 20px;
  scroll-behavior: smooth;
}

.chat-input-container {
  padding: 20px;
}

.chat-window-wrapper {
  flex-grow: 1;
  overflow-y: auto;
  padding: 20px;
}

.chat-input-wrapper {
  padding: 16px;
}

.info-banner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  background-color: #3a506b;
  color: #e0e0e0;
  font-size: 0.85rem;
  line-height: 1.5;
}

.info-banner-content {
  flex-grow: 1;
  text-align: center;
  margin: 0 1rem;
}

.info-banner-content :deep(p) {
  margin: 0;
  padding: 0;
}

.info-banner-content :deep(.highlight) {
  color: #ffe490;
  font-weight: 600;
}

.close-banner-btn {
  background: none;
  border: none;
  color: #e0e0e0;
  font-size: 1.5rem;
  line-height: 1;
  cursor: pointer;
  padding: 0 5px;
}

.close-banner-btn:hover {
  color: #fff;
}
</style>
