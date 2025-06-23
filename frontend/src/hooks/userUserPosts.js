// src/hooks/useUserPosts.js
import { useState, useEffect } from 'react';
import { getUserPosts } from '../api/postApi'; // import API riêng

const useUserPosts = () => {
  const [posts, setPosts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error("No token found");
                setError("No token provided");
                return;
            }
            
            try {
        const data = await getUserPosts(token); // gọi API đã tách
        setPosts(data);
      } catch (err) {
        setError(err.message || 'Lỗi không xác định');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return { posts, loading, error };
};

export default useUserPosts;
