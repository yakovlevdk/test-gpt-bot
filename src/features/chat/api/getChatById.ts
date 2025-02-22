export const getChatById = async (id: string) => {
    const response = await fetch(`https://bothubq.com/api/v2/chat/${id}/messages`, {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjIxNjBhOTAxLWJiMzYtNDIzZS05NGQ1LWVmMzM5YTcxMDQwNSIsImlzRGV2ZWxvcGVyIjp0cnVlLCJpYXQiOjE3NDAwNjA3NDEsImV4cCI6MjA1NTYzNjc0MX0.JYrAECA8EpzptOqtKIyq7gJWf83hburC9S25yF5Xt3k',
            'Content-Type': 'application/json'
        }
    });
    console.log('Response Status:', response.status);
    console.log('Response Headers:', [...response.headers]);

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch chat list');
    }

    const responseData = await response.json();
    console.log('Response Data:', responseData); 

    return responseData; 
};
