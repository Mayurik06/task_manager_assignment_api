import express from 'express';
    import taskManagerRouter from './taskManagerRoutes';
    import authRouter from './authRoutes';

const router = express.Router();

router.use('/tasks', taskManagerRouter)
router.use('/auth', authRouter)

export default router;