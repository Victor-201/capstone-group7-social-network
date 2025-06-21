import { useState } from 'react';
import { register } from '../../api/accountApi';

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
