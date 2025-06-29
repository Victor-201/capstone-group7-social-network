import { useState, useEffect, useCallback } from 'react';
import { 
    getFriends,
    getFriendshipStatus
} from '../../api/friendApi';

export const useFriends = (userId = null, autoFetch = false) => {
    const [friends, setFriends] = useState([]);
    const [loading, setLoading] = useState(autoFetch);
    const [error, setError] = useState(null);

    const fetchFriends = useCallback(async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setError("Vui lòng đăng nhập để xem danh sách bạn bè");
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);
            const data = await getFriends(token, userId);
            // Handle multiple possible response formats
            let friendsList = [];
            if (data.result && Array.isArray(data.result)) {
                friendsList = data.result;
            } else if (data.friends && Array.isArray(data.friends)) {
                friendsList = data.friends;
            } else if (Array.isArray(data)) {
                friendsList = data;
            }
            setFriends(friendsList);
        } catch (err) {
            // If it's a "No friends found" error, just set empty array
            if (err.message.includes('No friends found') || err.message.includes('not found') || err.status === 404) {
                setFriends([]);
                setError(null);
            } else {
                setError(err.message);
                console.error('Error fetching friends:', err);
            }
        } finally {
            setLoading(false);
        }
    }, [userId]);

    // Chỉ fetch tự động nếu autoFetch = true
    useEffect(() => {
        if (autoFetch) {
            fetchFriends();
        }
    }, [autoFetch, fetchFriends]);

    return { friends, loading, error, refetch: fetchFriends };
};

export const useFriendshipStatus = (userId) => {
    const [status, setStatus] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchStatus = useCallback(async () => {
        if (!userId) {
            setLoading(false);
            return;
        }

        const token = localStorage.getItem('token');
        if (!token) {
            setError("Vui lòng đăng nhập để kiểm tra trạng thái kết bạn");
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);
            const data = await getFriendshipStatus(token, userId);
            setStatus(data.status);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [userId]);

    useEffect(() => {
        fetchStatus();
    }, [fetchStatus]);

    return { status, loading, error, refetch: fetchStatus };
};
