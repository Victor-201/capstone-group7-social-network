import { useState, useEffect, useCallback } from 'react';
import { 
    searchUsers, 
    searchPosts, 
    globalSearch
} from '../../api/searchApi';

export const useSearch = (query, type = 'all', page = 1, limit = 10) => {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [hasMore, setHasMore] = useState(true);

    const performSearch = useCallback(async (searchQuery, searchType, pageNum = 1, isLoadMore = false) => {
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
            
            let data;
            switch (searchType) {
                case 'users':
                    data = await searchUsers(token, searchQuery, pageNum, limit);
                    break;
                case 'posts':
                    data = await searchPosts(token, searchQuery, pageNum, limit);
                    break;
                case 'all':
                default:
                    data = await globalSearch(token, searchQuery, searchType, pageNum, limit);
                    break;
            }
            
            if (isLoadMore) {
                setResults(prev => [...prev, ...(data.results || data.users || data.posts || [])]);
            } else {
                setResults(data.results || data.users || data.posts || []);
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
            performSearch(query, type, page);
        } else {
            setResults([]);
        }
    }, [performSearch, query, type, page]);

    const loadMore = () => {
        if (hasMore && !loading && query) {
            const nextPage = Math.floor(results.length / limit) + 1;
            performSearch(query, type, nextPage, true);
        }
    };

    return { results, loading, error, hasMore, loadMore };
};
