import { z } from 'zod';

export const signupSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
});

export const createFormSchema = z.object({
    prompt: z.string().min(10, 'Prompt must be at least 10 characters'),
});

export const fieldTypeEnum = z.enum(['text', 'email', 'number', 'textarea', 'select']);

export const formFieldSchema = z.object({
    name: z.string().min(1, 'Field name is required'),
    label: z.string().min(1, 'Field label is required'),
    type: fieldTypeEnum,
    required: z.boolean(),
    options: z.array(z.string()).optional(),
});

export const paginationSchema = z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(10),
    search: z.string().optional(),
    searchField: z.string().optional(),
});

export function validateSubmission(formSchema, submissionData) {
    const errors = [];
    const validatedData = {};

    for (const field of formSchema.fields) {
        const fieldKey = field.id;
        const value = submissionData[fieldKey];

        // Check required fields
        if (field.required && (value === undefined || value === null || value === '')) {
            errors.push({
                field: fieldKey,
                message: `${field.label} is required`,
            });
            continue;
        }

        // Skip validation if field is optional and empty
        if (!field.required && (value === undefined || value === null || value === '')) {
            continue;
        }

        // Type-specific validation
        switch (field.type) {
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    errors.push({
                        field: fieldKey,
                        message: `${field.label} must be a valid email`,
                    });
                } else {
                    validatedData[fieldKey] = value;
                }
                break;

            case 'number':
                const numValue = Number(value);
                if (isNaN(numValue)) {
                    errors.push({
                        field: fieldKey,
                        message: `${field.label} must be a number`,
                    });
                } else {
                    validatedData[fieldKey] = numValue;
                }
                break;

            case 'select':
                if (field.options) {
                    // Handle options as objects {value, label} or as simple strings
                    const validValues = field.options.map(opt =>
                        typeof opt === 'object' ? opt.value : opt
                    );
                    if (!validValues.includes(value)) {
                        const displayValues = field.options.map(opt =>
                            typeof opt === 'object' ? opt.label || opt.value : opt
                        );
                        errors.push({
                            field: fieldKey,
                            message: `${field.label} must be one of: ${displayValues.join(', ')}`,
                        });
                    } else {
                        validatedData[fieldKey] = value;
                    }
                } else {
                    validatedData[fieldKey] = value;
                }
                break;

            case 'text':
            case 'textarea':
            default:
                if (typeof value !== 'string') {
                    errors.push({
                        field: fieldKey,
                        message: `${field.label} must be a string`,
                    });
                } else {
                    validatedData[fieldKey] = value;
                }
                break;
        }
    }

    if (errors.length > 0) {
        return { success: false, errors };
    }

    return { success: true, data: validatedData };
}
