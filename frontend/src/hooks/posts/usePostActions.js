import { useState } from 'react';
import { updatePost, deletePost } from '../../api/postApi';

export const usePostActions = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const updateExistingPost = async (postId, postData) => {
        const token = localStorage.getItem('token');
        if (!token) throw new Error("No token provided");

        try {
            setLoading(true);
            setError(null);
            const data = await updatePost(token, postId, postData);
            return data;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const deleteExistingPost = async (postId) => {
        const token = localStorage.getItem('token');
        if (!token) throw new Error("No token provided");

        try {
            setLoading(true);
            setError(null);
            const data = await deletePost(token, postId);
            return data;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        updateExistingPost,
        deleteExistingPost,
        loading,
        error
    };
};
