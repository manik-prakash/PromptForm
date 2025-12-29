'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardBody } from '@/components/ui/Card';
import { FormRenderer } from '@/components/forms/FormRenderer';
import type { FormSchema } from '@/types/index';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

interface PublicForm {
    id: string;
    title: string;
    schema: FormSchema;
}

interface PublicFormResponse {
    success: boolean;
    data: {
        form: PublicForm;
    };
}

async function getPublicForm(formId: string): Promise<PublicForm> {
    const response = await fetch(`${API_BASE_URL}/form/${formId}/public`);
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.error || 'Form not found');
    }
    return (data as PublicFormResponse).data.form;
}

async function submitPublicForm(formId: string, formData: Record<string, unknown>): Promise<{ success: boolean }> {
    const response = await fetch(`${API_BASE_URL}/form/${formId}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.error || 'Submission failed');
    }
    return data;
}

export default function PublicFormPage() {
    const params = useParams();
    const formId = params.formId as string;

    const [form, setForm] = useState<PublicForm | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [submitError, setSubmitError] = useState('');

    useEffect(() => {
        loadForm();
    }, [formId]);

    const loadForm = async () => {
        try {
            setIsLoading(true);
            const data = await getPublicForm(formId);
            setForm(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Form not found');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (data: Record<string, unknown>) => {
        setIsSubmitting(true);
        setSubmitError('');

        try {
            const res = await submitPublicForm(formId, data);
            console.log("-----------------------------------------");
            console.log(res);
            console.log("-----------------------------------------");
            setIsSubmitted(true);
        } catch (err) {
            setSubmitError(err instanceof Error ? err.message : 'Failed to submit');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-surface flex items-center justify-center">
                <div className="text-text-muted">Loading form...</div>
            </div>
        );
    }

    if (error || !form) {
        return (
            <div className="min-h-screen bg-surface flex items-center justify-center px-4">
                <Card className="w-full max-w-md">
                    <CardBody className="text-center py-12">
                        <svg
                            className="w-16 h-16 mx-auto mb-4 text-text-muted"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                        <h1 className="text-xl font-semibold text-text">Form not found</h1>
                        <p className="text-text-muted mt-2">
                            This form may have been deleted or the link is incorrect.
                        </p>
                    </CardBody>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-surface flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-lg">
                <Card>
                    <CardBody className="p-8">
                        {isSubmitted ? (
                            <div className="text-center py-8">
                                <div className="w-16 h-16 bg-success/30 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg
                                        className="w-8 h-8 text-success-text"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M5 13l4 4L19 7"
                                        />
                                    </svg>
                                </div>
                                <h2 className="text-xl font-semibold text-text mb-2">
                                    Thank you!
                                </h2>
                                <p className="text-text-muted">
                                    Your response has been submitted successfully.
                                </p>
                            </div>
                        ) : (
                            <>
                                <div className="text-center mb-8">
                                    <h1 className="text-2xl font-semibold text-text">
                                        {form.title}
                                    </h1>
                                    {form.schema.description && (
                                        <p className="text-text-muted mt-2">{form.schema.description}</p>
                                    )}
                                </div>

                                {submitError && (
                                    <div className="mb-6 p-3 bg-error/20 border border-error rounded-lg text-error-text text-sm">
                                        {submitError}
                                    </div>
                                )}

                                <FormRenderer
                                    schema={form.schema}
                                    onSubmit={handleSubmit}
                                    isSubmitting={isSubmitting}
                                    submitLabel="Submit"
                                />
                            </>
                        )}
                    </CardBody>
                </Card>

                <p className="text-center text-sm text-text-muted mt-6">
                    Powered by{' '}
                    <span className="font-medium text-primary">PromptForm</span>
                </p>
            </div>
        </div>
    );
}
