import 'dotenv/config';
import express from 'express';
const app = express();
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { errorHandler, notFoundHandler } from './middleware/errorMiddleware.js';
import authRoutes from './routes/authRoutes.js';
import formRoutes from './routes/formRoutes.js';

const PORT = process.env.PORT;

app.use(helmet());
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// General limiter for all API traffic
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    standardHeaders: true,
    legacyHeaders: false,
});

// Tighter limiter for auth endpoints (brute force / credential stuffing protection)
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, error: 'Too many attempts, please try again later' },
});

// Tightest limiter for LLM generation (protects the free OpenRouter quota)
const generateLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    limit: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, error: 'Generation limit reached, please try again later' },
});

app.use('/api', apiLimiter);
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/signup', authLimiter);
app.use('/api/form/generate', generateLimiter);

app.use('/api/auth', authRoutes);
app.use('/api/form', formRoutes);

app.get('/', (req, res) => {
    res.json({
        message: 'backend API is running',
        timestamp: new Date().toISOString(),
    });
});

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
});

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
});