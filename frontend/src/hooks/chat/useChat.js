import { useState, useEffect, useCallback } from 'react';
import { useAuth } from "../../contexts/AuthContext";
import { 
    getChats,
    getChatById,
} from '../../api/chatApi';

export const useChats = () => {
    const [chats, setChats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { auth } = useAuth();

    const fetchChats = useCallback(async () => {
        if (!auth.token) {
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);
            const data = await getChats(auth.token);
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
    const { auth } = useAuth();

    const fetchChat = useCallback(async () => {
        if (!chatId) {
            setLoading(false);
            return;
        }
        if (!auth.token) {
            setError("No token provided");
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);
            const data = await getChatById(auth.token, chatId);
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