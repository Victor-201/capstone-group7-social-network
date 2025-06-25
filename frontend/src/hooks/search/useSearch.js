import { useCallback, useState } from 'react';
import { searchUsers, searchPosts } from '../../api/searchApi';

export const useSearch = () => {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const token = localStorage.getItem('token');

    const search = useCallback(async (query, type = "users") => {
        setLoading(true);
        setError(null);
        try {
            let data = [];
            if (type === "users") {
                data = await searchUsers(token, query);
            } else if (type === "posts") {
                data = await searchPosts(token, query);
            } else {
                throw new Error("Invalid search type");
            }
            setResults(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [token]);

    return { results, loading, error, search };
};
