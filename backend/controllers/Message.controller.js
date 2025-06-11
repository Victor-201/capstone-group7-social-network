import { createMessage } from "../services/createMessage.service.js";

export const sendMessage = async (req, res) => {
  const { content } = req.body;
  const senderId = req.user.id;
  const chatId = req.params.id;

  try {
    const message = await createMessage({ chatId, senderId, content });

    return res.status(201).json({
      message: 'Message sent successfully',
      data: message
    });
  } catch (err) {
    console.error('Error in sendMessage:', err);
    return res.status(400).json({ error: err.message });
  }
};

export const getMessagesByChat = async (req, res) => {
  const chat_id = req.params.chat_id;

  try {
    const messages = await Message.findAll({
      where: { chat_id },
      include: [{
        model: UserInfo,
        as: 'Sender',
        attributes: ['id', 'username', 'avatar']
      }],
      order: [['sent_at', 'ASC']]
    });

    return res.status(200).json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};