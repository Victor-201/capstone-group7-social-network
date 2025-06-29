import { useState, useEffect } from 'react';
import { getUserInfo, getUserById, getUserByUserName } from '../../api/userApi';

export const useUserInfo = (userId = null, userName = null) => {
    const [userInfo, setUserInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserInfo = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setError("No token provided");
                setLoading(false);
                return;
            }
            
            try {
                setLoading(true);
                setError(null);
                let data;
                
                if (userId) {
                    data = await getUserById(token, userId);
                } else if (userName) {
                    data = await getUserByUserName(token, userName);
                }
                 else {
                    data = await getUserInfo(token);
                }
                
                setUserInfo(data);
            } catch (err) {
                console.error('Error fetching user info:', err.message);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUserInfo();
    }, [userId, userName]);

    return { userInfo, loading, error };
};
