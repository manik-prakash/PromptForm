'use client';

import { useForm } from 'react-hook-form';
import { FormSchema } from '@/types/index';
import { FormField } from './FormField';
import { Button } from '@/components/ui/Button';

interface FormRendererProps {
    schema: FormSchema;
    onSubmit: (data: Record<string, unknown>) => void | Promise<void>;
    isSubmitting?: boolean;
    submitLabel?: string;
}

export function FormRenderer({
    schema,
    onSubmit,
    isSubmitting = false,
    submitLabel = 'Submit',
}: FormRendererProps) {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<Record<string, unknown>>();

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {schema.fields.map((field) => (
                <FormField
                    key={field.id}
                    field={field}
                    register={register}
                    errors={errors}
                />
            ))}
            <div className="pt-2">
                <Button type="submit" isLoading={isSubmitting} className="w-full">
                    {submitLabel}
                </Button>
            </div>
        </form>
    );
}
