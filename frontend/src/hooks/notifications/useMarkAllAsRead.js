import { useState } from 'react';
import { markAllAsRead } from '../../api/notificationApi';

export const useMarkAllAsRead = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const token = localStorage.getItem('token');

    const read = async () => {
        if (!token) return null;

        setLoading(true);
        try {
            const res = await markAllAsRead(token);
            return res;
        } catch (err) {
            setError(err.message);
            return null;
        } finally {
            setLoading(false);
        }
    };

    return { read, loading, error };
};
