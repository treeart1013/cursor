/**
 * @fileoverview 채팅 관련 로직과 상태를 관리하는 컴포저블 함수입니다.
 * @author owen.kim
 */

import { ref, nextTick } from 'vue';
import type { Ref } from 'vue';
import { fetchChatResponse } from '@/services/api';
import { models } from '@/types/models';
import type { AiModel, Message } from '@/types/models';
import { useAuthStore } from '@/stores/auth';

/**
 * 채팅 관련 로직과 상태를 관리하는 컴포저블 함수
 * @param isRightPanelActive - 우측 패널 활성화 여부를 나타내는 반응형 Ref
 */
export function useChat(isRightPanelActive: Ref<boolean>) {
  // --- 상태 (State) ---

  // 좌측/우측 채팅 패널에서 선택된 AI 모델
  const modelLeft = ref<AiModel>(models.find((m: AiModel) => m.id === 'o4-mini')!);
  const modelRight = ref<AiModel>(models.find((m: AiModel) => m.id === 'gpt-4o')!);

  // 좌측/우측 채팅 패널의 메시지 목록
  const messagesLeft = ref<Message[]>([]);
  const messagesRight = ref<Message[]>([]);

  // 각 채팅 세션의 고유 식별자 (UUID)
  const uuidLeft = ref(crypto.randomUUID());
  const uuidRight = ref(crypto.randomUUID());

  // API 요청 로딩 상태
  const isLoading = ref(false);
  // Pinia를 사용한 전역 인증 스토어
  const authStore = useAuthStore();

  // 채팅 메시지 컨테이너의 DOM 요소를 참조. 자동 스크롤에 사용.
  const chatMessagesContainerLeft = ref<HTMLElement | null>(null);
  const chatMessagesContainerRight = ref<HTMLElement | null>(null);

  // 메시지 고유 ID 카운터
  let messageCounter = 0;
  // SSE 요청 중단을 위한 AbortController
  let abortController: AbortController | null = null;
  
  // --- 메소드 (Methods) ---

  /**
   * 채팅 컨테이너를 맨 아래로 스크롤하는 함수
   * @param container - 스크롤할 컨테이너 ('left' 또는 'right')
   */
  const scrollToBottom = (container: 'left' | 'right') => {
    // DOM 업데이트가 완료된 후 스크롤을 실행하기 위해 nextTick 사용
    nextTick(() => {
      const el = container === 'left' ? chatMessagesContainerLeft.value : chatMessagesContainerRight.value;
      if (el) {
        el.scrollTop = el.scrollHeight;
      }
    });
  };

  /**
   * '새 채팅'을 시작. 기존 로딩 중인 요청은 중단하고, 메시지 목록과 UUID를 초기화.
   */
  const startNewChatSession = () => {
    abortStream(); // 기존 요청이 있다면 중단
    messagesLeft.value = [];
    messagesRight.value = [];
    // 새 채팅 세션을 위한 UUID 재발급
    uuidLeft.value = crypto.randomUUID();
    uuidRight.value = crypto.randomUUID();
  };

  /**
   * 사용자 메시지를 전송하고 AI 응답을 받아오는 전체 프로세스 처리
   * @param text - 사용자가 입력한 메시지
   */
  const processSendMessage = async (text: string) => {
    isLoading.value = true;
    abortController = new AbortController();

    // 사용자가 입력한 메시지를 각 패널에 추가
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

    // --- 좌측 패널 AI 응답 처리 ---
    const aiLeftMessageId = ++messageCounter;
    // 타이핑 인디케이터를 표시하기 위해 빈 AI 메시지 추가
    messagesLeft.value.push({ id: aiLeftMessageId, text: '', sender: 'ai', typing: true, isHtml: true });
    scrollToBottom('left');

    const leftPromise = fetchChatResponse({
      prompt: text,
      uuid: uuidLeft.value,
      model: modelLeft.value.id,
      userId: authStore.user?.id,
      signal: abortController.signal,
      onMessage: (content) => {
        const msg = messagesLeft.value.find((m: Message) => m.id === aiLeftMessageId);
        if (msg) {
          if (msg.typing) msg.typing = false; // 첫 메시지 수신 시 타이핑 인디케이터 제거
          msg.text += content; // 스트리밍 메시지 추가
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

    // --- 우측 패널 AI 응답 처리 (활성화된 경우에만) ---
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
        signal: abortController.signal,
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
      // 양쪽 패널의 AI 응답이 모두 완료될 때까지 기다림 (성공/실패 여부와 무관)
      await Promise.allSettled([leftPromise, rightPromise]);
    } finally {
      // 모든 작업이 끝나면 로딩 상태 해제
      isLoading.value = false;
      abortController = null;
    }
  };
  
  /**
   * 진행 중인 AI 응답 스트리밍을 중단
   */
  const abortStream = () => {
    if (isLoading.value && abortController) {
      abortController.abort();
      abortController = null;
    }
  }

  // --- 반환 (Return) ---
  // HomeView에서 사용할 상태와 메소드들을 반환
  return {
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
  };
} 