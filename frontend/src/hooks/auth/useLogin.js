import { useState } from 'react';
import { singin } from '../../api/accountApi';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import {ROUTERS } from '../../utils/router';

export const useLogin = () => {
    const {login}= useAuth();
   const navigator = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
   
    const loginUser = async (credentials) => {
        try {
            setLoading(true);
            setError(null);
            const data = await singin(credentials);
            console.log("Login data:", data);
            
            // Lưu token vào localStorage
            if (data) {
                login(data );
                navigator(ROUTERS.USER.HOME);
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