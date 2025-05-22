import { Router } from 'express';
import { signUp, signIn, signOut } from '../controllers/Auth.controller.js';
import { refreshToken } from '../controllers/refreshToken.controller.js';
import { forgotPassword, verifyOtpCode, resetPassword } from '../controllers/forgotPassword.controller.js';
const router = Router();

router.post('/register', signUp);
router.post('/login', signIn);
router.post('/signOut', signOut);
router.post('/refreshToken', refreshToken);
router.post('/forgotPassword', forgotPassword);
router.post('/verifyOtpCode', verifyOtpCode);
router.post('/resetPassword', resetPassword);

export default router;