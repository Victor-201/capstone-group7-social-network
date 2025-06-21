import { useState, useEffect } from 'react';
import { getNotifications } from '../api/notificationApi';

const useNotifications = () => {
    const [notifications, setNotification] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        (async () => {
            setLoading(true); 
            const token = localStorage.getItem('token');
            if (!token) {
                console.error("No token found");
                setError("No token provided");
                setLoading(false); 
                return;
            }
            
            try {
                const data = await getNotifications(token);
                setNotification(data);
            } catch (err) {
                console.error('Error fetching user info:', err.message);
                setError(err.message);
            } finally {
                setLoading(false); 
            }
        })();
    }, []);

    return { notifications, loading, error };
};

export default useNotifications;
