import { useState } from 'react';
import { deleteReadNotifications } from '../../api/notificationApi';

export const useDeleteReadNotifications = () => {
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
