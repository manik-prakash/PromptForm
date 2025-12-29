import 'dotenv/config';
import express from 'express';
const app = express();
import cors from 'cors';
import { errorHandler, notFoundHandler } from './middleware/errorMiddleware.js';
import authRoutes from './routes/authRoutes.js';
import formRoutes from './routes/formRoutes.js';

const PORT = process.env.PORT;
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/form', formRoutes);

app.get('/', (req, res) => {
    res.json({
        message: 'backend API is running',
        timestamp: new Date().toISOString(),
    });
});

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
});