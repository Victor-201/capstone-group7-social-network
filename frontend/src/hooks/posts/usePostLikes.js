import { useState } from 'react';
import { togglePostLike } from '../../api/likeApi';

export const usePostLikes = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const toggleLike = async (postId, isLike) => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError("No token provided");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await togglePostLike(token, postId, isLike);
      return data;
    } catch (err) {
      setError(err.message || "Lỗi không xác định");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    toggleLike,
    loading,
    error
  };
};
