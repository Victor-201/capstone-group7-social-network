import MessageService from "../services/Message.service.js";

export const getMessagesByChatId = async (req, res) => {
    const chatId = req.params.chat_id;
    const { error, result } = await MessageService.getMessagesByChatId(chatId);
    if (error) return res.status(error.code).json(error);
    return res.status(200).json(result);
}

export const sendMessage = async (req, res) => {
    const { content } = req.body;
    const chat_id = req.params.chat_id;
    const sender_id = req.user.id;
    const { error, result } = await MessageService.sendMessage(chat_id, sender_id, content);
    if (error) return res.status(error.code).json(error);
    req.io.to(chat_id).emit('newMessage', result);
    return res.status(201).json(result);
}

export const markMessageAsRead = async (req, res) => {
    const chatId = req.params.chat_id;
    const userId = req.user.id;
    const { error, result } = await MessageService.markAllMessagesAsRead(chatId, userId);
    if (error) return res.status(error.code).json(error);
    return res.status(200).json(result);
}

export const countUnreadMessages = async (req, res) => {
    const chatId = req.params.chat_id;
    const userId = req.user.id;
    const { error, result } = await MessageService.countUnreadMessages(chatId, userId);
    if (error) return res.status(error.code).json(error);
    return res.status(200).json(result);
}