import registationValidate from "../validation/Registation.validation.js";
import signInValidate from "../validation/signIn.validation.js";
import models from "../models/index.js";
import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";

const { UserAccount, UserInfo, RefreshToken} = models;

export const signUp = async (req, res) => {
    try {
        // Validate input
        const { error } = registationValidate.validate(req.body, { abortEarly: false });
        if (error) {
            const errors = error.details.map((err) => err.message);
            return res.status(400).json({
                name: error.name,
                message: errors
            });
        }

        // Check if user already exists
        const userExist = await UserAccount.findOne({ where: { email: req.body.email, user_name: req.body.userName, phone_number: req.body.phoneNumber } });
        if (userExist) {
            return res.status(400).json({
                name: "UserExist",
                message: "User already exists, please login"
            });
        }
        // Hash password
        const hashedPassword = await bcryptjs.hash(req.body.password, 10);

        // Create user info
        const userInfo = await UserInfo.create({
            full_name: req.body.fullName,
            gender: req.body.gender,
            birth_date: req.body.birthdate
        });
        // Create user
        const user = await UserAccount.create({
            id: userInfo.id,
            phone_number: req.body.phoneNumber,
            user_name: req.body.userName,
            email: req.body.email,
            password: hashedPassword,
        });
        // Remove password from response
        user.password = undefined;

        return res.status(201).json({
            name: "UserCreated",
            message: "User created successfully",
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
            },
        });

    } catch (error) {
        return res.status(500).json({
            name: error.name,
            message: error.message
        });
    }
};


export const signIn = async (req, res) => {
    try{
        // Validate
        const { error } = signInValidate.validate(req.body, { abortEarly: false });
        if (error) {
            const errors = error.details.map((err) => err.message);
            return res.status(400).json({
                name: error.name,
                message: errors
            });
        }
        // Check if user not exists
        const user = await UserAccount.findOne({ where: { user_name: req.body.userName } });
        if (!user) {
            return res.status(400).json({
                name: "UserNotFound",
                message: "User not found, please register"
            });
        }
        // Check password
        const isPasswordValid = await bcryptjs.compare(req.body.password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({
                name: "InvalidPassword",
                message: "Invalid password"
            });
        }
        // Create payload
        const payload = {
            id: user.id,
            userName: user.user_name,
            roll: user.roll,
            email: user.email
        };
        // Create Access token
        const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN });
        // Create Refresh token
        console.log("Refresh token expires at: ", process.env.REFRESH_TOKEN_EXPIRES_IN);
        const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN });
        // Set refresh token expiration date
        const decoded = jwt.decode(refreshToken);
        const expiresAt = new Date(decoded.exp * 1000);
        // Save refresh token to database
        await RefreshToken.create({
            user_id: user.id,
            token: refreshToken,
            expires_at: expiresAt,
        });
        // Remove password from response
        user.password = undefined;
        return res.status(200).json({
            name: "UserLoggedIn",
            message: "User logged in successfully",
            accessToken: accessToken,
            refreshToken: refreshToken,
        });

    } catch (error) {
        return res.status(500).json({
            name: error.name,
            message: error.message
        });
    }
}

export const signOut = async (req, res) => {
    try {
        const token = req.body.refreshToken;
        if (!token) {
            return res.status(400).json({
                name: "NoTokenProvided",
                message: "No token provided"
            });
        }
        const deleted = await RefreshToken.destroy({ where: { token: token } });
        if (deleted === 0) {
            return res.status(404).json({
                name: "TokenNotFound",
                message: "Token does not exist or already logged out"
            });
        }
        return res.status(200).json({
            name: "UserLoggedOut",
            message: "User logged out successfully"
        });
    } catch (error) {
        return res.status(500).json({
            name: error.name,
            message: error.message
        });
    }
};
