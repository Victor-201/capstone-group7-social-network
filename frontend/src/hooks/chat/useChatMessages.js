import { useState, useEffect, useCallback } from 'react';
import { getChatMessages } from '../../api/messageApi';

export const useChatMessages = (chatId, page = 1, limit = 20) => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [hasMore, setHasMore] = useState(true);

    const fetchMessages = useCallback(async (pageNum = 1, isLoadMore = false) => {
        if (!chatId) {
            setLoading(false);
            return;
        }

        const token = localStorage.getItem('token');
        if (!token) {
            setError("No token provided");
            setLoading(false);
            return;
        }

        try {
            if (!isLoadMore) setLoading(true);
            setError(null);
            
            const data = await getChatMessages(token, chatId, pageNum, limit);
            
            if (isLoadMore) {
                // For messages, we usually want older messages at the top
                setMessages(prev => [...(data.messages || []), ...prev]);
            } else {
                setMessages(data.messages || []);
            }
            
            setHasMore(data.hasMore || false);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [chatId, limit]);

    useEffect(() => {
        fetchMessages(page);
    }, [fetchMessages, page]);

    const loadMore = () => {
        if (hasMore && !loading) {
            const nextPage = Math.floor(messages.length / limit) + 1;
            fetchMessages(nextPage, true);
        }
    };

    const addNewMessage = (newMessage) => {
        setMessages(prev => [...prev, newMessage]);
    };

    const updateMessage = (messageId, updatedMessage) => {
        setMessages(prev => 
            prev.map(msg => 
                msg.id === messageId ? { ...msg, ...updatedMessage } : msg
            )
        );
    };

    const removeMessage = (messageId) => {
        setMessages(prev => prev.filter(msg => msg.id !== messageId));
    };

    return { 
        messages, 
        loading, 
        error, 
        hasMore, 
        loadMore, 
        addNewMessage,
        updateMessage,
        removeMessage,
        refetch: () => fetchMessages(1) 
    };
};
