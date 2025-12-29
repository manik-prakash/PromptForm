'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card, CardBody } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { useAuth } from '@/context/AuthContext';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

function getAuthToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('auth_token');
}

interface FormItem {
    id: string;
    title: string;
    createdAt: string;
    updatedAt: string;
    submissionCount: number;
}

interface FormsListResponse {
    success: boolean;
    data: {
        forms: FormItem[];
    };
}

async function getForms(): Promise<FormItem[]> {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/form/allforms`, {
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.error || data.message || `HTTP ${response.status}`);
    }
    return (data as FormsListResponse).data.forms;
}

async function deleteForm(id: string): Promise<void> {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/form/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.error || data.message || `HTTP ${response.status}`);
    }
}

export default function DashboardPage() {
    const router = useRouter();
    const { isAuthenticated, isLoading: authLoading } = useAuth();
    const [forms, setForms] = useState<FormItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    useEffect(() => {
        if (authLoading) return;

        if (!isAuthenticated) {
            router.push('/login');
            return;
        }

        loadForms();
    }, [isAuthenticated, authLoading, router]);

    const loadForms = async () => {
        try {
            setIsLoading(true);
            const data = await getForms();
            setForms(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load forms');
        } finally {
            setIsLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const copyLink = async (form: FormItem) => {
        try {
            const url = `${window.location.origin}/form/${form.id}`;
            await navigator.clipboard.writeText(url);
            setCopiedId(form.id);
            setTimeout(() => setCopiedId(null), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    const handleDelete = async (formId: string) => {
        if (!confirm('Are you sure you want to delete this form?')) return;

        setDeletingId(formId);
        try {
            await deleteForm(formId);
            setForms(forms.filter(f => f.id !== formId));
        } catch (err) {
            alert(err instanceof Error ? err.message : 'Failed to delete');
        } finally {
            setDeletingId(null);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="text-text-muted">Loading forms...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="text-error-text">{error}</div>
            </div>
        );
    }

    return (
        <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-semibold text-text">My Forms</h1>
                    <p className="text-text-muted mt-1">Create and manage your forms</p>
                </div>
                <Link href="/dashboard/create">
                    <Button>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Create Form
                    </Button>
                </Link>
            </div>

            {/* Forms Grid */}
            {forms.length === 0 ? (
                <Card>
                    <EmptyState
                        icon={
                            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        }
                        title="No forms yet"
                        description="Create your first form using natural language prompts."
                        action={
                            <Link href="/dashboard/create">
                                <Button>Create your first form</Button>
                            </Link>
                        }
                    />
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {forms.map((form) => (
                        <Card key={form.id} className="hover:border-primary/50 transition-colors">
                            <CardBody className="p-5">
                                <Link href={`/dashboard/forms/${form.id}`}>
                                    <h3 className="font-medium text-text hover:text-primary transition-colors">
                                        {form.title}
                                    </h3>
                                </Link>

                                <div className="flex items-center gap-4 mt-4 text-sm text-text-muted">
                                    <span className="flex items-center gap-1">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        {formatDate(form.createdAt)}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                        </svg>
                                        {form.submissionCount} submissions
                                    </span>
                                </div>

                                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border">
                                    <Link href={`/dashboard/forms/${form.id}`} className="flex-1">
                                        <Button variant="outline" size="sm" className="w-full">
                                            View
                                        </Button>
                                    </Link>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => copyLink(form)}
                                        title="Copy public link"
                                    >
                                        {copiedId === form.id ? (
                                            <svg className="w-4 h-4 text-success-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        ) : (
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                            </svg>
                                        )}
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleDelete(form.id)}
                                        isLoading={deletingId === form.id}
                                        title="Delete form"
                                    >
                                        <svg className="w-4 h-4 text-error-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </Button>
                                </div>
                            </CardBody>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
