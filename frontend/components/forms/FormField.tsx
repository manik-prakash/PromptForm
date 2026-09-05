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

        case 'date':
            return (
                <Input
                    type="date"
                    label={field.label}
                    placeholder={field.placeholder}
                    error={errorMessage}
                    required={field.required}
                    {...register(field.id, {
                        required: field.required ? `${field.label} is required` : false,
                    })}
                />
            );

        case 'checkbox':
            return (
                <div className="space-y-1.5">
                    <label className="flex items-center gap-2 text-sm font-medium text-text">
                        <input
                            type="checkbox"
                            className="h-4 w-4 rounded border-border text-primary focus:ring-2 focus:ring-primary"
                            {...register(field.id, {
                                required: field.required ? `${field.label} is required` : false,
                            })}
                        />
                        {field.label}
                        {field.required && <span className="text-error-text ml-1">*</span>}
                    </label>
                    {errorMessage && (
                        <p className="text-sm text-error-text">{errorMessage}</p>
                    )}
                </div>
            );

        case 'radio':
            return (
                <div className="space-y-1.5">
                    <span className="block text-sm font-medium text-text">
                        {field.label}
                        {field.required && <span className="text-error-text ml-1">*</span>}
                    </span>
                    <div className="space-y-1">
                        {(field.options || []).map((option) => (
                            <label key={option.value} className="flex items-center gap-2 text-sm text-text">
                                <input
                                    type="radio"
                                    value={option.value}
                                    className="h-4 w-4 border-border text-primary focus:ring-2 focus:ring-primary"
                                    {...register(field.id, {
                                        required: field.required ? `${field.label} is required` : false,
                                    })}
                                />
                                {option.label}
                            </label>
                        ))}
                    </div>
                    {errorMessage && (
                        <p className="text-sm text-error-text">{errorMessage}</p>
                    )}
                </div>
            );

        default:
            return null;
    }
}

