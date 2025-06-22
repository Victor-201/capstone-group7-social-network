import { useState } from 'react';
import { register } from '../../api/accountApi';
import { useLogin } from './useLogin';

export const useRegister = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { loginUser } = useLogin();

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
            const loginData = {
                login_name: userData.username || userData.email,
                password: userData.password
            };
            try {
                await loginUser(loginData);
            } catch (error) {
                console.error("Không thể tự động đăng nhập:", error);
            }
            setLoading(false);
        }
    };

    return { registerUser, loading, error };
};
