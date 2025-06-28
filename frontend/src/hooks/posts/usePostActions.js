import { useState } from 'react';
import { updatePost, deletePost } from '../../api/postApi';

export const usePostActions = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const updateExistingPost = async (post_id, postData) => {
        console.log("Updating post with ID:", post_id, "and data:", postData);
        const token = localStorage.getItem('token');
        if (!token) throw new Error("No token provided");

        try {
            setLoading(true);
            setError(null);
            const data = await updatePost(token, post_id, postData);
            return data;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // const deleteExistingPost = async (post_id) => {
    //     const token = localStorage.getItem('token');
    //     if (!token) throw new Error("No token provided");

    //     try {
    //         setLoading(true);
    //         setError(null);
    //         const data = await deletePost(token, post_id);
    //         return data;
    //     } catch (err) {
    //         setError(err.message);
    //         throw err;
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    return {
        updateExistingPost,
        // deleteExistingPost,
        loading,
        error
    };
};
