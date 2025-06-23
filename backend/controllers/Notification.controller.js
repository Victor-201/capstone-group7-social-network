import NotificationService from "../services/Notification.service.js";

export const getNotifications = async (req, res) => {
  const receiver_id = req.user.id;
  const { error, result } = await NotificationService.getNotification(receiver_id);
  if (error) return res.status(error.code).json(error);
  return res.status(200).json(result);
};

export const markAsRead = async (req, res) => {
  const id = req.params.id;
  const { error, result } = await NotificationService.isRead(id);
  if (error) return res.status(error.code).json(error);
  return res.status(200).json(result);
};

export const markAllAsRead = async (req, res) => {
  const receiver_id = req.user.id;
  const { error, result } = await NotificationService.isReadAll(receiver_id);
  if (error) return res.status(error.code).json(error);
  return res.status(200).json(result);
};

export const deleteNotification = async (req, res) => {
  const id = req.params.id;
  const { error, result } = await NotificationService.deleteNotification(id);
  if (error) return res.status(error.code).json(error);
  return res.status(200).json(result);
};

export const deleteReadNotifications = async (req, res) => {
  const receiver_id = req.user.id;
  const { error, result } = await NotificationService.deleteReadNotifications(receiver_id);
  if (error) return res.status(error.code).json(error);
  return res.status(200).json(result);
};

export const markAsUnread = async (req, res) => {
  const id = req.params.id;
  const {error, result} = await NotificationService.unRead(id);
  if(error) return res.status(error.code).json(error);
  return res.status(200).json(result);
}

export const unreadCount = async (req, res) => {
  const receiver_id = req.user.id;
  const { error, result } = NotificationService.countUnreadNotifications(receiver_id);
  if(error) return res.status(error.code).json(error);
  return res.status(200).json(result);
}