import bcrypt from 'bcryptjs';
import prisma from '../utils/db.js';
import { generateToken } from '../utils/jwt.js';
import { AppError } from '../middleware/errorMiddleware.js';

export async function signup(req, res, next) {
    try {
        const { email, password } = req.body;

        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            throw new AppError('Email already registered', 409);
        }

        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(password, salt);

        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
            },
            select: {
                id: true,
                email: true,
                createdAt: true,
            },
        });

        const token = generateToken({ userId: user.id, email: user.email });

        res.status(201).json({
            success: true,
            data: {
                user,
                token,
            },
        });
    } catch (error) {
        next(error);
    }
}

export async function login(req, res, next) {
    try {
        const { email, password } = req.body;

        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            throw new AppError('Invalid email or password', 401);
        }

        const isValidPassword = bcrypt.compareSync(password, user.password);

        if (!isValidPassword) {
            throw new AppError('Invalid email or password', 401);
        }

        const token = generateToken({ userId: user.id, email: user.email });

        res.json({
            success: true,
            data: {
                user: {
                    id: user.id,
                    email: user.email,
                    createdAt: user.createdAt,
                },
                token,
            },
        });
    } catch (error) {
        next(error);
    }
}

export async function getProfile(req, res, next) {
    try {
        res.json({
            success: true,
            data: {
                user: req.user,
            },
        });
    } catch (error) {
        next(error);
    }
}

