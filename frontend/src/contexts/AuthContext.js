import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

// API URL - Sử dụng biến môi trường nếu có hoặc mặc định là localhost:8080
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

// Tạo Context 
const AuthContext = createContext();

// Custom hook để sử dụng AuthContext
export const useAuth = () => useContext(AuthContext);

// Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Kiểm tra xem người dùng đã đăng nhập hay chưa khi component mount
  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        
        if (token && storedUser) {
          // Kiểm tra xem token có hợp lệ không
          const response = await fetch(`${API_URL}/api/auth/me`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          
          if (response.ok) {
            // Token hợp lệ
            setUser(JSON.parse(storedUser));
            setIsAuthenticated(true);
          } else {
            // Token không hợp lệ, xóa dữ liệu cũ
            localStorage.removeItem('token');
            localStorage.removeItem('user');
          }
        }
      } catch (error) {
        console.error('Auth check error:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkLoggedIn();
  }, []);

  // Hàm đăng nhập
  const login = async (username, password) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Đăng nhập thất bại');
      }
      
      // Lưu token và thông tin người dùng
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      setUser(data.user);
      setIsAuthenticated(true);
      
      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  // Hàm đăng ký
  const register = async (userData) => {
    try {
      console.log("Registering with data:", userData); // Thêm debug log
      
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });
      
      // Thêm log để kiểm tra response
      console.log("Registration response status:", response.status);
      
      const data = await response.json();
      console.log("Registration response data:", data);
      
      if (!response.ok) {
        throw new Error(data.message || 'Đăng ký thất bại');
      }
      
      // Lưu token và thông tin người dùng
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      setUser(data.user);
      setIsAuthenticated(true);
      
      return { success: true };
    } catch (error) {
      console.error("Registration error:", error);
      return { success: false, message: error.message };
    }
  };

  // Hàm cập nhật thông tin người dùng
  const updateUserInfo = (updatedUserData) => {
    setUser(prevUser => {
      const newUserData = { ...prevUser, ...updatedUserData };
      localStorage.setItem('user', JSON.stringify(newUserData));
      return newUserData;
    });
  };

  // Hàm đăng xuất
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
    navigate('/login');
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    updateUserInfo // Thêm hàm cập nhật thông tin người dùng
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;