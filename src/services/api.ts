import { fetchEventSource } from '@microsoft/fetch-event-source';

/**
 * AI 채팅 응답을 위한 파라미터 인터페이스
 */
export interface FetchChatResponseParams {
  prompt: string;        // 사용자 입력 프롬프트
  uuid: string;          // 채팅 세션 UUID
  model: string;         // 사용할 AI 모델 ID
  userId?: string;       // 사용자 ID (선택)
  onMessage: (content: string) => void; // 메시지 수신 시 호출될 콜백
  onDone: () => void;    // 스트림 종료 시 호출될 콜백
  onError: (error: Error) => void;     // 오류 발생 시 호출될 콜백
  signal: AbortSignal;   // 요청 중단을 위한 AbortSignal
}

/**
 * Server-Sent Events(SSE)를 사용하여 AI 채팅 응답을 실시간으로 스트리밍하는 함수
 * @microsoft/fetch-event-source 라이브러리를 사용.
 * @param params - AI 채팅 응답 요청에 필요한 파라미터 객체
 */
export const fetchChatResponse = async ({
  prompt,
  uuid,
  model,
  userId,
  onMessage,
  onDone,
  onError,
  signal,
}: FetchChatResponseParams): Promise<void> => {
  // .env 파일에 정의된 API 호스트 주소를 가져옴
  const apiHost = import.meta.env.VITE_API_HOST;
  const url = `${apiHost}/agent/test?prompt=${encodeURIComponent(prompt)}&uuid=${encodeURIComponent(uuid)}&model=${encodeURIComponent(model)}`;
  
  // 요청 헤더 설정
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'text/event-stream', // SSE를 위한 Accept 헤더
  };
  // 사용자 ID가 있을 경우 헤더에 추가
  if (userId) {
    headers['user-id'] = userId;
  }

  try {
    await fetchEventSource(url, {
      method: 'GET',
      headers,
      signal, // AbortController의 signal을 전달하여 요청 취소 기능을 구현
      
      /**
       * 서버로부터 메시지(이벤트)를 수신할 때마다 호출
       * @param ev - MessageEvent 객체
       */
      onmessage(ev) {
        // 스트림의 끝을 알리는 특별한 메시지 처리
        if (ev.data === '[DONE]') {
          onDone();
          return;
        }
        try {
          // 서버에서 오는 데이터가 JSON 형식일 경우 파싱
          const parsedData = JSON.parse(ev.data);
          // 실제 content가 있다면 onMessage 콜백 호출
          onMessage(parsedData.content || '');
        } catch (e) {
          // JSON 파싱 실패 시 원본 데이터를 그대로 전달
          onMessage(ev.data);
        }
      },

      /**
       * 연결이 정상적으로 닫혔을 때 호출
       */
      onclose() {
        onDone();
      },

      /**
       * 오류 발생 시 호출 (네트워크 오류, 서버 오류 등)
       * @param err - 발생한 오류 객체
       */
      onerror(err) {
        // AbortSignal에 의해 요청이 중단된 경우는 정상적인 종료로 간주
        if (signal.aborted) {
          onDone();
          return;
        }
        console.error("EventSource failed:", err);
        const error = new Error("AI 응답을 불러올 수 없습니다. 관리자에게 문의하세요.");
        onError(error);
        throw error; // 라이브러리가 재연결을 시도하지 않도록 오류를 다시 던짐
      },
    });
  } catch (err) {
    // fetchEventSource 내부에서 throw된 에러나 기타 에러를 캐치
    if (err instanceof Error) {
      // AbortError는 사용자가 의도적으로 요청을 취소한 것이므로 오류로 처리하지 않음
      if (err.name !== 'AbortError') {
        onError(err);
      }
    } else {
        onError(new Error('An unknown error occurred'));
    }
  }
}; 