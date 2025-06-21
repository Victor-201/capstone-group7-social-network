import { useState, useEffect, useCallback } from 'react';
import { 
    togglePostLike, 
    toggleCommentLike, 
    getPostLikes, 
    getCommentLikes,
    checkPostLikeStatus,
    checkCommentLikeStatus
} from '../api/likeApi';

// Hook cho post likes
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

    useEffect(() => {
        fetchPostLikes();
    }, [fetchPostLikes]);

    return { likes, isLiked, likeCount, loading, error, refetch: fetchPostLikes };
};

// Hook cho comment likes
export const useCommentLikes = (commentId) => {
    const [likes, setLikes] = useState([]);
    const [isLiked, setIsLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchCommentLikes = useCallback(async () => {
        if (!commentId) {
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
                getCommentLikes(token, commentId),
                checkCommentLikeStatus(token, commentId)
            ]);
            
            setLikes(likesData.likes || []);
            setLikeCount(likesData.total || 0);
            setIsLiked(statusData.isLiked || false);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [commentId]);

    useEffect(() => {
        fetchCommentLikes();
    }, [fetchCommentLikes]);

    return { likes, isLiked, likeCount, loading, error, refetch: fetchCommentLikes };
};

// Hook cho like actions
export const useLikeActions = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const togglePostLikeAction = async (postId) => {
        const token = localStorage.getItem('token');
        if (!token) throw new Error("No token provided");

        try {
            setLoading(true);
            setError(null);
            const data = await togglePostLike(token, postId);
            return data;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const toggleCommentLikeAction = async (commentId) => {
        const token = localStorage.getItem('token');
        if (!token) throw new Error("No token provided");

        try {
            setLoading(true);
            setError(null);
            const data = await toggleCommentLike(token, commentId);
            return data;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        togglePostLikeAction,
        toggleCommentLikeAction,
        loading,
        error
    };
};
