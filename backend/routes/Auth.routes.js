import { Router } from 'express';
import {
  signUp,
  signIn,
  signOut,
  refreshToken,
  forgotPassword,
  verifyOtpCode,
  resetPassword
} from '../controllers/Auth.controller.js';

const router = Router();

// Auth routes
router.post('/register', signUp);                 
router.post('/login', signIn);                 
router.post('/logout', signOut);               
router.post('/refresh-token', refreshToken); 

// Forgot password flow
router.post('/forgot-password', forgotPassword);
router.post('/verify-otp', verifyOtpCode);
router.post('/reset-password', resetPassword);

export default router;
