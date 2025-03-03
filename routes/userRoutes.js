import express from 'express';
import { authUser, registerUser, getUserProfile, updateUser } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/login', authUser);
router.post('/register', registerUser);
router.put('/update',updateUser)
router.get('/profile', protect, getUserProfile);

export default router;
