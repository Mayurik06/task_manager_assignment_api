import { task_manager_info } from '../columnInfo/taskManage_Column_info';
import pool from '../config/dbConfig';



interface ITaskManager {
    id?:number,
    title:string,
    status:string,
    description:string,
    duedate:string,
    createdat:string,
    updatedat:string
}

export const getTaskManagerByIdService = async (
    domainName: string,
    task_manager_id: number
): Promise<any> => {
    try {
        const sql = `SELECT * FROM "${domainName}".get_task_by_id($1)`;
        const result = await pool.query(sql, [task_manager_id]);
        return result.rows[0];
    } catch (err: any) {
        console.error('Error in getTaskManagerByIdService:', err);
        throw err;
    }
}
 

export const getAllTaskManagerService = async (
    domainName: string,
    limit: number,
    offset: number,
    search: string = "",
    filter: string = "",
    column_names: any = [],
): Promise<any> => {
    try {
        let columnNamesArray = Array.isArray(column_names) ? column_names : column_names?.split(',');
 
        // Validate column names and prepare them for SQL query
        columnNamesArray = columnNamesArray.filter((col: any) => Object.keys(task_manager_info).includes(col.trim()));

        // Prepare the column definitions for the query
        const columnDefs = columnNamesArray.map((col: any) => `${col} ${task_manager_info[col]}`).join(', ');

        const result = await pool.query(
            `SELECT * FROM "${domainName}".get_all_tasks($1, $2, $3::text[], $4, $5) AS t(${columnDefs})`,
            [limit, offset, columnNamesArray, search, filter]
        );

        const countQuery = `SELECT * FROM "${domainName}".count_tasks($1)`;
        let searchText = search == '' ? null : search;
        const countValue = [searchText];
        const countResult = await pool.query(countQuery, countValue);
        const count = countResult.rows[0].count_tasks;
        return { data: result.rows, count: count };
    } catch (err: any) {
        console.error('Error in getAllTaskManagerService:', err);
        throw err;
    }
};

export const createTaskManagerService = async (
    taskManagerData: ITaskManager,
    domainName: string
): Promise<number> => {
    try {
        const data = taskManagerData;
        // Call the stored function to insert a user and return its ID
        const sql = `SELECT "${domainName}".create_task($1,$2,$3,$4) AS id `;
        const values = [
         data.title,  data.description,   data.status, data.duedate
        ];  
        const result = await pool.query(sql, values);
        return result.rows[0].id;
    } catch (err: any) {
        console.error('Error in create_task_manager_service:', err);
        throw err;
    }
};
 
 
 
 
export const updateTaskManagerService = async (
    taskManagerId: number,
    updateData: Partial<ITaskManager>,
    domainName: string
): Promise<number> => {
    try {
        // Convert updateData to JSONB
        const updateJson = JSON.stringify(updateData);
        const sql = `SELECT "${domainName}".update_task($1::INTEGER, $2::JSONB) AS id`;
        const result = await pool.query(sql, [taskManagerId, updateJson]);
        if (result.rows.length === 0) {
            throw new Error('Task not found or update failed');
        }
        return result.rows[0].id;
    } catch (err: any) {
        console.error('Error in updateTaskManagerService:', err);
        throw err;
    }
};

export const deleteTasks = async (taskManagerId: number, domainName: string): Promise<boolean> => {
    try {
        const sql = `SELECT "${domainName}".delete_task($1::INTEGER) AS success`;
        const result = await pool.query(sql, [taskManagerId]);
        return result.rows[0].success;
    } catch (err: any) {
        console.error('Error in deleteTasks:', err);
        throw err;
    }
};