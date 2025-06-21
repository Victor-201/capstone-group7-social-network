import { useState, useEffect, useCallback } from 'react';
import { 
    getAllPosts, 
    getUserPosts,
    getNewsfeed,
    getPostById
} from '../../api/postApi';

// Hook cho newsfeed
export const usePosts = (type = 'newsfeed', userId = null, page = 1, limit = 10) => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [hasMore, setHasMore] = useState(true);

    const fetchPosts = useCallback(async (pageNum = 1, isLoadMore = false) => {
        const token = localStorage.getItem('token');
        if (!token) {
            setError("No token provided");
            setLoading(false);
            return;
        }

        try {
            if (!isLoadMore) setLoading(true);
            setError(null);
            
            let data;
            switch (type) {
                case 'newsfeed':
                    data = await getNewsfeed(token, pageNum, limit);
                    break;
                case 'user':
                    if (!userId) throw new Error("User ID required for user posts");
                    data = await getUserPosts(token, userId, pageNum, limit);
                    break;
                case 'all':
                    data = await getAllPosts(token, pageNum, limit);
                    break;
                default:
                    data = await getNewsfeed(token, pageNum, limit);
            }
            
            if (isLoadMore) {
                setPosts(prev => [...prev, ...(data.posts || [])]);
            } else {
                setPosts(data.posts || []);
            }
            
            setHasMore(data.hasMore || false);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [type, userId, limit]);

    useEffect(() => {
        fetchPosts(page);
    }, [fetchPosts, page]);

    const loadMore = () => {
        if (hasMore && !loading) {
            const nextPage = Math.floor(posts.length / limit) + 1;
            fetchPosts(nextPage, true);
        }
    };

    return { posts, loading, error, hasMore, loadMore, refetch: () => fetchPosts(1) };
};

// Hook cho single post
export const usePost = (postId) => {
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchPost = useCallback(async () => {
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
            const data = await getPostById(token, postId);
            setPost(data.post);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [postId]);

    useEffect(() => {
        fetchPost();
    }, [fetchPost]);

    return { post, loading, error, refetch: fetchPost };
};
