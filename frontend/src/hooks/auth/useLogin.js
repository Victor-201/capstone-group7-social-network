import { useState } from 'react';
import { login } from '../../api/accountApi';
import { useNavigate } from 'react-router-dom';
import { ROUTERS } from '../../utils/router';

export const useLogin = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const loginUser = async (credentials) => {
        try {
            setLoading(true);
            setError(null);
            const data = await login(credentials);
            console.log("Login data:", data);
            
            // Lưu token vào localStorage
            if (data.accessToken) {
                localStorage.setItem('token', data.accessToken);
                localStorage.setItem('refreshToken', data.refreshToken);
                navigate(ROUTERS.USER.HOME);
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
