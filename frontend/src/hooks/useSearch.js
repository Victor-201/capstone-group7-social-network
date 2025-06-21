import { useState, useEffect, useCallback } from 'react';
import { 
    searchUsers, 
    searchPosts, 
    globalSearch, 
    getSearchHistory, 
    clearSearchHistory 
} from '../api/searchApi';

// Hook cho search users
export const useSearchUsers = (query, page = 1, limit = 10) => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [hasMore, setHasMore] = useState(true);

    const searchForUsers = useCallback(async (searchQuery, pageNum = 1, isLoadMore = false) => {
        if (!searchQuery.trim()) {
            setUsers([]);
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
            
            const data = await searchUsers(token, searchQuery, pageNum, limit);
            
            if (isLoadMore) {
                setUsers(prev => [...prev, ...(data.users || [])]);
            } else {
                setUsers(data.users || []);
            }
            
            setHasMore(data.hasMore || false);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [limit]);

    useEffect(() => {
        if (query) {
            searchForUsers(query, page);
        } else {
            setUsers([]);
        }
    }, [searchForUsers, query, page]);

    const loadMore = () => {
        if (hasMore && !loading && query) {
            const nextPage = Math.floor(users.length / limit) + 1;
            searchForUsers(query, nextPage, true);
        }
    };

    return { users, loading, error, hasMore, loadMore };
};

// Hook cho search posts
export const useSearchPosts = (query, page = 1, limit = 10) => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [hasMore, setHasMore] = useState(true);

    const searchForPosts = useCallback(async (searchQuery, pageNum = 1, isLoadMore = false) => {
        if (!searchQuery.trim()) {
            setPosts([]);
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
            
            const data = await searchPosts(token, searchQuery, pageNum, limit);
            
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
        if (query) {
            searchForPosts(query, page);
        } else {
            setPosts([]);
        }
    }, [searchForPosts, query, page]);

    const loadMore = () => {
        if (hasMore && !loading && query) {
            const nextPage = Math.floor(posts.length / limit) + 1;
            searchForPosts(query, nextPage, true);
        }
    };

    return { posts, loading, error, hasMore, loadMore };
};

// Hook cho global search
export const useGlobalSearch = (query, type = 'all', page = 1, limit = 10) => {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [hasMore, setHasMore] = useState(true);

    const performGlobalSearch = useCallback(async (searchQuery, searchType, pageNum = 1, isLoadMore = false) => {
        if (!searchQuery.trim()) {
            setResults([]);
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
            
            const data = await globalSearch(token, searchQuery, searchType, pageNum, limit);
            
            if (isLoadMore) {
                setResults(prev => [...prev, ...(data.results || [])]);
            } else {
                setResults(data.results || []);
            }
            
            setHasMore(data.hasMore || false);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [limit]);

    useEffect(() => {
        if (query) {
            performGlobalSearch(query, type, page);
        } else {
            setResults([]);
        }
    }, [performGlobalSearch, query, type, page]);

    const loadMore = () => {
        if (hasMore && !loading && query) {
            const nextPage = Math.floor(results.length / limit) + 1;
            performGlobalSearch(query, type, nextPage, true);
        }
    };

    return { results, loading, error, hasMore, loadMore };
};

// Hook cho search history
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
