import { useState, useEffect, useCallback } from 'react';
import { 
    createPost, 
    getAllPosts, 
    getPostById, 
    getUserPosts,
    updatePost,
    deletePost,
    getNewsfeed
} from '../api/postApi';

// Hook cho newsfeed
export const useNewsfeed = (page = 1, limit = 10) => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [hasMore, setHasMore] = useState(true);

    const fetchNewsfeed = useCallback(async (pageNum = 1, isLoadMore = false) => {
        const token = localStorage.getItem('token');
        if (!token) {
            setError("No token provided");
            setLoading(false);
            return;
        }

        try {
            if (!isLoadMore) setLoading(true);
            setError(null);
            
            const data = await getNewsfeed(token, pageNum, limit);
            
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
    }, [limit]);

    useEffect(() => {
        fetchNewsfeed(page);
    }, [fetchNewsfeed, page]);

    const loadMore = () => {
        if (hasMore && !loading) {
            const nextPage = Math.floor(posts.length / limit) + 1;
            fetchNewsfeed(nextPage, true);
        }
    };

    return { posts, loading, error, hasMore, loadMore, refetch: () => fetchNewsfeed(1) };
};

// Hook cho user posts
export const useUserPosts = (userId, page = 1, limit = 10) => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [hasMore, setHasMore] = useState(true);

    const fetchUserPosts = useCallback(async (pageNum = 1, isLoadMore = false) => {
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
            if (!isLoadMore) setLoading(true);
            setError(null);
            
            const data = await getUserPosts(token, userId, pageNum, limit);
            
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
    }, [userId, limit]);

    useEffect(() => {
        fetchUserPosts(page);
    }, [fetchUserPosts, page]);

    const loadMore = () => {
        if (hasMore && !loading) {
            const nextPage = Math.floor(posts.length / limit) + 1;
            fetchUserPosts(nextPage, true);
        }
    };

    return { posts, loading, error, hasMore, loadMore, refetch: () => fetchUserPosts(1) };
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

// Hook cho post actions
export const usePostActions = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const createNewPost = async (postData) => {
        const token = localStorage.getItem('token');
        if (!token) throw new Error("No token provided");

        try {
            setLoading(true);
            setError(null);
            const data = await createPost(token, postData);
            return data;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const updateExistingPost = async (postId, postData) => {
        const token = localStorage.getItem('token');
        if (!token) throw new Error("No token provided");

        try {
            setLoading(true);
            setError(null);
            const data = await updatePost(token, postId, postData);
            return data;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const deleteExistingPost = async (postId) => {
        const token = localStorage.getItem('token');
        if (!token) throw new Error("No token provided");

        try {
            setLoading(true);
            setError(null);
            const data = await deletePost(token, postId);
            return data;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        createNewPost,
        updateExistingPost,
        deleteExistingPost,
        loading,
        error
    };
};
