
export function errorHandler(err, req, res, next) {
    console.error('Error:', err);

    if (err.name === 'ZodError') {
        return res.status(400).json({
            success: false,
            error: 'Validation error',
            details: err.errors.map(e => ({
                field: e.path.join('.'),
                message: e.message,
            })),
        });
    }

    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({
            success: false,
            error: 'Invalid token',
        });
    }

    if (err.name === 'TokenExpiredError') {
        return res.status(401).json({
            success: false,
            error: 'Token expired',
        });
    }

    if (err.code === 'P2002') {
        return res.status(409).json({
            success: false,
            error: 'A record with this value already exists',
            field: err.meta?.target?.[0],
        });
    }

    if (err.code === 'P2025') {
        return res.status(404).json({
            success: false,
            error: 'Record not found',
        });
    }

    if (err.isOperational) {
        return res.status(err.statusCode || 500).json({
            success: false,
            error: err.message,
        });
    }

    res.status(500).json({
        success: false,
        error: process.env.NODE_ENV === 'development'
            ? err.message
            : 'Internal server error',
    });
}

export function notFoundHandler(req, res) {
    res.status(404).json({
        success: false,
        error: `Route ${req.method} ${req.path} not found`,
    });
}


export class AppError extends Error {
    constructor(message, statusCode = 500) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}

