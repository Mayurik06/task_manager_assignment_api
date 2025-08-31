import { Request, Response, NextFunction } from 'express';
import { createTaskManagerService, deleteTasks, getAllTaskManagerService, getTaskManagerByIdService, updateTaskManagerService } from '../services/taskManagerService';
import { deleteTaskSchema, getAllTasksSchema, getTaskByIdSchema, taskmanagerSchema, taskUpdateSchema } from '../validations/taskmanagerValidation';


export const getAllTaskManagerController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { domainname } = req.headers;
        if (typeof domainname !== 'string') {
            res.status(400).json({ error: 'Missing domainname header' });
            return;
        }
 
        // Validate query params: limit, offset, search
        const { error, value } = getAllTasksSchema.validate(req.query);
        if (error) {
            res.status(400).json({ error: error.details[0].message });
            return;
        }
 
        const limit = Number(value.limit);
        const offset = Number(value.offset);
        const search = typeof value.search === 'string' ? value.search : undefined;
        const filter = typeof value.filter === 'string' ? value.filter : undefined;

        const result = await getAllTaskManagerService(domainname, limit, offset, search, filter, value.columnNames);
        res.status(200).json({ message: 'Task Managers fetched successfully', data: result });
        return;
    } catch (err: any) {
        console.error('Error in getAllTaskManagerController:', err);
        res.status(500).json({ error: err.message });
        return;
    }
};

export const createTaskManagerController = async (req: Request, res: Response) => {
    try {
        const { domainname } = req.headers;
        if (typeof domainname !== 'string') {
            res.status(400).json({ error: 'Missing domainname header' });
            return;
        }
        const { error, value } = taskmanagerSchema.validate(req.body);
        if (error) {
            res.status(400).json({ error: error.details[0].message });
            return;
        }
        const newTaskManagerId = await createTaskManagerService(value, domainname);
        res.status(201).json({ message: 'Task Manager created successfully', data: { id: newTaskManagerId } });
        return;
    } catch (err: any) {
        console.error('Error in Create Task Manager Service:', err);
        res.status(500).json({ error: err.message });
        return;
    }
};


export const getTaskManagerByIdController = async (req: Request, res: Response) => {
    try {
        const { domainname } = req.headers;
        if (typeof domainname !== 'string') {
            res.status(400).json({ error: 'Missing domainname header' });
            return;
        }
 
        const id = Number(req.params.id);
        const { error } = getTaskByIdSchema.validate({ id });
        if (error) {
            res.status(400).json({ error: error.details[0].message });
            return;
        }

        const taskManager = await getTaskManagerByIdService(domainname, id);
        if (!taskManager) {
            res.status(404).json({ error: 'Task Manager not found' });
            return;
        }
        res.status(200).json({ message: 'Task Manager fetched successfully', data: taskManager });
        return;
    } catch (err: any) {
        console.error('Error in getTaskManagerByIdController:', err);
        res.status(500).json({ error: err.message });
        return;
    }
};

export const updateTaskManagerController = async (req: Request, res: Response): Promise<any> => {
    try {
        const { domainname } = req.headers;
        if (typeof domainname !== 'string') {
            res.status(400).json({ error: 'Missing domainname header' });
            return;
        }
 
        const id = Number(req.params.id);
        const { error, value } = taskUpdateSchema.validate({
            params: { id },
            body: req.body,
        });
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }
        const updatedTaskManagerId = await updateTaskManagerService(id, req.body, domainname);
        res.status(200).json({ message: 'Task Manager updated successfully', data: { id: updatedTaskManagerId } });
        return;
    } catch (err: any) {
        console.error('Error in updateTaskManagerController:', err);
        res.status(500).json({ error: err.message });
        return;
    }
};

export const deleteTaskController=async (req: Request, res: Response) => {
    try {
        const { domainname } = req.headers;
        if (typeof domainname !== 'string') {
            res.status(400).json({ error: 'Missing domainname header' });
            return;
        }

        const id = Number(req.params.id);
        const { error } = deleteTaskSchema.validate({ id });
        if (error) {
            res.status(400).json({ error: error.details[0].message });
            return;
        }

        const success = await deleteTasks(id, domainname);
        if (!success) {
            res.status(404).json({ error: 'Task not found' });
            return;
        }
        res.status(200).json({ message: 'Task deleted successfully' });
        return;
    } catch (err: any) {
        console.error('Error in deleteTaskController:', err);
        res.status(500).json({ error: err.message });
        return;
    }
};
