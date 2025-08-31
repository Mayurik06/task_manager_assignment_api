import pool from '../config/dbConfig';
import bcrypt from 'bcrypt';
 
export const loginService = async (
    username: string,
    password: string,
    domainName: string
): Promise<any> => {
 
    try {
        const sql = `
    SELECT "${domainName}".login_user($1::TEXT)
  `;
        const result = await pool.query(sql, [username]);
        console.log(result.rows[0])
        const user = result.rows[0].login_user;
        if (!user) {
            return { error: 'User not found' };
        }

        // Step 2: Compare hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return { error: 'Invalid credentials' };
        }
        console.log(isMatch)
        return user;
    }
    catch (err: any) {
        console.log(err)
        return { error: err.message, message: err.message };
    }
};

export const signupService = async (
    username: string,
    password: string,
    email: string,
    domainName: string
): Promise<any> => {
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const sql = `
            SELECT "${domainName}".signup_user($1::TEXT, $2::TEXT, $3::TEXT)
        `;
        const result = await pool.query(sql, [email, hashedPassword, username]);
        const user = result.rows[0].signup_user;
        if (!user) {
            return { error: 'User registration failed' };
        }
        return user;
    } catch (err: any) {
        console.log(err);
        return { error: err.message, message: err.message };
    }
};
