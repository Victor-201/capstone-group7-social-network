import { useState } from 'react';
import { togglePostLike } from '../../api/likeApi';

export const usePostLikes = (postId) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const toggleLike = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError("No token provided");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const data = await togglePostLike(token, postId);

      // ✅ Giả định API trả về `{ liked: true/false }`
      const nextLiked = data?.liked ?? !isLiked;

      setIsLiked(nextLiked);
      setLikeCount(prev => nextLiked ? prev + 1 : prev - 1);

      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    isLiked,
    likeCount,
    loading,
    error,
    toggleLike
  };
};
