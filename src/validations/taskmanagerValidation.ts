import Joi from "joi";

export const taskmanagerSchema = Joi.object({
    title: Joi.string().required().messages({
        'any.required': 'Title is required',
        'string.empty': 'Title is required'
    }),
    description: Joi.string().allow("", null),
    status: Joi.string().valid("Pending", "In Progress", "Completed").required().messages({
        'any.required': 'Status is required',
        'any.only': 'Status must be one of Pending, In Progress, Completed',
        'string.empty': 'Status is required'
    }),
    duedate: Joi.string().required().messages({
        'any.required': 'Due date is required',
        'string.empty': 'Due date is required'
    })
});

export const taskUpdateSchema = Joi.object({
    params: Joi.object({
        id: Joi.number().integer().required().messages({
            'any.required': 'Task ID is required',
            'string.empty': 'Task ID is required'
        })
    }),
    body:Joi.object({
        title: Joi.string().allow("", null),
        description: Joi.string().allow("", null),
        status: Joi.string().valid("Pending", "In Progress", "Completed"),
        duedate: Joi.string().allow("", null)
    })
});

export const getAllTasksSchema = Joi.object({
    limit: Joi.number().min(1).default(10),
    offset: Joi.number().min(0).default(0),
    search: Joi.string().allow("", null),
    filter: Joi.string().allow("", null),
    columnNames: Joi.array().optional()
});


export const getTaskByIdSchema = Joi.object({
    id: Joi.number().integer().required().messages({
        'any.required': 'Task ID is required',
        'string.empty': 'Task ID is required'
    })
});

export const deleteTaskSchema = Joi.object({
    id: Joi.number().integer().required().messages({
        'any.required': 'Task ID is required',
        'string.empty': 'Task ID is required'
    })
});
