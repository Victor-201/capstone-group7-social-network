import { useState, useEffect } from 'react';
import { getUserInfo } from '../api/userApi';

const useUserInfo = (userId = null) => {
    const [userInfo, setUserInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
<<<<<<< Updated upstream
        (async () => {
            setLoading(true); 
=======
        const fetchUserInfo = async () => {
>>>>>>> Stashed changes
            const token = localStorage.getItem('token');
            if (!token) {
                setError("No token provided");
<<<<<<< Updated upstream
                setLoading(false); 
=======
                setLoading(false);
>>>>>>> Stashed changes
                return;
            }
            
            try {
                setLoading(true);
                setError(null);
                const data = await getUserInfo(token);
                setUserInfo(data);
            } catch (err) {
                console.error('Error fetching user info:', err.message);
                setError(err.message);
            } finally {
<<<<<<< Updated upstream
                setLoading(false); 
            }
        })();
    }, []);

=======
                setLoading(false);
            }
        };

        fetchUserInfo();
    }, [userId]);

>>>>>>> Stashed changes
    return { userInfo, loading, error };
};

export default useUserInfo;
