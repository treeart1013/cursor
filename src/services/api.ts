export interface FetchChatResponseParams {
  prompt: string;
  uuid: string;
  model: string;
  onMessage: (content: string) => void;
  onDone: () => void;
  onError: (error: Error) => void;
}

export const fetchChatResponse = ({
  prompt,
  uuid,
  model,
  onMessage,
  onDone,
  onError,
}: FetchChatResponseParams): Promise<void> => {
  return new Promise((resolve, reject) => {
    const url = `http://localhost:8080/agent/test?prompt=${encodeURIComponent(prompt)}&uuid=${encodeURIComponent(uuid)}&model=${encodeURIComponent(model)}`;
    
    const eventSource = new EventSource(url);

    eventSource.onmessage = (event) => {
      if (event.data === '[DONE]') {
        eventSource.close();
        onDone();
        resolve();
        return;
      }
      
      try {
        const parsedData = JSON.parse(event.data);
        onMessage(parsedData.content || '');
      } catch (e) {
        onMessage(event.data);
      }
    };

    eventSource.onerror = (err) => {
      console.error("EventSource failed:", err);
      const error = new Error("AI 응답을 불러올 수 없습니다. 관리자에게 문의하세요.");
      onError(error);
      eventSource.close();
      reject(error);
    };
  });
}; 