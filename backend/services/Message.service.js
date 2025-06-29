import models from "../models/index.js";
import { Op } from "sequelize";

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
                        attributes: ['id', 'full_name', 'avatar'],
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
                return {
                    error: {
                        code: 400,
                        message: 'Chat ID, sender ID, and content are required'
                    }
                };
            }

            const message = await models.Message.create({
                chat_id: chatId,
                sender_id: senderId,
                content,
            });

            if (!message) {
                return {
                    error: {
                        code: 500,
                        message: 'Failed to send message'
                    }
                };
            }

            // Fetch lại message kèm thông tin người gửi
            const fullMessage = await models.Message.findByPk(message.id, {
                include: [{
                    model: models.UserInfo,
                    as: 'Sender',
                    attributes: ['id', 'full_name', 'avatar'],
                }]
            });

            return { result: fullMessage };

        } catch (error) {
            return {
                error: {
                    code: 500,
                    message: 'Error sending message',
                    detail: error.message
                }
            };
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
                        sender_id: { [Op.ne]: user_id },
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
    },
    async getUserInfoInChat(user_id, chat_id) {
        if (!user_id || !chat_id) {
            return { error: { code: 400, message: "user_id or chat_id is required" } };
        }
        try {
            const participants = await models.ChatParticipant.findAll({
                where: {
                    chat_id,
                    user_id: { [Op.ne]: user_id },
                },
            });
            const otherIds = participants.map((p) => p.user_id);

            if (!otherIds || otherIds.length <= 0) {
                return { error: { code: 404, message: "No other participants found in this chat" } };
            }

            const otherUsers = await models.UserInfo.findAll({
                where: {
                    id: { [Op.in]: otherIds },
                },
            });

            const latestMessages = {};
            for (const id of otherIds) {
                const latestMessage = await models.Message.findOne({
                    where: {
                        chat_id,
                        sender_id: id,
                    },
                    order: [["sent_at", "DESC"]],
                });
                latestMessages[id] = latestMessage || null;
            }

            const result = otherUsers.map((user) => {
                return {
                    user,
                    latest_message: latestMessages[user.id] || null,
                };
            });

            return { result };
        } catch (error) {
            return {
                error: {
                    code: 500,
                    message: "Error getting user and latest messages",
                    detail: error.message,
                },
            };
        }
    }
}