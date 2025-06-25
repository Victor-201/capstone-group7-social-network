import { useState, useEffect, useCallback } from 'react';
import { getMutualFriends } from '../../api/friendApi';

export const useMutualFriends = (userId) => {
    const [mutualFriends, setMutualFriends] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchMutualFriends = useCallback(async () => {
        if (!userId) return;
        
        const token = localStorage.getItem('token');
        if (!token) {
            setError("Vui lòng đăng nhập để xem bạn bè chung");
            setLoading(false);
            return;
        }
        
        setLoading(true);
        setError(null);
        
        try {
            const result = await getMutualFriends(token, userId);
            setMutualFriends(result.mutualFriends || []);
        } catch (err) {
            setError(err.message);
            console.error('Error fetching mutual friends:', err);
        } finally {
            setLoading(false);
        }
    }, [userId]);

    useEffect(() => {
        fetchMutualFriends();
    }, [fetchMutualFriends]);

    return { 
        mutualFriends, 
        loading, 
        error, 
        refetch: fetchMutualFriends 
    };
};
