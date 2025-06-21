import { useState, useEffect, useCallback } from 'react';
import { 
    createComment, 
    getPostComments, 
    updateComment, 
    deleteComment,
    getCommentById
} from '../api/commentApi';

// Hook cho post comments
export const usePostComments = (postId, page = 1, limit = 10) => {
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [hasMore, setHasMore] = useState(true);

    const fetchComments = useCallback(async (pageNum = 1, isLoadMore = false) => {
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
            if (!isLoadMore) setLoading(true);
            setError(null);
            
            const data = await getPostComments(token, postId, pageNum, limit);
            
            if (isLoadMore) {
                setComments(prev => [...prev, ...(data.comments || [])]);
            } else {
                setComments(data.comments || []);
            }
            
            setHasMore(data.hasMore || false);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [postId, limit]);

    useEffect(() => {
        fetchComments(page);
    }, [fetchComments, page]);

    const loadMore = () => {
        if (hasMore && !loading) {
            const nextPage = Math.floor(comments.length / limit) + 1;
            fetchComments(nextPage, true);
        }
    };

    return { comments, loading, error, hasMore, loadMore, refetch: () => fetchComments(1) };
};

// Hook cho single comment
export const useComment = (commentId) => {
    const [comment, setComment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchComment = useCallback(async () => {
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
            const data = await getCommentById(token, commentId);
            setComment(data.comment);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [commentId]);

    useEffect(() => {
        fetchComment();
    }, [fetchComment]);

    return { comment, loading, error, refetch: fetchComment };
};

// Hook cho comment actions
export const useCommentActions = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const createNewComment = async (commentData) => {
        const token = localStorage.getItem('token');
        if (!token) throw new Error("No token provided");

        try {
            setLoading(true);
            setError(null);
            const data = await createComment(token, commentData);
            return data;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const updateExistingComment = async (commentId, content) => {
        const token = localStorage.getItem('token');
        if (!token) throw new Error("No token provided");

        try {
            setLoading(true);
            setError(null);
            const data = await updateComment(token, commentId, content);
            return data;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const deleteExistingComment = async (commentId) => {
        const token = localStorage.getItem('token');
        if (!token) throw new Error("No token provided");

        try {
            setLoading(true);
            setError(null);
            const data = await deleteComment(token, commentId);
            return data;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        createNewComment,
        updateExistingComment,
        deleteExistingComment,
        loading,
        error
    };
};
