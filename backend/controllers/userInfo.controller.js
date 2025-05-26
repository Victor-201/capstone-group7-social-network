import models from "../models/index.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const { UserAccount, UserInfo } = models;

export const getUserInfo = async (req, res) => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided!' });
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET); // Giả định bạn có biến này trong .env

    const user = await UserInfo.findOne({
      where: { id: decoded.id },
      attributes: [
        'id',
        'full_name',
        'bio',
        'gender',
        'birth_date',
        'location',
        'hometown',
        'avatar',
        'cover',
        'isOnline',
        'interestedUser'
      ]
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({ user });
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

export const updateUserInfo = async (req, res) => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided!' });
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await UserInfo.findOne({
      where: { id: decoded.id }
    });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const info = req.body;
    await UserInfo.update(
      { full_name: info.fullName, 
        bio: info.bio, 
        gender: info.gender, 
        birth_date: info.birthDate, 
        location: info.location,
        hometown: info.hometown
      }, {
      where: { id: decoded.id }
    });
    return res.status(200).json({ message: 'User info updated successfully' });
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

export const getUserInfoById = async (req, res) => {
  try {
    const { id } = req.params;
    const userInfo = await UserInfo.findOne({
      where: { id },
      attributes: [
        'id',
        'full_name',
        'bio',
        'gender',
        'birth_date',
        'location',
        'hometown',
        'avatar',
        'cover',
        'isOnline',
        'interestedUser'
      ]
    });
    if (!userInfo) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.status(200).json({ userInfo });
  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};
