import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import models from '../models/index.js';

dotenv.config();

const { RefreshToken, UserInfo } = models;

export const refreshToken = async (req, res) => {
    const token = req.body.refreshToken;
    if (!token) {
        return res.status(403).json({ message: 'No token provided!' });
    }

    try {
        const tokenRecord = await RefreshToken.findOne({ where: { token: token } });

        if (!tokenRecord) {
            return res.status(403).json({ message: 'Invalid refresh token!' });
        }

        // Xác thực chữ ký và hạn token
        jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, async (err, data) => {
            if (err) {
                return res.status(401).json({ message: 'Unauthorized or token expired!' });
            }

            const userInfo = await UserInfo.findByPk(data.id);
            if (!userInfo) {
                return res.status(404).json({ message: 'User not found!' });
            }

            const payload = {
                id: data.id,
                userName: data.userName,
                roll: data.roll,
                email: data.email,
            };

            const newAccessToken = jwt.sign(
                payload,
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN }
            );

            return res.status(200).json({
                name: "AccessTokenGenerated",
                message: "Access token generated successfully",
                accessToken: newAccessToken,
            });
        });

    } catch (error) {
        return res.status(500).json({
            name: error.name,
            message: error.message,
        });
    }
};
