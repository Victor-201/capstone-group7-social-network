import { useState } from 'react';
import { deleteNotification, deleteReadNotifications } from '../../api/notificationApi';

export const useDeleteNotification = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const token = localStorage.getItem('token');

    const deleteNoti = async (id) => {
        if (!id || !token) return null;

        setLoading(true);
        try {
            const res = await deleteNotification(token, id); 
            return res;
        } catch (err) {
            setError(err.message || 'Lỗi xóa thông báo');
            return null;
        } finally {
            setLoading(false);
        }
    };

    return { deleteNoti, loading, error }; 
};


export const useDeleteAllReadNotifications = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const token = localStorage.getItem('token');

    const deleteRead = async () => {
        if (!token) {
            setError('No token provided');
            return;
        }

        try {
            setLoading(true);
            await deleteReadNotifications(token);
        } catch (err) {
            console.error('Delete error:', err);
            setError(err.message || 'Failed to delete read notifications');
        } finally {
            setLoading(false);
        }
    };

    return { deleteRead, loading, error };
};
