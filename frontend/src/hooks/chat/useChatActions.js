import { useState } from 'react';
import { 
    createChat, 
    updateChat, 
    deleteChat,
    addParticipant,
    removeParticipant
} from '../../api/chatApi';
import { 
    sendMessage, 
    updateMessage, 
    deleteMessage,
    markMessagesAsRead
} from '../../api/messageApi';

export const useChatActions = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const createNewChat = async (participants) => {
        const token = localStorage.getItem('token');
        if (!token) throw new Error("No token provided");

        try {
            setLoading(true);
            setError(null);
            const data = await createChat(token, participants);
            return data;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const updateExistingChat = async (chatId, updateData) => {
        const token = localStorage.getItem('token');
        if (!token) throw new Error("No token provided");

        try {
            setLoading(true);
            setError(null);
            const data = await updateChat(token, chatId, updateData);
            return data;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const deleteExistingChat = async (chatId) => {
        const token = localStorage.getItem('token');
        if (!token) throw new Error("No token provided");

        try {
            setLoading(true);
            setError(null);
            const data = await deleteChat(token, chatId);
            return data;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const addParticipantToChat = async (chatId, userId) => {
        const token = localStorage.getItem('token');
        if (!token) throw new Error("No token provided");

        try {
            setLoading(true);
            setError(null);
            const data = await addParticipant(token, chatId, userId);
            return data;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const removeParticipantFromChat = async (chatId, userId) => {
        const token = localStorage.getItem('token');
        if (!token) throw new Error("No token provided");

        try {
            setLoading(true);
            setError(null);
            const data = await removeParticipant(token, chatId, userId);
            return data;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        createNewChat,
        updateExistingChat,
        deleteExistingChat,
        addParticipantToChat,
        removeParticipantFromChat,
        loading,
        error
    };
};

export const useMessageActions = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const sendNewMessage = async (messageData) => {
        const token = localStorage.getItem('token');
        if (!token) throw new Error("No token provided");

        try {
            setLoading(true);
            setError(null);
            const data = await sendMessage(token, messageData);
            return data;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const updateExistingMessage = async (messageId, content) => {
        const token = localStorage.getItem('token');
        if (!token) throw new Error("No token provided");

        try {
            setLoading(true);
            setError(null);
            const data = await updateMessage(token, messageId, content);
            return data;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const deleteExistingMessage = async (messageId) => {
        const token = localStorage.getItem('token');
        if (!token) throw new Error("No token provided");

        try {
            setLoading(true);
            setError(null);
            const data = await deleteMessage(token, messageId);
            return data;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = async (chatId) => {
        const token = localStorage.getItem('token');
        if (!token) throw new Error("No token provided");

        try {
            setLoading(true);
            setError(null);
            const data = await markMessagesAsRead(token, chatId);
            return data;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        sendNewMessage,
        updateExistingMessage,
        deleteExistingMessage,
        markAsRead,
        loading,
        error
    };
};
