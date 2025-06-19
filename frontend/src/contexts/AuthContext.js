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
          try {
            // Sử dụng stored user data nếu có token
            setUser(JSON.parse(storedUser));
            setIsAuthenticated(true);
          } catch (error) {
            // Nếu có lỗi khi parse user data, xóa dữ liệu cũ
            console.error('Auth check error:', error);
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');
          }
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    checkLoggedIn();
  }, []); // Remove API_URL from dependency array

  // Hàm đăng nhập
  const login = async (username, password) => {
    try {
      const response = await fetch(`${API_URL}/api/public/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ login_name: username, password })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        // Backend trả về message trong array hoặc string
        const errorMessage = Array.isArray(data.message) ? data.message.join(', ') : data.message;
        throw new Error(errorMessage || 'Đăng nhập thất bại');
      }
      
      // Lưu token và thông tin người dùng
      localStorage.setItem('token', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      
      // Decode JWT để lấy thông tin user
      const tokenPayload = JSON.parse(atob(data.accessToken.split('.')[1]));
      const user = {
        id: tokenPayload.id,
        username: tokenPayload.user_name,
        email: tokenPayload.email,
        role: tokenPayload.role
      };
      
      localStorage.setItem('user', JSON.stringify(user));
      
      setUser(user);
      setIsAuthenticated(true);
      
      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  // Hàm đăng ký
  const register = async (userData) => {
    try {
      console.log("API_URL:", API_URL);
      console.log("Registering with data:", userData);
      
      // Chuẩn bị data theo format của backend
      const registrationData = {
        full_name: userData.full_name,
        user_name: userData.user_name,
        email: userData.email,
        password: userData.password,
        confirm_password: userData.confirm_password,
        phone_number: userData.phone_number,
        gender: userData.gender,
        birth_date: userData.birth_date
      };
      
      console.log("Sending registration data:", registrationData);
      console.log("Request URL:", `${API_URL}/api/public/register`);
      
      const response = await fetch(`${API_URL}/api/public/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(registrationData)
      });
      
      console.log("Registration response status:", response.status);
      console.log("Registration response ok:", response.ok);
      
      const data = await response.json();
      console.log("Registration response data:", data);
      
      if (!response.ok) {
        // Backend trả về message trong array hoặc string
        const errorMessage = Array.isArray(data.message) ? data.message.join(', ') : data.message;
        throw new Error(errorMessage || 'Đăng ký thất bại');
      }
      
      // Đăng ký thành công, tự động đăng nhập
      const loginResult = await login(userData.username, userData.password);
      if (!loginResult.success) {
        throw new Error('Đăng ký thành công nhưng không thể đăng nhập tự động');
      }
      
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
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
    navigate('/login');
  };

  // Friendship Functions
  const sendFriendRequest = async (receiverId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/friends/request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ receiverId })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Không thể gửi lời mời kết bạn');
      }
      
      return { success: true, message: data.message };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const respondToFriendRequest = async (requesterId, action) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/friends/respond`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ requesterId, action })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Không thể phản hồi lời mời kết bạn');
      }
      
      return { success: true, message: data.message };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const removeFriend = async (friendId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/friends/${friendId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Không thể xóa bạn bè');
      }
      
      return { success: true, message: data.message };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const getFriendsList = async (userId = null) => {
    try {
      const token = localStorage.getItem('token');
      const url = userId 
        ? `${API_URL}/api/friends/list/${userId}` 
        : `${API_URL}/api/friends/list`;
        
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Không thể lấy danh sách bạn bè');
      }
      
      const friends = await response.json();
      return { success: true, friends };
    } catch (error) {
      return { success: false, message: error.message, friends: [] };
    }
  };

  const getPendingFriendRequests = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/friends/pending`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Không thể lấy danh sách lời mời kết bạn');
      }
      
      const requests = await response.json();
      return { success: true, requests };
    } catch (error) {
      return { success: false, message: error.message, requests: [] };
    }
  };

  // Follower Functions  
  const followUser = async (followedId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/follow/${followedId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Không thể theo dõi người dùng');
      }
      
      return { success: true, message: data.message };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const unfollowUser = async (followedId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/follow/${followedId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Không thể hủy theo dõi người dùng');
      }
      
      return { success: true, message: data.message };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const getFollowers = async (userId = null) => {
    try {
      const token = localStorage.getItem('token');
      const url = userId 
        ? `${API_URL}/api/follow/followers/${userId}` 
        : `${API_URL}/api/follow/followers`;
        
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Không thể lấy danh sách người theo dõi');
      }
      
      const followers = await response.json();
      return { success: true, followers };
    } catch (error) {
      return { success: false, message: error.message, followers: [] };
    }
  };

  const getFollowing = async (userId = null) => {
    try {
      const token = localStorage.getItem('token');
      const url = userId 
        ? `${API_URL}/api/follow/following/${userId}` 
        : `${API_URL}/api/follow/following`;
        
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Không thể lấy danh sách đang theo dõi');
      }
      
      const following = await response.json();
      return { success: true, following };
    } catch (error) {
      return { success: false, message: error.message, following: [] };
    }
  };

  const checkFollowStatus = async (followedId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/follow/check/${followedId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Không thể kiểm tra trạng thái theo dõi');
      }
      
      const data = await response.json();
      return { success: true, isFollowing: data.isFollowing };
    } catch (error) {
      return { success: false, message: error.message, isFollowing: false };
    }
  };

  // Hàm quên mật khẩu - gửi OTP
  const forgotPassword = async (email) => {
    try {
      const response = await fetch(`${API_URL}/api/public/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        const errorMessage = Array.isArray(data.message) ? data.message.join(', ') : data.message;
        throw new Error(errorMessage || 'Gửi OTP thất bại');
      }
      
      return { success: true, message: data.message };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  // Hàm verify OTP
  const verifyOtp = async (email, otpCode) => {
    try {
      const response = await fetch(`${API_URL}/api/public/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, otp_code: otpCode })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        const errorMessage = Array.isArray(data.message) ? data.message.join(', ') : data.message;
        throw new Error(errorMessage || 'Xác thực OTP thất bại');
      }
      
      return { success: true, token: data.token, message: data.message };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  // Hàm reset mật khẩu
  const resetPassword = async (newPassword, token) => {
    try {
      const response = await fetch(`${API_URL}/api/public/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ newPassword })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        const errorMessage = Array.isArray(data.message) ? data.message.join(', ') : data.message;
        throw new Error(errorMessage || 'Đặt lại mật khẩu thất bại');
      }
      
      return { success: true, message: data.message };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    updateUserInfo, // Thêm hàm cập nhật thông tin người dùng
    // Forgot password functions
    forgotPassword,
    verifyOtp,
    resetPassword,
    // Friendship functions
    sendFriendRequest,
    respondToFriendRequest,
    removeFriend,
    getFriendsList,
    getPendingFriendRequests,
    // Follower functions
    followUser,
    unfollowUser,
    getFollowers,
    getFollowing,
    checkFollowStatus,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;