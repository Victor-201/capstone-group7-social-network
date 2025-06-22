import { useState } from 'react';
import { login } from '../../api/accountApi';

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
