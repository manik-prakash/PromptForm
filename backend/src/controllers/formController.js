import prisma from '../utils/db.js';
import { generateFormSchema } from '../services/llmService.js';
import { AppError } from '../middleware/errorMiddleware.js';

// Generate schema from prompt (preview only, no save)
export async function generateSchema(req, res, next) {
    try {
        const { prompt } = req.body;

        if (!prompt || prompt.trim().length === 0) {
            throw new AppError('Prompt is required', 400);
        }

        const schema = await generateFormSchema(prompt);

        res.json({
            success: true,
            data: {
                schema,
            },
        });
    } catch (error) {
        next(error);
    }
}

// Create form with provided schema (save to DB)
export async function createForm(req, res, next) {
    try {
        const { title, schema } = req.body;
        const userId = req.user.id;

        if (!title || !schema) {
            throw new AppError('Title and schema are required', 400);
        }

        const form = await prisma.form.create({
            data: {
                title: title,
                schema: schema,
                userId: userId,
            },
        });

        res.status(201).json({
            success: true,
            data: {
                form: {
                    id: form.id,
                    title: form.title,
                    schema: form.schema,
                    createdAt: form.createdAt,
                },
            },
        });
    } catch (error) {
        next(error);
    }
}

export async function listForms(req, res, next) {
    try {
        const userId = req.user.id;

        const forms = await prisma.form.findMany({
            where: {
                userId: userId,
                isDeleted: false,
            },
            select: {
                id: true,
                title: true,
                createdAt: true,
                updatedAt: true,
                _count: {
                    select: {
                        submissions: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        res.json({
            success: true,
            data: {
                forms: forms.map(form => ({
                    ...form,
                    submissionCount: form._count.submissions,
                    _count: undefined,
                })),
            },
        });
    } catch (error) {
        next(error);
    }
}

export async function getForm(req, res, next) {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const form = await prisma.form.findFirst({
            where: {
                id: id,
                userId: userId,
                isDeleted: false,
            },
            select: {
                id: true,
                title: true,
                schema: true,
                createdAt: true,
                updatedAt: true,
                _count: {
                    select: {
                        submissions: true,
                    },
                },
            },
        });

        if (!form) {
            throw new AppError('Form not found', 404);
        }

        res.json({
            success: true,
            data: {
                form: {
                    ...form,
                    submissionCount: form._count.submissions,
                    _count: undefined,
                },
            },
        });
    } catch (error) {
        next(error);
    }
}

export async function getPublicForm(req, res, next) {
    try {
        const { id } = req.params;

        const form = await prisma.form.findFirst({
            where: {
                id: id,
                isDeleted: false,
            },
            select: {
                id: true,
                title: true,
                schema: true,
            },
        });

        if (!form) {
            throw new AppError('Form not found', 404);
        }

        res.json({
            success: true,
            data: {
                form,
            },
        });
    } catch (error) {
        next(error);
    }
}

export async function deleteForm(req, res, next) {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const form = await prisma.form.findFirst({
            where: {
                id: id,
                userId: userId,
                isDeleted: false,
            },
        });

        if (!form) {
            throw new AppError('Form not found', 404);
        }

        await prisma.form.update({
            where: { id: id },
            data: { isDeleted: true },
        });

        res.json({
            success: true,
            message: 'Form deleted successfully',
        });
    } catch (error) {
        next(error);
    }
}

