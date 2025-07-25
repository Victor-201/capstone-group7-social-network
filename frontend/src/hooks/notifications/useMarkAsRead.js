import { useState } from 'react';
import { markAsRead } from '../../api/notificationApi';
import { markAsUnRead } from '../../api/notificationApi';
import { markAllAsRead } from '../../api/notificationApi';

export const useMarkAsRead = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const token = localStorage.getItem('token');

    const readNoti = async (id) => {
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

    return { readNoti, loading, error };
};

export const useMarkAsUnRead = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const token = localStorage.getItem('token');

    const unreadNoti = async (id) => {
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

    return { unreadNoti, loading, error };
};


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
