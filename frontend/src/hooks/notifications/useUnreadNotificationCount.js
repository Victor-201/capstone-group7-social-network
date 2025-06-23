import { useEffect, useState } from 'react';
import { getUnreadCount } from '../../api/notificationApi';

export const useUnreadNotificationCount = () => {
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem('token');

  const fetchUnreadCount = async () => {
    setLoading(true);
    try {
      const result = await getUnreadCount(token);
      setCount(result || 0);
      setError(null);
    } catch (err) {
      setError(err.message);
      setCount(0);
    } finally {
      setLoading(false);
    }
  };
    useEffect(() => {
        if (token) {
        fetchUnreadCount();
        } else {
        setLoading(false);
        setError("No token provided");
        }
    }, [token]);

  return { count, loading, error, refetch: fetchUnreadCount };
};
