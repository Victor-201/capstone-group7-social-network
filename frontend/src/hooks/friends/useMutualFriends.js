import { useState, useEffect, useCallback } from 'react';
import { getMutualFriends } from '../../api/friendApi';

export const useMutualFriends = (userId) => {
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

    useEffect(() => {
        fetchMutualFriends();
    }, [fetchMutualFriends]);

    return { 
        mutualFriends, 
        loading, 
        error, 
        refetch: fetchMutualFriends 
    };
};

// Hook để batch fetch mutual friends với chi tiết
export const useBatchMutualFriendsDetailed = (friendIds = []) => {
  const [mutualFriendsData, setMutualFriendsData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAllMutualFriendsDetailed = useCallback(async () => {
    if (friendIds.length === 0) {
      setMutualFriendsData({});
      return;
    }

    console.log('useBatchMutualFriendsDetailed: Starting fetch for IDs:', friendIds);

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
          console.log(`Fetching detailed mutual friends for user ${friendId}...`);
          const result = await getMutualFriends(token, friendId);
          console.log(`Mutual friends result for ${friendId}:`, result);
          return {
            friendId,
            mutualFriends: result?.mutualFriends || [],
            count: result?.mutualFriends?.length || 0
          };
        } catch (err) {
          console.log(`Failed to fetch mutual friends for ${friendId}:`, err);
          return { friendId, mutualFriends: [], count: 0 };
        }
      });

      const results = await Promise.all(promises);
      
      // Convert array to object
      const dataMap = {};
      results.forEach(({ friendId, mutualFriends, count }) => {
        dataMap[friendId] = { mutualFriends, count };
      });
      
      console.log('useBatchMutualFriendsDetailed: Final dataMap:', dataMap);
      setMutualFriendsData(dataMap);
    } catch (err) {
      console.error('Failed to fetch batch detailed mutual friends:', err);
      setError(err);
      setMutualFriendsData({});
    } finally {
      setLoading(false);
    }
  }, [friendIds]);

  useEffect(() => {
    fetchAllMutualFriendsDetailed();
  }, [fetchAllMutualFriendsDetailed]);

  return { mutualFriendsData, loading, error, refetch: fetchAllMutualFriendsDetailed };
};

// Hook để batch fetch mutual friends counts cho nhiều users
export const useBatchMutualFriends = (friendIds = []) => {
  const [mutualCounts, setMutualCounts] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAllMutualCounts = useCallback(async () => {
    if (friendIds.length === 0) {
      setMutualCounts({});
      return;
    }

    console.log('useBatchMutualFriends: Starting fetch for IDs:', friendIds);

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
          console.log(`Fetching mutual friends for user ${friendId}...`);
          const result = await getMutualFriends(token, friendId);
          console.log(`Mutual friends result for ${friendId}:`, result);
          
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
          console.log(`Failed to fetch mutual friends for ${friendId}:`, err);
          return { friendId, count: 0 };
        }
      });

      const results = await Promise.all(promises);
      
      // Convert array to object
      const countsMap = {};
      results.forEach(({ friendId, count }) => {
        countsMap[friendId] = count;
      });
      
      console.log('useBatchMutualFriends: Final counts map:', countsMap);
      setMutualCounts(countsMap);
    } catch (err) {
      console.error('Failed to fetch batch mutual friends:', err);
      setError(err);
      setMutualCounts({});
    } finally {
      setLoading(false);
    }
  }, [friendIds]);

  useEffect(() => {
    fetchAllMutualCounts();
  }, [fetchAllMutualCounts]);

  return { mutualCounts, loading, error, refetch: fetchAllMutualCounts };
};
