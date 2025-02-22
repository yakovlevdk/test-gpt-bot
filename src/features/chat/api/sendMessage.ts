interface SendMessagePayload {
    chatId: string;
    message: string;
  }
  
export  const sendMessageApi = async (payload: SendMessagePayload): Promise<void> => {
    const url = 'https://bothubq.com/api/v2/message/send';
  console.log(payload);
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjIxNjBhOTAxLWJiMzYtNDIzZS05NGQ1LWVmMzM5YTcxMDQwNSIsImlzRGV2ZWxvcGVyIjp0cnVlLCJpYXQiOjE3NDAwNjA3NDEsImV4cCI6MjA1NTYzNjc0MX0.JYrAECA8EpzptOqtKIyq7gJWf83hburC9S25yF5Xt3k',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        throw new Error(`Ошибка при отправке сообщения: ${response.statusText}`);
      }
  
      const data = await response.json();
      console.log('Сообщение успешно отправлено:', data);
    } catch (error) {
      console.error('Ошибка при отправке сообщения:', error);
    }
  };