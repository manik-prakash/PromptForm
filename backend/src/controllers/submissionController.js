import prisma from '../utils/db.js';
import { validateSubmission } from '../utils/types.js';
import { AppError } from '../middleware/errorMiddleware.js';

export async function submitForm(req, res, next) {
    try {
        const { id } = req.params;
        const submissionData = req.body;

        const form = await prisma.form.findFirst({
            where: {
                id: id,
                isDeleted: false,
            },
        });

        if (!form) {
            throw new AppError('Form not found', 404);
        }

        const validation = validateSubmission(form.schema, submissionData);

        if (!validation.success) {
            console.log('validation error', validation.errors);
            return res.status(400).json({
                success: false,
                error: 'Validation failed',
                details: validation.errors,
            });
        }

        const submission = await prisma.submission.create({
            data: {
                formId: id,
                data: validation.data,
            },
        });

        res.status(201).json({
            success: true,
            message: 'Form submitted successfully',
            data: {
                submissionId: submission.id,
                createdAt: submission.createdAt,
            },
        });
    } catch (error) {
        next(error);
    }
}

export async function getSubmissions(req, res, next) {
    try {
        const { id } = req.params;
        const { page = 1, limit = 10, search, searchField } = req.validated?.query || req.query;
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

        const skip = (parseInt(page) - 1) * parseInt(limit);
        const take = parseInt(limit);

        let whereClause = { formId: id };

        if (search && searchField) {
            const submissions = await prisma.$queryRaw`
        SELECT id, data, "createdAt"
        FROM "Submission"
        WHERE "formId" = ${id}
        AND data->>CAST(${searchField} AS TEXT) ILIKE ${`%${search}%`}
        ORDER BY "createdAt" DESC
        LIMIT ${take}
        OFFSET ${skip}
      `;

            const countResult = await prisma.$queryRaw`
        SELECT COUNT(*)::int as count
        FROM "Submission"
        WHERE "formId" = ${id}
        AND data->>CAST(${searchField} AS TEXT) ILIKE ${`%${search}%`}
      `;

            const total = countResult[0]?.count || 0;

            return res.json({
                success: true,
                data: {
                    submissions,
                    pagination: {
                        page: parseInt(page),
                        limit: parseInt(limit),
                        total,
                        totalPages: Math.ceil(total / take),
                    },
                },
            });
        }

        if (search) {
            const submissions = await prisma.$queryRaw`
        SELECT id, data, "createdAt"
        FROM "Submission"
        WHERE "formId" = ${id}
        AND data::text ILIKE ${`%${search}%`}
        ORDER BY "createdAt" DESC
        LIMIT ${take}
        OFFSET ${skip}
      `;

            const countResult = await prisma.$queryRaw`
        SELECT COUNT(*)::int as count
        FROM "Submission"
        WHERE "formId" = ${id}
        AND data::text ILIKE ${`%${search}%`}
      `;

            const total = countResult[0]?.count || 0;

            return res.json({
                success: true,
                data: {
                    submissions,
                    pagination: {
                        page: parseInt(page),
                        limit: parseInt(limit),
                        total,
                        totalPages: Math.ceil(total / take),
                    },
                },
            });
        }

        const [submissions, total] = await Promise.all([
            prisma.submission.findMany({
                where: whereClause,
                select: {
                    id: true,
                    data: true,
                    createdAt: true,
                },
                orderBy: {
                    createdAt: 'desc',
                },
                skip,
                take,
            }),
            prisma.submission.count({ where: whereClause }),
        ]);

        res.json({
            success: true,
            data: {
                submissions,
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    total,
                    totalPages: Math.ceil(total / take),
                },
            },
        });
    } catch (error) {
        next(error);
    }
}

/**
 * Export all submissions as JSON
 */
export async function exportSubmissions(req, res, next) {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        // Verify form ownership
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
            },
        });

        if (!form) {
            throw new AppError('Form not found', 404);
        }

        // Get all submissions
        const submissions = await prisma.submission.findMany({
            where: { formId: id },
            select: {
                id: true,
                data: true,
                createdAt: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        // Set headers for file download
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Disposition', `attachment; filename="${form.title.replace(/[^a-z0-9]/gi, '_')}_submissions.json"`);

        res.json({
            form: {
                id: form.id,
                title: form.title,
                schema: form.schema,
            },
            exportedAt: new Date().toISOString(),
            totalSubmissions: submissions.length,
            submissions: submissions,
        });
    } catch (error) {
        next(error);
    }
}

