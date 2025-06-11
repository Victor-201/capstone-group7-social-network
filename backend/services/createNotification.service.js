import models from '../models/index.js';
const { Notification } = models;

export const createNotification = async ({senderId, receiverId, actionType, actionId, content}) => {
    try {
        const notification = await Notification.create({
            sender_id: senderId,
            receiver_id: receiverId,
            action_type: actionType,
            content: content,
            action_id: actionId
        });
        return notification;
    }
    catch (error) {
        console.error('Error creating notification:', error);
        throw new Error('Failed to create notification');
    }
}