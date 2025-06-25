import { createContext, useContext, useState, useEffect } from 'react';
import jwtDecode  from 'jwt-decode';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    token: null,
    id: null,
    user_name: null,
    email: null,
    role: null,
  });
  const [isLoading, setIsLoading] = useState(true); // ✅ thêm trạng thái loading

  const isTokenExpired = (token) => {
    try {
      const decoded = jwtDecode(token);
      return decoded.exp * 1000 < Date.now();
    } catch {
      return true;
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && !isTokenExpired(token)) {
      const decoded = jwtDecode(token);
      setAuth({
        token,
        id: decoded.id,
        user_name: decoded.user_name,
        email: decoded.email,
        role: decoded.role,
      });
    }
    setIsLoading(false); // ✅ cập nhật sau khi kiểm tra xong
  }, []);

  const login = (data) => {
    localStorage.setItem('token', data.accessToken);
    localStorage.setItem('refresh_token', data.refreshToken);
    const decoded = jwtDecode(data.accessToken);
    setAuth({
      token: data.accessToken,
      id: decoded.id,
      user_name: decoded.user_name,
      email: decoded.email,
      role: decoded.role,
    });
  };

  const logout = () => {
    localStorage.clear();
    setAuth({
      token: null,
      id: null,
      user_name: null,
      email: null,
      role: null,
    });
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
