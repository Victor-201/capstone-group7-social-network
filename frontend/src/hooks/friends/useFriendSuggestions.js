import { useState, useEffect, useCallback } from 'react';
import { getFriendSuggestions } from '../../api/friendApi';

export const useFriendSuggestions = (autoFetch = false) => {
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchSuggestions = useCallback(async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setError("Vui lòng đăng nhập để xem gợi ý kết bạn");
            setLoading(false);
            return;
        }
        
        setLoading(true);
        setError(null);
        
        try {
            const result = await getFriendSuggestions(token);
            setSuggestions(result.data || result);
        } catch (err) {
            setError(err.message);
            console.error('Error fetching friend suggestions:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (autoFetch) {
            fetchSuggestions();
        }
    }, [autoFetch, fetchSuggestions]);

    const refetch = useCallback(() => {
        fetchSuggestions();
    }, [fetchSuggestions]);

    return {
        suggestions,
        loading,
        error,
        refetch
    };
};
