import { useState } from 'react';
import { markAsUnRead } from '../../api/notificationApi';

export const useMarkAsUnRead = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const token = localStorage.getItem('token');

    const unread = async (id) => {
        if (!id || !token) return null;

        setLoading(true);
        try {
            const res = await markAsUnRead(token, id);
            return res;
        } catch (err) {
            setError(err.message);
            return null;
        } finally {
            setLoading(false);
        }
    };

    return { unread, loading, error };
};

