import { useState, useEffect } from 'react';
import { login, register, logout } from '../api/accountApi';

// Hook cho login
export const useLogin = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const loginUser = async (credentials) => {
        try {
            setLoading(true);
            setError(null);
            const data = await login(credentials);
            
            // Lưu token vào localStorage
            if (data.token) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('refreshToken', data.refreshToken);
            }
            
            return data;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { loginUser, loading, error };
};

// Hook cho register
export const useRegister = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const registerUser = async (userData) => {
        try {
            setLoading(true);
            setError(null);
            const data = await register(userData);
            return data;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { registerUser, loading, error };
};

// Hook cho logout
export const useLogoutAccount = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const logoutUser = async () => {
        try {
            setLoading(true);
            setError(null);
            const token = localStorage.getItem('token');
            
            if (token) {
                await logout(token);
            }
            
            // Xóa token khỏi localStorage
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
            
            return true;
        } catch (err) {
            setError(err.message);
            // Vẫn xóa token dù có lỗi
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { logoutUser, loading, error };
};
