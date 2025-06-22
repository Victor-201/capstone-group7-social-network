import { useState, useEffect, useCallback } from 'react';
import { 
    getSearchHistory, 
    clearSearchHistory 
} from '../../api/searchApi';

export const useSearchHistory = () => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchHistory = useCallback(async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setError("No token provided");
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);
            const data = await getSearchHistory(token);
            setHistory(data.history || []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    const clearHistory = async () => {
        const token = localStorage.getItem('token');
        if (!token) throw new Error("No token provided");

        try {
            await clearSearchHistory(token);
            setHistory([]);
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };

    useEffect(() => {
        fetchHistory();
    }, [fetchHistory]);

    return { history, loading, error, clearHistory, refetch: fetchHistory };
};
