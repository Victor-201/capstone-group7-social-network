import { useState, useEffect, useCallback } from 'react';
import { 
    getChats,
    getChatById,
    getChatMessages
} from '../../api/chatApi';
import { sendMessage } from '../../api/messageApi';

export const useChats = () => {
    const [chats, setChats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchChats = useCallback(async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setError("No token provided");
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);
            const data = await getChats(token);
            setChats(data.chats || []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchChats();
    }, [fetchChats]);

    return { chats, loading, error, refetch: fetchChats };
};

export const useChat = (chatId) => {
    const [chat, setChat] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchChat = useCallback(async () => {
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
            setLoading(true);
            setError(null);
            const data = await getChatById(token, chatId);
            setChat(data.chat);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [chatId]);

    useEffect(() => {
        fetchChat();
    }, [fetchChat]);

    return { chat, loading, error, refetch: fetchChat };
};
