import { Request, Response } from 'express';
import jwt from 'jsonwebtoken'; 
import { loginSchema, signupSchema } from '../validations/authValidation';
import { loginService, signupService } from '../services/authValidationService';
 
export const loginController = async (req: Request, res: Response) => {
    try {
        const { domainname } = req.headers;
        if (typeof domainname !== 'string') {
            res.status(400).json({ error: 'Missing domainname header' });
            return;
        }
 
        const { error, value } = loginSchema.validate(req.body);
        if (error) {
            res.status(400).json({ error: error.details[0].message });
            return;
        }
 
        const data = await loginService(value.username, value.password, domainname);
 
        // ✅ Check for error returned by loginService
        if (data.error) {
            res.status(401).json({ error: data.error, message: data.message });
            return;
        }

        const token = jwt.sign(
            { id: data.id, type: 'role' },
            process.env.JWT_SECRET as string,
            { expiresIn: '24h' }
        );
 
        res.status(200).json({
            success: true,
            id: data.id,
            role: data.role_name,
            user_name: data.username,
            privileges: data.privileges,
            token,
            message: 'Login successful',
        });
    } catch (err: any) {
        console.error('Error in loginController:', err);
        res.status(500).json({ error: err.message });
    }
};
 
 export const signUpController= async(req:Request, res:Response)=>{
    try {
        const { domainname } = req.headers;
        if (typeof domainname !== 'string') {
            res.status(400).json({ error: 'Missing domainname header' });
            return;
        }

        const { error, value } = signupSchema.validate(req.body);
        if (error) {
            res.status(400).json({ error: error.details[0].message });
            return;
        }

        const data = await signupService(value.username, value.password, value.email, domainname);
console.log(data)
        if (data.error) {
            res.status(401).json({ error: data.error, message: data.message });
            return;
        }
        res.status(201).json({success: true, message: 'Signup successful', data:data});
    } catch (error: any) {
        console.error('Error in signUpController:', error);
        res.status(500).json({ error: error.message , message: error.message });
    }
 }