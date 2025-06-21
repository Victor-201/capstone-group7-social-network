import { useState, useEffect, useCallback } from 'react';
import { 
    getNotifications, 
    markNotificationAsRead, 
    markAllNotificationsAsRead,
    deleteNotification,
    getUnreadNotificationCount
} from '../api/notificationApi';

// Hook cho notifications
export const useNotifications = (page = 1, limit = 20) => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [hasMore, setHasMore] = useState(true);

    const fetchNotifications = useCallback(async (pageNum = 1, isLoadMore = false) => {
        const token = localStorage.getItem('token');
        if (!token) {
            setError("No token provided");
            setLoading(false);
            return;
        }

        try {
            if (!isLoadMore) setLoading(true);
            setError(null);
            
            const data = await getNotifications(token, pageNum, limit);
            
            if (isLoadMore) {
                setNotifications(prev => [...prev, ...(data.notifications || [])]);
            } else {
                setNotifications(data.notifications || []);
            }
            
            setHasMore(data.hasMore || false);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [limit]);

    useEffect(() => {
        fetchNotifications(page);
    }, [fetchNotifications, page]);

    const loadMore = () => {
        if (hasMore && !loading) {
            const nextPage = Math.floor(notifications.length / limit) + 1;
            fetchNotifications(nextPage, true);
        }
    };

    return { notifications, loading, error, hasMore, loadMore, refetch: () => fetchNotifications(1) };
};

// Hook cho unread notification count
export const useUnreadNotificationCount = () => {
    const [count, setCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchUnreadCount = useCallback(async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setError("No token provided");
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);
            const data = await getUnreadNotificationCount(token);
            setCount(data.count || 0);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUnreadCount();
        
        // Set up polling for real-time updates
        const interval = setInterval(fetchUnreadCount, 30000); // Check every 30 seconds
        
        return () => clearInterval(interval);
    }, [fetchUnreadCount]);

    return { count, loading, error, refetch: fetchUnreadCount };
};

// Hook cho notification actions
export const useNotificationActions = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const markAsRead = async (notificationId) => {
        const token = localStorage.getItem('token');
        if (!token) throw new Error("No token provided");

        try {
            setLoading(true);
            setError(null);
            const data = await markNotificationAsRead(token, notificationId);
            return data;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const markAllAsRead = async () => {
        const token = localStorage.getItem('token');
        if (!token) throw new Error("No token provided");

        try {
            setLoading(true);
            setError(null);
            const data = await markAllNotificationsAsRead(token);
            return data;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const deleteNotif = async (notificationId) => {
        const token = localStorage.getItem('token');
        if (!token) throw new Error("No token provided");

        try {
            setLoading(true);
            setError(null);
            const data = await deleteNotification(token, notificationId);
            return data;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        markAsRead,
        markAllAsRead,
        deleteNotif,
        loading,
        error
    };
};
