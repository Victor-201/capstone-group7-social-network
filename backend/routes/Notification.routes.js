import { Router } from "express";
import { getNotifications, 
    markAsRead, 
    markAllAsRead, 
    deleteNotification, 
    deleteReadNotifications} 
    from "../controllers/Notification.controller.js";

const router = Router();

router.get("/notifications", getNotifications);
router.put("/notifications/:id/read", markAsRead);
router.put("/notifications/read-all", markAllAsRead);
router.delete("/notifications/:id/delete", deleteNotification);
router.delete("/notifications/delete-read", deleteReadNotifications);

export default router;