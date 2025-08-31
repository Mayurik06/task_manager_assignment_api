import express from 'express';
import { createTaskManagerController, deleteTaskController, getAllTaskManagerController, getTaskManagerByIdController, updateTaskManagerController } from '../Controllers/taskManagerController';


const router = express.Router()

router.post('/', createTaskManagerController)
router.get('/', getAllTaskManagerController)
router.get('/:id', getTaskManagerByIdController)
router.put('/:id', updateTaskManagerController)
router.delete('/:id', deleteTaskController)

export default router