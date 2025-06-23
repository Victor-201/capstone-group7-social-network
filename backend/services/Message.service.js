import models from "../models/index.js";
import sequelize from "../configs/database.config.js";

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
            return { result: message };
        } catch (error) {
            return { error: { code: 500, message: 'Error sending message', detail: error.message } };
        }
    },
    async markAllMessagesAsRead(chat_id, user_id) {
        try {
            if (!chat_id || !user_id) {
                return { error: { code: 400, message: "chat_id and user_id are required" } };
            }

            const isParticipant = await models.ChatParticipant.findOne({
                where: {
                    chat_id,
                    user_id,
                },
            });
            if (!isParticipant) {
                return { error: { code: 403, message: "User is not a participant of this chat" } };
            }

            const [countUpdated] = await models.Message.update(
                { is_read: true },
                {
                    where: {
                        chat_id,
                        is_read: false,
                        sender_id: { [models.sequelize.Op.ne]: user_id },
                    },
                }
            );

            return {
                result: {
                    updated_count: countUpdated,
                    message: `Marked ${countUpdated} messages as read`,
                },
            };
        } catch (error) {
            return {
                error: {
                    code: 500,
                    message: "Error marking messages as read",
                    detail: error.message,
                },
            };
        }
    },
    async countUnreadMessages(user_id, chat_id) {
        if (!user_id || !chat_id) {
            return { error: { code: 400, message: "user_id and chat_id are required" } };
        }

        try {
            const isParticipant = await models.ChatParticipant.findOne({
                where: {
                    chat_id,
                    user_id,
                },
            });
            if (!isParticipant) {
                return { error: { code: 403, message: "User is not a participant of this chat" } };
            }
            const unreadCount = await models.Message.count({
                where: {
                    chat_id,
                    is_read: false,
                    sender_id: { [models.sequelize.Op.ne]: user_id },
                },
            });

            return { result: unreadCount };
        } catch (error) {
            return {
                error: {
                    code: 500,
                    message: "Error counting unread messages",
                    detail: error.message,
                },
            };
        }
    }
}