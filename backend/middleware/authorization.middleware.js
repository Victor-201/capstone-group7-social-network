import {
  ACCESS_TOKEN_SECRET,
} from "../configs/env.config.js";
import jwt from "jsonwebtoken";

if(!ACCESS_TOKEN_SECRET){
    throw new Error("Missing required token secrets in environment variables.");
}

export const verifyAdmin = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'No token provided!' });
    }
    jwt.verify(token, ACCESS_TOKEN_SECRET, (err, data) => {
        if (err) {
            return res.status(401).json({ message: 'Unauthorized!' });
        }
        if(data.role !== "admin") {
            return res.status(403).json({ message: 'Forbidden!' });
        }
        req.user = data;
        next();
    });
}

export const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'No token provided!' });
    }
    jwt.verify(token, ACCESS_TOKEN_SECRET, (err, data) => {
        if (err) {
            return res.status(401).json({ message: 'Unauthorized!' });
        }
        req.user = data;
        next();
    });
}

export const socketVerifyToken = (socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
        return next(new Error('Authentication token missing'));
    }
    jwt.verify(token, ACCESS_TOKEN_SECRET, (err, data) => {
        if (err) {
            return next(new Error('Invalid token'));
        }
        socket.user = data;
        console.log(`Token verified for user: ${data.id}`);
        next();
    });
}