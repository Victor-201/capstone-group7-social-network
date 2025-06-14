import chatService from '../services/Chat.service.js';

export const createChat = async (req, res) => {
  const { id: otherUserId } = req.body;
  const userId = req.user.id;

  const { error, result } = await chatService.createPrivateChat(userId, otherUserId);

  if (error) return res.status(error.code).json({ error: error.message });
  return res.status(200).json(result);
};

export const getChatList = async (req, res) => {
  const userId = req.user.id;

  const { error, result } = await chatService.getPrivateChats(userId);

  if (error) return res.status(error.code).json({ error: error.message });
  return res.status(200).json(result);
};