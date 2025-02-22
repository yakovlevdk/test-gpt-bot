import { fetchEventSource } from "@microsoft/fetch-event-source";

interface StreamOptions {
  url: string;
  onMessage: (data: any) => void;
  onError?: (error: any) => void;
}


export const startEventStream = ({ url,  onMessage, onError }: StreamOptions) => {
  fetchEventSource(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjIxNjBhOTAxLWJiMzYtNDIzZS05NGQ1LWVmMzM5YTcxMDQwNSIsImlzRGV2ZWxvcGVyIjp0cnVlLCJpYXQiOjE3NDAwNjA3NDEsImV4cCI6MjA1NTYzNjc0MX0.JYrAECA8EpzptOqtKIyq7gJWf83hburC9S25yF5Xt3k`,
    },
    onmessage(event) {
      try {
        const data = JSON.parse(event.data);
        onMessage(data);
      } catch (error) {
        console.error("Ошибка при обработке данных из потока:", error);
        if (onError) onError(error);
      }
    },
    onerror(error) {
      console.error("Ошибка при запросе данных:", error);
      if (onError) onError(error);
    },
  });
};
