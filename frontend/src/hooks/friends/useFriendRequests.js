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
            
            // Handle different response formats
            setSentRequests(sentData.requests || sentData.result || sentData || []);
            setReceivedRequests(receivedData.requests || receivedData.result || receivedData || []);
        } catch (err) {
            console.error('Error fetching friend requests:', err);
            setError(err.message);
            // Set empty arrays on error instead of keeping previous state
            setSentRequests([]);
            setReceivedRequests([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchRequests();
    }, [fetchRequests]);

    return { sentRequests, receivedRequests, loading, error, refetch: fetchRequests };
};
