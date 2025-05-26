import models from '../models/index.js';

const { Friend } = models;

export const sendFriendRequest = async (req, res) => {
  const { friend_id } = req.body;
  const user_id = req.user.id;
  if (user_id === friend_id) {
    return res.status(400).json({ message: "Cannot do this action" });
  }

  try {
    await Friend.create({
      user_id,
      friend_id,
      status: 'pending'
    });
    return res.status(201).json({ message: "Send request successfull" });
  } catch (error) {
    console.error("Error sending friend request:", error);
    return res.status(500).json({ message: "Error" });
  }
};

export const respondToFriendRequest = async (req, res) => {
    const { friend_id, status } = req.body;
    const user_id = req.user.id;
    
    if (user_id === friend_id) {
        return res.status(400).json({ message: "Cannot do this action" });
    }
    
    try {
        const friendRequest = await Friend.findOne({
          where: { user_id: friend_id, friend_id: user_id }
        });
    
        if (!friendRequest) {
          return res.status(404).json({ message: "Friend request not found" });
        }
    
        friendRequest.status = status;
        await friendRequest.save();
    
        return res.status(200).json({ message: "Friend request updated successfully" });
    } catch (error) {
        console.error("Error responding to friend request:", error);
        return res.status(500).json({ message: "Error" });
    }
}