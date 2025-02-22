
export const changeModel = async ({id, modelId} : {id: string, modelId: string}): Promise<void> => {
    const url = `https://bothubq.com/api/v2/chat/${id}`;
  
    try {
      const response = await fetch(url, {
        method: 'PATCH',
        headers: {
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjIxNjBhOTAxLWJiMzYtNDIzZS05NGQ1LWVmMzM5YTcxMDQwNSIsImlzRGV2ZWxvcGVyIjp0cnVlLCJpYXQiOjE3NDAwNjA3NDEsImV4cCI6MjA1NTYzNjc0MX0.JYrAECA8EpzptOqtKIyq7gJWf83hburC9S25yF5Xt3k',
          'Content-Type': 'application/json',
        },  
        body: JSON.stringify({ modelId }),
      });
  
      if (!response.ok) {
        throw new Error(`Ошибка при обновлении чата: ${response.statusText}`);
      }
  
      const data = await response.json();
      console.log('Чат успешно обновлен:', data);
    } catch (error) {
      console.error('Ошибка при обновлении чата:', error);
    }
  };