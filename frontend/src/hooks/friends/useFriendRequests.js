import { useState, useEffect, useCallback } from 'react';
import { 
    getSentRequests,
    getReceivedRequests
} from '../../api/friendApi';

export const useFriendRequests = () => {
    const [sentRequests, setSentRequests] = useState([]);
    const [receivedRequests, setReceivedRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchRequests = useCallback(async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setError("No token provided");
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);
            const [sentData, receivedData] = await Promise.all([
                getSentRequests(token),
                getReceivedRequests(token)
            ]);
            setSentRequests(sentData.requests || []);
            setReceivedRequests(receivedData.requests || []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchRequests();
    }, [fetchRequests]);

    return { sentRequests, receivedRequests, loading, error, refetch: fetchRequests };
};
