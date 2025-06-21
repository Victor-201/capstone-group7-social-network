import { useState, useEffect } from 'react';

export const useOnlineStatus = (userId) => {
    const [isOnline, setIsOnline] = useState(false);
    const [lastSeen, setLastSeen] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!userId) {
            setLoading(false);
            return;
        }

        const fetchOnlineStatus = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setError("No token provided");
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);
                
                // API call để lấy online status
                const response = await fetch(`/api/user/${userId}/online-status`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch online status');
                }

                const data = await response.json();
                setIsOnline(data.isOnline);
                setLastSeen(data.lastSeen);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchOnlineStatus();

        // Set up polling để check online status
        const interval = setInterval(fetchOnlineStatus, 30000); // Check mỗi 30 giây

        return () => clearInterval(interval);
    }, [userId]);

    return { isOnline, lastSeen, loading, error };
};
