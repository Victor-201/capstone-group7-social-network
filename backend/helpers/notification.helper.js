import { sendNotificationToUser } from "../services/socket.service.js";
import notificationService from "../services/Notification.service.js";

const notify = async (user_id, receiver_id, action_type, action_id, content) => {
  const notification = await notificationService.createNotification(user_id, receiver_id, action_type, action_id, content);
  if (!notification.error) {
    sendNotificationToUser(receiver_id, 'newNotification', notification.result);
  }
};

export default notify;