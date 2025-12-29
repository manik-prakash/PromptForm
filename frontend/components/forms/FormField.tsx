'use client';

import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { FormFieldSchema } from '@/types/index';
import { Input, Textarea, Select } from '@/components/ui/Input';

interface FormFieldProps {
    field: FormFieldSchema;
    register: UseFormRegister<Record<string, unknown>>;
    errors: FieldErrors<Record<string, unknown>>;
}

export function FormField({ field, register, errors }: FormFieldProps) {
    const error = errors[field.id];
    const errorMessage = error?.message as string | undefined;

    switch (field.type) {
        case 'text':
            return (
                <Input
                    type="text"
                    label={field.label}
                    placeholder={field.placeholder}
                    error={errorMessage}
                    required={field.required}
                    {...register(field.id, {
                        required: field.required ? `${field.label} is required` : false,
                    })}
                />
            );

        case 'email':
            return (
                <Input
                    type="email"
                    label={field.label}
                    placeholder={field.placeholder}
                    error={errorMessage}
                    required={field.required}
                    {...register(field.id, {
                        required: field.required ? `${field.label} is required` : false,
                        pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: 'Please enter a valid email address',
                        },
                    })}
                />
            );

        case 'number':
            return (
                <Input
                    type="number"
                    label={field.label}
                    placeholder={field.placeholder}
                    error={errorMessage}
                    required={field.required}
                    {...register(field.id, {
                        required: field.required ? `${field.label} is required` : false,
                        valueAsNumber: true,
                    })}
                />
            );

        case 'textarea':
            return (
                <Textarea
                    label={field.label}
                    placeholder={field.placeholder}
                    error={errorMessage}
                    required={field.required}
                    {...register(field.id, {
                        required: field.required ? `${field.label} is required` : false,
                    })}
                />
            );

        case 'select':
            return (
                <Select
                    label={field.label}
                    options={field.options || []}
                    error={errorMessage}
                    required={field.required}
                    {...register(field.id, {
                        required: field.required ? `${field.label} is required` : false,
                    })}
                />
            );

        default:
            return null;
    }
}

