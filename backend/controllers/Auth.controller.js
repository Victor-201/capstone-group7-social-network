import registationValidate from "../validation/Registation.validation.js";
import signInValidate from "../validation/signIn.validation.js";
import models from "../models/index.js";
import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";

const { UserAccount, UserInfo} = models;

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
        // Create token
        const accessToken = jwt.sign({ 'id': user.id, 'userName': user.userName, 'roll': user.roll, 'email': user.email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1d' });
        // Remove password from response
        user.password = undefined;
        return res.status(200).json({
            name: "UserLoggedIn",
            message: "User logged in successfully",
            Token: accessToken
        });

    } catch (error) {
        return res.status(500).json({
            name: error.name,
            message: error.message
        });
    }
}