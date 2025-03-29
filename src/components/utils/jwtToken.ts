
import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';


export const getToken = async(req: Request, res:Response)=>{
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
        return res.status(200).json({ message: 'Token is valid', decoded });
    }
    catch (error) {
        return res.status(401).json({ message: 'Invalid token' });
    }

}


