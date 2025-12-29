'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { FormRenderer } from '@/components/forms/FormRenderer';
import type { FormSchema } from '@/types/index';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

function getAuthToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('auth_token');
}

interface GenerateResponse {
    success: boolean;
    data: {
        schema: FormSchema;
    };
}

interface FormDetail {
    id: string;
    title: string;
    schema: FormSchema;
    createdAt: string;
    updatedAt: string;
    submissionCount: number;
}

interface FormResponse {
    success: boolean;
    data: {
        form: FormDetail;
    };
}

async function generateFormSchema(prompt: string): Promise<FormSchema> {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/form/generate`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ prompt }),
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.error || data.message || `HTTP ${response.status}`);
    }
    return (data as GenerateResponse).data.schema;
}

async function createForm(title: string, schema: FormSchema): Promise<FormDetail> {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/form/create`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ title, schema }),
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.error || data.message || `HTTP ${response.status}`);
    }
    return (data as FormResponse).data.form;
}

export default function CreateFormPage() {
    const router = useRouter();
    const [prompt, setPrompt] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [generatedSchema, setGeneratedSchema] = useState<FormSchema | null>(null);
    const [formTitle, setFormTitle] = useState('');
    const [error, setError] = useState('');

    const handleGenerate = async () => {
        if (!prompt.trim()) return;

        setIsGenerating(true);
        setError('');

        try {
            const schema = await generateFormSchema(prompt);
            setGeneratedSchema(schema);
            setFormTitle(schema.title || 'Untitled Form');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to generate form');
        } finally {
            setIsGenerating(false);
        }
    };

    const handleSave = async () => {
        if (!generatedSchema || !formTitle.trim()) return;

        setIsSaving(true);
        setError('');

        try {
            await createForm(formTitle, generatedSchema);
            router.push('/dashboard');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to save form');
        } finally {
            setIsSaving(false);
        }
    };

    const handlePreviewSubmit = (data: Record<string, unknown>) => {
        console.log('Preview submission:', data);
        alert('This is a preview. Data logged to console.');
    };

    return (
        <div>
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <Link
                    href="/dashboard"
                    className="p-2 hover:bg-surface rounded-lg transition-colors"
                >
                    <svg className="w-5 h-5 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </Link>
                <div>
                    <h1 className="text-2xl font-semibold text-text">Create Form</h1>
                    <p className="text-text-muted mt-1">Describe your form and let AI generate it</p>
                </div>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-error/20 border border-error rounded-lg text-error-text">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Prompt Input */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <h2 className="font-medium text-text">Describe your form</h2>
                        </CardHeader>
                        <CardBody>
                            <textarea
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                placeholder="e.g., Create a contact form with name, email, subject dropdown (General, Support, Sales), and message field. All fields required except message."
                                rows={6}
                                className="w-full px-3 py-2 bg-white border border-border rounded-lg text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none transition-colors"
                            />
                            <Button
                                onClick={handleGenerate}
                                isLoading={isGenerating}
                                disabled={!prompt.trim()}
                                className="w-full mt-4"
                            >
                                {isGenerating ? 'Generating...' : 'Generate Form'}
                            </Button>
                        </CardBody>
                    </Card>

                    {/* Save Form */}
                    {generatedSchema && (
                        <Card>
                            <CardHeader>
                                <h2 className="font-medium text-text">Save Form</h2>
                            </CardHeader>
                            <CardBody>
                                <label className="block text-sm font-medium text-text mb-1.5">
                                    Form Title
                                </label>
                                <input
                                    type="text"
                                    value={formTitle}
                                    onChange={(e) => setFormTitle(e.target.value)}
                                    className="w-full px-3 py-2 bg-white border border-border rounded-lg text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                                />
                                <Button
                                    onClick={handleSave}
                                    isLoading={isSaving}
                                    disabled={!formTitle.trim()}
                                    className="w-full mt-4"
                                >
                                    Save Form
                                </Button>
                            </CardBody>
                        </Card>
                    )}
                </div>

                {/* Preview */}
                <div>
                    <Card className="sticky top-8">
                        <CardHeader>
                            <h2 className="font-medium text-text">Preview</h2>
                        </CardHeader>
                        <CardBody>
                            {generatedSchema ? (
                                <FormRenderer
                                    schema={generatedSchema}
                                    onSubmit={handlePreviewSubmit}
                                    submitLabel="Submit (Preview)"
                                />
                            ) : (
                                <div className="text-center py-12 text-text-muted">
                                    <svg
                                        className="w-12 h-12 mx-auto mb-4 opacity-50"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={1.5}
                                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                        />
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={1.5}
                                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                        />
                                    </svg>
                                    <p>Your form preview will appear here</p>
                                </div>
                            )}
                        </CardBody>
                    </Card>
                </div>
            </div>
        </div>
    );
}
