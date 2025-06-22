import { useState, useEffect, useCallback } from 'react';
import { 
    togglePostLike, 
    getPostLikes, 
    checkPostLikeStatus
} from '../../api/likeApi';

export const usePostLikes = (postId) => {
    const [likes, setLikes] = useState([]);
    const [isLiked, setIsLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchPostLikes = useCallback(async () => {
        if (!postId) {
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
            
            const [likesData, statusData] = await Promise.all([
                getPostLikes(token, postId),
                checkPostLikeStatus(token, postId)
            ]);
            
            setLikes(likesData.likes || []);
            setLikeCount(likesData.total || 0);
            setIsLiked(statusData.isLiked || false);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [postId]);

    const toggleLike = async () => {
        const token = localStorage.getItem('token');
        if (!token) throw new Error("No token provided");

        try {
            const data = await togglePostLike(token, postId);
            
            // Optimistic update
            setIsLiked(!isLiked);
            setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
            
            return data;
        } catch (err) {
            // Revert optimistic update on error
            setIsLiked(isLiked);
            setLikeCount(likeCount);
            throw err;
        }
    };

    useEffect(() => {
        fetchPostLikes();
    }, [fetchPostLikes]);

    return { 
        likes, 
        isLiked, 
        likeCount, 
        loading, 
        error, 
        toggleLike,
        refetch: fetchPostLikes 
    };
};
