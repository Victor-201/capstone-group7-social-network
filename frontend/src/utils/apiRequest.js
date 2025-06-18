const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

// Helper function để làm API request với auto token refresh
export const apiRequest = async (url, options = {}) => {
  const token = localStorage.getItem('token');
  
  // Thêm authorization header nếu có token
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  
  try {
    const response = await fetch(`${API_URL}${url}`, {
      ...options,
      headers,
    });
    
    // Nếu token hết hạn (401), thử refresh token
    if (response.status === 401 && token) {
      const refreshToken = localStorage.getItem('refreshToken');
      
      if (refreshToken) {
        try {
          const refreshResponse = await fetch(`${API_URL}/api/auth/refresh-token`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refreshToken }),
          });
          
          if (refreshResponse.ok) {
            const refreshData = await refreshResponse.json();
            localStorage.setItem('token', refreshData.accessToken);
            localStorage.setItem('refreshToken', refreshData.refreshToken);
            
            // Retry original request với token mới
            headers.Authorization = `Bearer ${refreshData.accessToken}`;
            return await fetch(`${API_URL}${url}`, {
              ...options,
              headers,
            });
          } else {
            // Refresh token cũng hết hạn, xóa tokens và redirect về login
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');
            window.location.href = '/login';
            throw new Error('Session expired. Please login again.');
          }
        } catch (error) {
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');
          window.location.href = '/login';
          throw new Error('Session expired. Please login again.');
        }
      } else {
        // Không có refresh token
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
        throw new Error('Session expired. Please login again.');
      }
    }
    
    return response;
  } catch (error) {
    throw error;
  }
};

export default apiRequest;
