import { useState, useEffect, useCallback } from 'react';
import { 
    getFollowers,
    getFollowing,
    followUser,
    unfollowUser
} from '../../api/followApi';

export const useFollow = (userId = null, autoFetch = false) => {
    const [followers, setFollowers] = useState([]);
    const [following, setFollowing] = useState([]);
    const [loading, setLoading] = useState(autoFetch);
    const [error, setError] = useState(null);

    const fetchFollowData = useCallback(async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setError("No token provided");
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);
            
            const [followersData, followingData] = await Promise.all([
                getFollowers(token, userId),
                getFollowing(token, userId)
            ]);
            
            setFollowers(followersData.data || []);
            setFollowing(followingData.data || []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [userId]);

    useEffect(() => {
        if (autoFetch) {
            fetchFollowData();
        }
    }, [autoFetch, fetchFollowData]);

    const follow = async (targetUserId) => {
        const token = localStorage.getItem('token');
        if (!token) throw new Error("No token provided");

        try {
            setLoading(true);
            setError(null);
            await followUser(token, targetUserId);
            // Refresh data after follow
            await fetchFollowData();
            return { success: true };
        } catch (err) {
            setError(err.message);
            return { success: false, message: err.message };
        } finally {
            setLoading(false);
        }
    };

    const unfollow = async (targetUserId) => {
        const token = localStorage.getItem('token');
        if (!token) throw new Error("No token provided");

        try {
            setLoading(true);
            setError(null);
            await unfollowUser(token, targetUserId);
            // Update local state
            setFollowing(prev => prev.filter(user => user.id !== targetUserId));
            return { success: true };
        } catch (err) {
            setError(err.message);
            return { success: false, message: err.message };
        } finally {
            setLoading(false);
        }
    };

    const isUserFollowed = (targetUserId) => {
        return following.some(user => user.id === targetUserId);
    };

    return { 
        followers, 
        following, 
        loading, 
        error, 
        follow, 
        unfollow, 
        isUserFollowed,
        refetch: fetchFollowData 
    };
};
