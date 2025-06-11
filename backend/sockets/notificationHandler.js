import { createNotification } from "../services/createNotification.service.js";
import models from "../models/index.js";

export const handleNotificationSocket = async (io, socket) => {
    socket.on('joinNotification', () => {
        const userId = socket.user?.id;
        if (userId) {
            socket.join(userId);
            console.log(`User ${userId} joined notification room`);
        } else {
            console.error('User ID not found in socket user data');
        }
    });

    socket.on('sendNotification', async (data) => {
        const { actionType, actionId, content } = data;

        let receiverId;
        // Find the receiverId based on actionType
        if (actionType === 'like' || actionType === 'comment') {
            const post = models.Post.findByPk(actionId);
            if (!post) throw new Error('Post not found');
            receiverId = post.user_id;
        }
        else if (actionType === 'follow') {
            const user = models.User.findByPk(actionId);
            if (!user) throw new Error('User not found');
            receiverId = user.id;
        }
        else if (actionType === 'message') {
            const participants = await models.ChatParticipant.findAll({
                where: { chat_id: actionId },
            });
            if (!participants || participants.length < 2) {
                throw new Error('Invalid chat or participants not found');
            }
            const receiver = participants.find(p => p.user_id !== socket.user?.id);

            if (!receiver) {
                throw new Error('Receiver not found');
            }
            receiverId = receiver.user_id;
        }
        else if (actionType === 'Post') {
            const post = await models.Post.findByPk(actionId);
            if (!post) throw new Error('Post not found');

            const userId = post.user_id;

            const followers = await models.Follow.findAll({
                where: { following_id: userId },
            });

            if (!followers || followers.length === 0) {
                console.log(`User ${userId} has no followers`);
                return;
            }

            const senderId = socket.user?.id;

            for (const follower of followers) {
                const receiverId = follower.follower_id;

                const notification = await createNotification({
                    senderId,
                    receiverId,
                    actionType,
                    actionId,
                    content
                });

                io.to(receiverId).emit('receiveNotification', {
                    id: notification.id,
                    senderId: notification.sender_id,
                    receiverId: notification.receiver_id,
                    actionType: notification.action_type,
                    content: notification.content,
                    actionId: notification.action_id,
                    isRead: notification.is_read,
                    createdAt: notification.created_at
                });
            }

            return;
        }
        else {
            throw new Error('Invalid action type');
        }
        const senderId = socket.user?.id;

        console.log('Socket sendNotification data:', data);

        try {
            const notification = await createNotification({
                senderId,
                receiverId,
                actionType,
                actionId,
                content
            });

            socket.to(receiverId).emit('receiveNotification', {
                id: notification.id,
                senderId: notification.sender_id,
                receiverId: notification.receiver_id,
                actionType: notification.action_type,
                content: notification.content,
                actionId: notification.action_id,
                isRead: notification.is_read,
                createdAt: notification.created_at
            });
        } catch (err) {
            console.error('Socket sendNotification error:', err);
            socket.emit('errorNotification', { error: err.message });
        }
    });
}