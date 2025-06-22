import { useState } from 'react';
import { logout } from '../../api/accountApi';

export const useLogout = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const logoutUser = async () => {
        try {
            setLoading(true);
            setError(null);
            const token = localStorage.getItem('token');
            
            if (token) {
                await logout(token);
            }
            
            // Xóa token khỏi localStorage
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
            
            return true;
        } catch (err) {
            setError(err.message);
            // Vẫn xóa token dù có lỗi
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { logoutUser, loading, error };
};
