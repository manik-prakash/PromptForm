import { verifyToken } from '../utils/jwt.js';
import prisma from '../utils/db.js';
import { AppError } from './errorMiddleware.js';

export async function authenticate(req, res, next) {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new AppError('No token provided', 401);
        }

        const token = authHeader.split(' ')[1];
        const decoded = verifyToken(token);

        // Verify user still exists
        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
            select: { id: true, email: true },
        });

        if (!user) {
            throw new AppError('User no longer exists', 401);
        }

        req.user = user;
        next();
    } catch (error) {
        if (error.isOperational) {
            next(error);
        } else {
            next(new AppError('Invalid or expired token', 401));
        }
    }
}
