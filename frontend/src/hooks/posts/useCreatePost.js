import { useState } from 'react';
import { createPost, uploadPostMedia } from '../../api/postApi';

export const useCreatePost = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(0);

    const createNewPost = async (postData) => {
        const token = localStorage.getItem('token');
        if (!token) throw new Error("No token provided");

        try {
            setLoading(true);
            setError(null);
            const data = await createPost(token, postData);
            return data;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const uploadMedia = async (formData, onProgress) => {
        const token = localStorage.getItem('token');
        if (!token) throw new Error("No token provided");

        try {
            setLoading(true);
            setError(null);
            setUploadProgress(0);

            // Simulate progress if callback provided
            if (onProgress) {
                const progressInterval = setInterval(() => {
                    setUploadProgress(prev => {
                        const newProgress = prev + 10;
                        onProgress(newProgress);
                        if (newProgress >= 90) {
                            clearInterval(progressInterval);
                        }
                        return newProgress;
                    });
                }, 100);
            }

            const data = await uploadPostMedia(token, formData);
            setUploadProgress(100);
            
            if (onProgress) onProgress(100);
            
            return data;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
            setTimeout(() => setUploadProgress(0), 1000);
        }
    };

    const createPostWithMedia = async (postData, mediaFiles) => {
        try {
            setLoading(true);
            setError(null);

            let mediaUrls = [];

            // Upload media files nếu có
            if (mediaFiles && mediaFiles.length > 0) {
                const formData = new FormData();
                mediaFiles.forEach((file, index) => {
                    formData.append(`media_${index}`, file);
                });

                const mediaResponse = await uploadMedia(formData);
                mediaUrls = mediaResponse.urls || [];
            }

            // Tạo post với media URLs
            const finalPostData = {
                ...postData,
                mediaUrls: mediaUrls
            };

            const data = await createNewPost(finalPostData);
            return data;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        createNewPost,
        uploadMedia,
        createPostWithMedia,
        loading,
        error,
        uploadProgress
    };
};
