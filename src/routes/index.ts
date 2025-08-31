import express from 'express';
    import taskManagerRouter from './taskManagerRoutes';
    import authRouter from './authRoutes';
import authenticateToken from '../middleware/authentication';

const router = express.Router();

router.use('/tasks', authenticateToken, taskManagerRouter)
router.use('/auth', authRouter)

export default router;