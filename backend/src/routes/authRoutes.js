import { Router } from 'express';
import { signup, login, getProfile } from '../controllers/authController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validateMiddleware.js';
import { signupSchema, loginSchema } from '../utils/types.js';

const router = Router();

router.post('/signup', validate(signupSchema), signup);

router.post('/login', validate(loginSchema), login);

router.get('/profile', authenticate, getProfile);

router.get('/me', authenticate, getProfile);

export default router;
