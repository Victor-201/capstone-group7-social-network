import models from "../models/index.js";

export default {
    async getMessagesByChatId(chatId) {
        try {
            if (!chatId) {
                return { error: { code: 400, message: 'Chat ID is required' } };
            }
            const messages = await models.Message.findAll({
                where: { chat_id: chatId },
                include: [
                    {
                        model: models.UserInfo,
                        as: 'Sender',
                        attributes: ['id', 'user_name', 'avatar'],
                    },
                ],
                order: [['sent_at', 'ASC']],
            });
            if (!messages || messages.length === 0) {
                return { error: { code: 404, message: 'No messages found for this chat' } };
            }
            return { result: messages };
        } catch (error) {
            return { error: { code: 500, message: 'Error fetching messages', detail: error.message } };
        }
    },
    async sendMessage(chatId, senderId, content) {
        try {
            if (!chatId || !senderId || !content) {
                return { error: { code: 400, message: 'Chat ID, sender ID, and content are required' } };
            }
            const message = await models.Message.create({
                chat_id: chatId,
                sender_id: senderId,
                content,
            });
            if (!message) {
                return { error: { code: 500, message: 'Failed to send message' } };
            }
            return { result: message};
        } catch (error) {
            return { error: { code: 500, message: 'Error sending message', detail: error.message } };
        }
    }
}