import { Router } from 'express';
import { getProfile, updateProfile, updateProfileVisibility } from '../controllers/Profile.controller.js';

const router = Router();

router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.put('/profile/visibility', updateProfileVisibility);

export default router;