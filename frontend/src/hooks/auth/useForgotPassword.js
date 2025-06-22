import { useState } from 'react';
import { forgotPassword, resetPassword } from '../../api/accountApi';

export const useForgotPassword = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const sendResetEmail = async (email) => {
        try {
            setLoading(true);
            setError(null);
            const data = await forgotPassword(email);
            return data;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const resetUserPassword = async (token, newPassword) => {
        try {
            setLoading(true);
            setError(null);
            const data = await resetPassword(token, newPassword);
            return data;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { sendResetEmail, resetUserPassword, loading, error };
};
