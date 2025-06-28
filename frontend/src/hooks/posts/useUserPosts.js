// hooks/posts/useUserPosts.js
import { useState, useEffect } from "react";
import { fetchUserPosts, fetchFeedPost } from "../../api/postApi";

export const useUserPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadPosts = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Không tìm thấy token.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const data = await fetchUserPosts(token);
        setPosts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, []);

  return { posts, loading, error };
};
export const useUserFeedPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadPosts = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Không tìm thấy token.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const data = await fetchFeedPost(token);
        setPosts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, []);

  return { posts, loading, error };
}
