<script setup lang="ts">
import { ref, nextTick, onMounted } from 'vue';
import SidebarMenu from '@/components/SidebarMenu.vue'
import CommonHeader from '@/components/CommonHeader.vue'
import ChatHeader from '@/components/ChatHeader.vue'
import ChatWindow from '@/components/ChatWindow.vue'
import ChatInput from '@/components/ChatInput.vue'
import { fetchChatResponse } from '@/services/api';
import { models } from '@/types/models';
import type { AiModel, Message } from '@/types/models';
import { useAuthStore } from '@/stores/auth';

const newWelcomeText = '<p>데모용으로 현재는 <span class="highlight">위키</span>만 지원합니다. 사용 후기 및 피드백 환영합니다.</p><p>자연어 질의에 대한 <span class="highlight">품질 개선</span>(응답속도, 정확도 등) 검토 예정이며, 조만간 <span class="highlight">아지트</span>도 지원할 예정입니다.</p>';

const modelLeft = ref<AiModel>(models.find((m: AiModel) => m.id === 'o4-mini')!);
const modelRight = ref<AiModel>(models.find((m: AiModel) => m.id === 'gpt-4o')!);

const messagesLeft = ref<Message[]>([]);
const messagesRight = ref<Message[]>([]);
const uuidLeft = ref(crypto.randomUUID());
const uuidRight = ref(crypto.randomUUID());

const chatTurnCount = ref(0);
const MAX_TURNS = 5;
const chatTitle = ref('');

let messageCounter = 0;

const chatMessagesContainerLeft = ref<HTMLElement | null>(null);
const chatMessagesContainerRight = ref<HTMLElement | null>(null);

const isLoading = ref(false);
const authStore = useAuthStore();
const isRightPanelActive = ref(true);

const setInitialMessage = (side: 'left' | 'right') => {
  const text = newWelcomeText;
  const message: Message = { id: ++messageCounter, text, sender: 'ai', isHtml: true, isInitial: true };
  
  if (side === 'left') {
    messagesLeft.value = [message];
  } else {
    messagesRight.value = [message];
  }
};

const handleToggleRightPanel = () => {
  isRightPanelActive.value = !isRightPanelActive.value;
  if (isRightPanelActive.value && messagesRight.value.length === 0) {
    setInitialMessage('right');
    uuidRight.value = crypto.randomUUID();
  }
};

onMounted(() => {
  setInitialMessage('left');
  setInitialMessage('right');
});

const startNewChat = () => {
  setInitialMessage('left');
  setInitialMessage('right');
  uuidLeft.value = crypto.randomUUID();
  uuidRight.value = crypto.randomUUID();
  chatTurnCount.value = 0;
  chatTitle.value = '';
};

const scrollToBottom = (container: 'left' | 'right') => {
  nextTick(() => {
    const el = container === 'left' ? chatMessagesContainerLeft.value : chatMessagesContainerRight.value;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  });
};

const handleSendMessage = async (text: string) => {
  if (chatTurnCount.value >= MAX_TURNS || isLoading.value) {
    return;
  }
  if (chatTurnCount.value === 0) {
    chatTitle.value = text;
  }
  isLoading.value = true;
  chatTurnCount.value++;

  // Add user message to both panes
  const userMessageId = ++messageCounter;
  const userMessage: Message = { id: userMessageId, text, sender: 'user' };
  messagesLeft.value.push(userMessage);
  if (isRightPanelActive.value) {
    messagesRight.value.push(userMessage);
  }
  scrollToBottom('left');
  if (isRightPanelActive.value) {
    scrollToBottom('right');
  }

  // --- Process Left Pane (O4-mini) ---
  const aiLeftMessageId = ++messageCounter;
  messagesLeft.value.push({ id: aiLeftMessageId, text: '', sender: 'ai', typing: true, isHtml: true });
  scrollToBottom('left');
  
  const leftPromise = fetchChatResponse({
    prompt: text,
    uuid: uuidLeft.value,
    model: modelLeft.value.id,
    userId: authStore.user?.id,
    onMessage: (content) => {
      const msg = messagesLeft.value.find((m: Message) => m.id === aiLeftMessageId);
      if (msg) {
        if (msg.typing) msg.typing = false;
        msg.text += content;
        scrollToBottom('left');
      }
    },
    onDone: () => {
      const msg = messagesLeft.value.find((m: Message) => m.id === aiLeftMessageId);
      if (msg) msg.typing = false;
    },
    onError: (error) => {
      const msg = messagesLeft.value.find((m: Message) => m.id === aiLeftMessageId);
      if (msg) {
        msg.text = error.message;
        msg.typing = false;
        msg.error = true;
      }
    }
  });

  // --- Process Right Pane (GPT-4o) ---
  let rightPromise: Promise<void | null> = Promise.resolve();
  if (isRightPanelActive.value) {
    const aiRightMessageId = ++messageCounter;
    messagesRight.value.push({ id: aiRightMessageId, text: '', sender: 'ai', typing: true, isHtml: true });
    scrollToBottom('right');
    
    rightPromise = fetchChatResponse({
      prompt: text,
      uuid: uuidRight.value,
      model: modelRight.value.id,
      userId: authStore.user?.id,
      onMessage: (content) => {
        const msg = messagesRight.value.find((m: Message) => m.id === aiRightMessageId);
        if (msg) {
          if (msg.typing) msg.typing = false;
          msg.text += content;
          scrollToBottom('right');
        }
      },
      onDone: () => {
        const msg = messagesRight.value.find((m: Message) => m.id === aiRightMessageId);
        if (msg) msg.typing = false;
      },
      onError: (error) => {
        const msg = messagesRight.value.find((m: Message) => m.id === aiRightMessageId);
        if (msg) {
          msg.text = error.message;
          msg.typing = false;
          msg.error = true;
        }
      }
    });
  }

  try {
    await Promise.allSettled([leftPromise, rightPromise]);
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="chat-container">
    <aside class="sidebar">
      <SidebarMenu @new-chat="startNewChat" />
    </aside>
    <main class="chat-area">
      <CommonHeader @toggle-right-panel="handleToggleRightPanel" />
      <div class="dual-chat-windows" :class="{ 'single-view': !isRightPanelActive }">
        <div class="chat-messages-wrapper">
          <ChatHeader v-model="modelLeft" :title="chatTitle" />
          <div class="chat-messages" ref="chatMessagesContainerLeft">
            <ChatWindow :messages="messagesLeft" />
          </div>
        </div>
        <div v-if="isRightPanelActive" class="chat-messages-wrapper">
          <ChatHeader v-model="modelRight" :title="chatTitle" />
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
  height: 100%;
  width: 100%;
}

.sidebar {
  flex: 0 0 20%;
  background-color: #161616;
  padding: 20px;
  color: #ededed;
  display: flex;
  flex-direction: column;
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
  min-width: 0; /* flexbox 아이템 축소 허용 */
}

.chat-messages {
  flex-grow: 1;
  overflow-y: auto;
  padding: 20px;
  scroll-behavior: smooth;
}

.chat-input-container {
  padding: 20px;
  border-top: 1px solid var(--color-border);
}
</style>
