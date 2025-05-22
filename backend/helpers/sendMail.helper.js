import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

export const sendMail = async (email, subject, text) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        auth: {
            user: process.env.EMAIL_NAME,
            pass: process.env.EMAIL_PASSWORD,
        },
    });
    const mailOptions = {
        from: process.env.EMAIL_NAME,
        to: email,
        subject: subject,
        text: text,
    };
    try {
        const result = await transporter.sendMail(mailOptions);
        return result;
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Email sending failed');
    }
};