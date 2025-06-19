import { useState, useEffect } from 'react';
import { getUserInfo } from '../api/userApi';

const useUserInfo = () => {
    const [userInfo, setUserInfo] = useState(null);
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
                const data = await getUserInfo(token);
                setUserInfo(data);
            } catch (err) {
                console.error('Error fetching user info:', err.message);
                setError(err.message);
            }
        })(); // <-- gọi hàm async ngay lập tức
    }, []);

    return { userInfo, error };
};

export default useUserInfo;
