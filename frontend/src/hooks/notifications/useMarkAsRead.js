import { useState } from 'react';
import { markAsRead } from '../../api/notificationApi';

export const useMarkAsRead = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const token = localStorage.getItem('token');

    const read = async (id) => {
        if (!id || !token) return null;

        setLoading(true);
        try {
            const res = await markAsRead(token, id);
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

