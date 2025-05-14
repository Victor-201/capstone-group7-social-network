import { Router } from 'express';
import { signUp, signIn, signOut } from '../controllers/Auth.controller.js';
import { refreshToken } from '../controllers/refreshToken.controller.js';
const router = Router();

router.post('/signUp', signUp);
router.post('/signIn', signIn);
router.post('/signOut', signOut);
router.post('/refreshToken', refreshToken);

export default router;