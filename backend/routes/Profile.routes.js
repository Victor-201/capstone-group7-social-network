import { Router } from 'express';
import { GetProfile, UpdateProfile, UpdateProfileVisibility } from '../controllers/Profile.controller.js';

const router = Router();

router.get('/profile', GetProfile);
router.put('/profile', UpdateProfile);
router.put('/profile/visibility', UpdateProfileVisibility);

export default router;