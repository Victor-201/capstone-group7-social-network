import models from "../models/index.js";
const { Notification, UserInfo, sequelize } = models;

export default {
    async getNotification(receiver_id) {
        try {
            const notifications = await Notification.findAll({
                where: { receiver_id },
                include: [
                    {
                        model: UserInfo,
                        as: "receiver",
                        attributes: ["id", "full_name", "avatar"],
                    },
                ],
                order: [["created_at", "DESC"]],
            });

            if (!notifications || notifications.length === 0) {
                return { error: { code: 404, message: "No notifications found" } };
            }

            return { result: notifications };
        } catch (err) {
            return { error: { code: 500, message: "Server error", detail: err.message } };
        }
    },

    async isRead(id) {
        try {
            if (!id) return { error: { code: 400, message: "Notification ID is required" } };

            const notification = await Notification.findOne({ where: { id } });
            if (!notification) return { error: { code: 404, message: "Notification not found" } };
            if (notification.is_read) return { error: { code: 400, message: "Notification already read" } };

            notification.is_read = true;
            await notification.save();

            return { result: notification };
        } catch (err) {
            return { error: { code: 500, message: "Server error", detail: err.message } };
        }
    },

    async isReadAll(receiver_id) {
        try {
            if (!receiver_id) return { error: { code: 400, message: "Receiver ID is required" } };

            const [updatedCount] = await Notification.update(
                { is_read: true },
                { where: { receiver_id, is_read: false } }
            );

            return { result: { message: `Marked ${updatedCount} notifications as read.` } };
        } catch (err) {
            return { error: { code: 500, message: "Server error", detail: err.message } };
        }
    },
    async deleteNotification(id) {
        if (!id) return { error: { code: 400, message: "Notification ID is required" } };

        const notification = await Notification.findOne({ where: { id } });
        if (!notification) return { error: { code: 404, message: "Notification not found" } };

        await notification.destroy();
        return { result: { message: "Delete notification successful" } };
    },
    async deleteReadNotifications(receiver_id) {
        if (!receiver_id) {
            return { error: { code: 400, message: "Receiver ID is required" } };
        }

        const deletedCount = await Notification.destroy({
            where: {
                receiver_id,
                is_read: true,
            },
        });

        return {
            result: {
                message: `${deletedCount} read notification(s) deleted.`,
            },
        };
    },
    async createNotification(user_id, receiver_id, action_type, action_id, content) {
        if (!user_id || !receiver_id || !action_id || !action_type || !content) {
            return { error: { code: 400, message: "Missing required fields" } };
        }
        
        try {
            const notification = await Notification.create({
                sender_id: user_id,
                receiver_id,
                action_type,
                action_id,
                content,
            });

            return { result: notification };
        } catch (err) {
            console.error("Error creating notification:", err);
            return { error: { code: 500, message: "Internal server error" } };
        }
    },
    async unRead(id) {
        try {
            if (!id) return { error: { code: 400, message: "Notification ID is required" } };

            const notification = await Notification.findOne({ where: { id } });
            if (!notification) return { error: { code: 404, message: "Notification not found" } };

            notification.is_read = false;
            await notification.save();

            return { result: notification };
        } catch (err) {
            return { error: { code: 500, message: "Server error", detail: err.message } };
        }
    },
    async countUnreadNotifications (receiver_id) {
        if(!receiver_id){
            return {error: {code: 400, message: "receiver_id is required"}};
        }
        try{
            const unreadCount = await Notification.count({where: {receiver_id, is_read: false}});
            return {result: unreadCount};
        }catch (error){
            return { error: { code: 500, message: "Server error", detail: error.message } };
        }
    }
};