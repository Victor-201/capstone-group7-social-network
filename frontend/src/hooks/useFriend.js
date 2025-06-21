import { useState, useEffect, useCallback } from 'react';
import { 
    sendFriendRequest, 
    acceptFriendRequest, 
    rejectFriendRequest, 
    cancelFriendRequest,
    unfriend,
    getFriends,
    getSentRequests,
    getReceivedRequests,
    getFriendshipStatus
} from '../api/friendApi';

// Hook cho danh sách bạn bè
export const useFriends = (userId = null) => {
    const [friends, setFriends] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchFriends = useCallback(async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setError("No token provided");
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);
            const data = await getFriends(token, userId);
            setFriends(data.friends || []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [userId]);

    useEffect(() => {
        fetchFriends();
    }, [fetchFriends]);

    return { friends, loading, error, refetch: fetchFriends };
};

// Hook cho friend requests
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

// Hook cho friend actions
export const useFriendActions = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const sendRequest = async (userId) => {
        const token = localStorage.getItem('token');
        if (!token) throw new Error("No token provided");

        try {
            setLoading(true);
            setError(null);
            const data = await sendFriendRequest(token, userId);
            return data;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const acceptRequest = async (requestId) => {
        const token = localStorage.getItem('token');
        if (!token) throw new Error("No token provided");

        try {
            setLoading(true);
            setError(null);
            const data = await acceptFriendRequest(token, requestId);
            return data;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const rejectRequest = async (requestId) => {
        const token = localStorage.getItem('token');
        if (!token) throw new Error("No token provided");

        try {
            setLoading(true);
            setError(null);
            const data = await rejectFriendRequest(token, requestId);
            return data;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const cancelRequest = async (requestId) => {
        const token = localStorage.getItem('token');
        if (!token) throw new Error("No token provided");

        try {
            setLoading(true);
            setError(null);
            const data = await cancelFriendRequest(token, requestId);
            return data;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const unfriendUser = async (friendId) => {
        const token = localStorage.getItem('token');
        if (!token) throw new Error("No token provided");

        try {
            setLoading(true);
            setError(null);
            const data = await unfriend(token, friendId);
            return data;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        sendRequest,
        acceptRequest,
        rejectRequest,
        cancelRequest,
        unfriendUser,
        loading,
        error
    };
};

// Hook cho friendship status
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
            setError("No token provided");
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
