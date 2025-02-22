export const getModelList = async () => {
    const response = await fetch('https://bothubq.com/api/v2/model/list', {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjIxNjBhOTAxLWJiMzYtNDIzZS05NGQ1LWVmMzM5YTcxMDQwNSIsImlzRGV2ZWxvcGVyIjp0cnVlLCJpYXQiOjE3NDAwNjA3NDEsImV4cCI6MjA1NTYzNjc0MX0.JYrAECA8EpzptOqtKIyq7gJWf83hburC9S25yF5Xt3k',
            'Content-Type': 'application/json'
        },

    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch model list');
    }

    const responseData = await response.json();

    return responseData; 
};
