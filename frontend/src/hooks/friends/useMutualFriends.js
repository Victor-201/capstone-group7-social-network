import { useState, useEffect, useCallback } from 'react';
import { getMutualFriends } from '../../api/friendApi';

export const useMutualFriends = (userId, autoFetch = false) => {
    const [mutualFriends, setMutualFriends] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchMutualFriends = useCallback(async () => {
        if (!userId) return;
        
        const token = localStorage.getItem('token');
        if (!token) {
            setError("Vui lòng đăng nhập để xem bạn bè chung");
            setLoading(false);
            return;
        }
        
        setLoading(true);
        setError(null);
        
        try {
            const result = await getMutualFriends(token, userId);
            setMutualFriends(result.mutualFriends || []);
        } catch (err) {
            setError(err.message);
            console.error('Error fetching mutual friends:', err);
        } finally {
            setLoading(false);
        }
    }, [userId]);

    // Chỉ fetch tự động nếu autoFetch = true
    useEffect(() => {
        if (autoFetch) {
            fetchMutualFriends();
        }
    }, [autoFetch, fetchMutualFriends]);

    return { 
        mutualFriends, 
        loading, 
        error, 
        refetch: fetchMutualFriends 
    };
};

// Hook để batch fetch mutual friends với chi tiết
export const useBatchMutualFriendsDetailed = (friendIds = [], autoFetch = false) => {
  const [mutualFriendsData, setMutualFriendsData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAllMutualFriendsDetailed = useCallback(async () => {
    if (friendIds.length === 0) {
      setMutualFriendsData({});
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      setError("Vui lòng đăng nhập để xem bạn bè chung");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // Fetch tất cả mutual friends details song song
      const promises = friendIds.map(async (friendId) => {
        try {
          const result = await getMutualFriends(token, friendId);
          return {
            friendId,
            mutualFriends: result?.mutualFriends || [],
            count: result?.mutualFriends?.length || 0
          };
        } catch (err) {
          return { friendId, mutualFriends: [], count: 0 };
        }
      });

      const results = await Promise.all(promises);
      
      // Convert array to object
      const dataMap = {};
      results.forEach(({ friendId, mutualFriends, count }) => {
        dataMap[friendId] = { mutualFriends, count };
      });
      
      setMutualFriendsData(dataMap);
    } catch (err) {
      setError(err);
      setMutualFriendsData({});
    } finally {
      setLoading(false);
    }
  }, [friendIds]);

  // Chỉ fetch tự động nếu autoFetch = true
  useEffect(() => {
    if (autoFetch) {
      fetchAllMutualFriendsDetailed();
    }
  }, [autoFetch, fetchAllMutualFriendsDetailed]);

  return { mutualFriendsData, loading, error, refetch: fetchAllMutualFriendsDetailed };
};

// Hook để batch fetch mutual friends counts cho nhiều users
export const useBatchMutualFriends = (friendIds = [], autoFetch = false) => {
  const [mutualCounts, setMutualCounts] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAllMutualCounts = useCallback(async () => {
    if (friendIds.length === 0) {
      setMutualCounts({});
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      setError("Vui lòng đăng nhập để xem bạn bè chung");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // Fetch tất cả mutual friends counts song song
      const promises = friendIds.map(async (friendId) => {
        try {
          const result = await getMutualFriends(token, friendId);
          // Handle both success and "no mutual friends" cases
          if (result.mutualFriends) {
            return {
              friendId,
              count: result.mutualFriends.length
            };
          } else {
            // Handle error case (like 404 no mutual friends found)
            return { friendId, count: 0 };
          }
        } catch (err) {
          return { friendId, count: 0 };
        }
      });

      const results = await Promise.all(promises);
      
      // Convert array to object
      const countsMap = {};
      results.forEach(({ friendId, count }) => {
        countsMap[friendId] = count;
      });
      
      setMutualCounts(countsMap);
    } catch (err) {
      setError(err);
      setMutualCounts({});
    } finally {
      setLoading(false);
    }
  }, [friendIds]);

  // Chỉ fetch tự động nếu autoFetch = true
  useEffect(() => {
    if (autoFetch) {
      fetchAllMutualCounts();
    }
  }, [autoFetch, fetchAllMutualCounts]);

  return { mutualCounts, loading, error, refetch: fetchAllMutualCounts };
};
