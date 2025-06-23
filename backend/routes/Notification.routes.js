import { Router } from "express";
import { getNotifications, 
    markAsRead, 
    markAllAsRead, 
    deleteNotification, 
    deleteReadNotifications,
    markAsUnread,
    unreadCount
} 
    from "../controllers/Notification.controller.js";

const router = Router();

router.get("/notifications", getNotifications);
router.put("/notifications/:id/read", markAsRead);
router.put("/notifications/read-all", markAllAsRead);
router.delete("/notifications/:id/delete", deleteNotification);
router.delete("/notifications/delete-read", deleteReadNotifications);
router.put("/notifications/:id/unread", markAsUnread);
router.get('/notifications/unread-count', unreadCount);

export default router;