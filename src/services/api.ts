import { fetchEventSource } from '@microsoft/fetch-event-source';

export interface FetchChatResponseParams {
  prompt: string;
  uuid: string;
  model: string;
  userId?: string;
  onMessage: (content: string) => void;
  onDone: () => void;
  onError: (error: Error) => void;
}

export const fetchChatResponse = async ({
  prompt,
  uuid,
  model,
  userId,
  onMessage,
  onDone,
  onError,
}: FetchChatResponseParams): Promise<void> => {
  const apiHost = import.meta.env.VITE_API_HOST;
  const url = `${apiHost}/agent/test?prompt=${encodeURIComponent(prompt)}&uuid=${encodeURIComponent(uuid)}&model=${encodeURIComponent(model)}`;
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'text/event-stream',
  };
  if (userId) {
    headers['user-id'] = userId;
  }

  try {
    await fetchEventSource(url, {
      method: 'GET',
      headers,
      onmessage(ev) {
        if (ev.data === '[DONE]') {
          onDone();
          return;
        }
        try {
          const parsedData = JSON.parse(ev.data);
          onMessage(parsedData.content || '');
        } catch (e) {
          onMessage(ev.data);
        }
      },
      onclose() {
        onDone();
      },
      onerror(err) {
        console.error("EventSource failed:", err);
        const error = new Error("AI 응답을 불러올 수 없습니다. 관리자에게 문의하세요.");
        onError(error);
        throw error; // This will reject the promise
      },
    });
  } catch (err) {
    // This will catch errors thrown from onerror and other fatal errors
    if (err instanceof Error) {
        onError(err);
    } else {
        onError(new Error('An unknown error occurred'));
    }
  }
}; 