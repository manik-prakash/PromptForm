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

export const fieldTypeEnum = z.enum(['text', 'email', 'number', 'textarea', 'select', 'checkbox', 'radio', 'date']);

const selectOptionSchema = z.union([
    z.string(),
    z.object({ value: z.string(), label: z.string().optional() }),
]);

export const formFieldSchema = z.object({
    id: z.string().min(1, 'Field id is required'),
    label: z.string().min(1, 'Field label is required'),
    type: fieldTypeEnum,
    placeholder: z.string().optional(),
    required: z.boolean().optional().default(false),
    options: z.array(selectOptionSchema).optional(),
});

export const formSchemaSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().optional(),
    fields: z.array(formFieldSchema).min(1, 'At least one field is required'),
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
            case 'radio':
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

            case 'checkbox':
                if (typeof value !== 'boolean') {
                    errors.push({
                        field: fieldKey,
                        message: `${field.label} must be true or false`,
                    });
                } else if (field.required && value !== true) {
                    errors.push({
                        field: fieldKey,
                        message: `${field.label} must be checked`,
                    });
                } else {
                    validatedData[fieldKey] = value;
                }
                break;

            case 'date': {
                const dateValue = new Date(value);
                if (isNaN(dateValue.getTime())) {
                    errors.push({
                        field: fieldKey,
                        message: `${field.label} must be a valid date`,
                    });
                } else {
                    validatedData[fieldKey] = value;
                }
                break;
            }

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
