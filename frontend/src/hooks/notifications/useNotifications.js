import { useState, useEffect, useCallback } from 'react';
import { getNotifications } from '../../api/notificationApi';

export const useNotifications = (filter = 'all') => {
    const [notifications, setNotifications] = useState([]);
    const [filteredNotis, setFilteredNotis] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem('token');
        if (!token) {
            setError('No token provided');
            setLoading(false);
            return;
        }

        try {
            const data = await getNotifications(token);
            setNotifications(data);

            const filtered =
                filter === 'unread'
                    ? data.filter(n => !n.is_read)
                    : data;
            setFilteredNotis(filtered);
        } catch (err) {
            console.error('Error fetching notifications:', err);
            setError(err.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    }, [filter]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return { notifications: filteredNotis, loading, error };
};
