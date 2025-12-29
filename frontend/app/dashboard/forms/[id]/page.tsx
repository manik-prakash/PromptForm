'use client';

import { useState, useEffect, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { SubmissionTable } from '@/components/submissions/SubmissionTable';
import { useAuth } from '@/context/AuthContext';
import type { FormSchema, Submission } from '@/types/index';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

function getAuthToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('auth_token');
}

type TabType = 'submissions' | 'export';

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

interface SubmissionsResponse {
    success: boolean;
    data: {
        submissions: Submission[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    };
}

async function getForm(id: string): Promise<FormDetail> {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/form/${id}`, {
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.error || data.message || `HTTP ${response.status}`);
    }
    return (data as FormResponse).data.form;
}

async function getSubmissions(formId: string, page = 1, limit = 50): Promise<SubmissionsResponse['data']> {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/form/${formId}/submissions?page=${page}&limit=${limit}`, {
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.error || data.message || `HTTP ${response.status}`);
    }
    return (data as SubmissionsResponse).data;
}

export default function FormDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { isAuthenticated, isLoading: authLoading } = useAuth();
    const formId = params.id as string;

    const [form, setForm] = useState<FormDetail | null>(null);
    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState<TabType>('submissions');
    const [searchQuery, setSearchQuery] = useState('');
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (authLoading) return;

        if (!isAuthenticated) {
            router.push('/login');
            return;
        }

        loadData();
    }, [formId, isAuthenticated, authLoading, router]);

    const loadData = async () => {
        try {
            setIsLoading(true);
            const [formData, submissionsData] = await Promise.all([
                getForm(formId),
                getSubmissions(formId),
            ]);
            setForm(formData);
            setSubmissions(submissionsData.submissions);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load form');
        } finally {
            setIsLoading(false);
        }
    };

    const filteredSubmissions = useMemo(() => {
        if (!searchQuery.trim()) return submissions;
        const query = searchQuery.toLowerCase();
        return submissions.filter(sub =>
            JSON.stringify(sub.data).toLowerCase().includes(query)
        );
    }, [submissions, searchQuery]);

    const handleExport = async () => {
        if (!form) return;
        const json = JSON.stringify(form.schema, null, 2);
        await navigator.clipboard.writeText(json);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleDownload = () => {
        if (!form) return;
        const json = JSON.stringify(form.schema, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${form.title.toLowerCase().replace(/\s+/g, '-')}-schema.json`;
        a.click();
        URL.revokeObjectURL(url);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="text-text-muted">Loading...</div>
            </div>
        );
    }

    if (error || !form) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="text-error-text">{error || 'Form not found'}</div>
            </div>
        );
    }

    return (
        <div>
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
                <Link
                    href="/dashboard"
                    className="p-2 hover:bg-white rounded-lg transition-colors"
                >
                    <svg className="w-5 h-5 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </Link>
                <div className="flex-1">
                    <h1 className="text-2xl font-semibold text-text">{form.title}</h1>
                </div>
                <Link href={`/form/${formId}`} target="_blank">
                    <Button variant="outline">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        View Public Form
                    </Button>
                </Link>
            </div>

            {/* Tabs */}
            <div className="border-b border-border mb-6">
                <nav className="flex gap-6">
                    <button
                        onClick={() => setActiveTab('submissions')}
                        className={`pb-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'submissions'
                            ? 'border-primary text-primary'
                            : 'border-transparent text-text-muted hover:text-text'
                            }`}
                    >
                        Submissions ({submissions.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('export')}
                        className={`pb-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'export'
                            ? 'border-primary text-primary'
                            : 'border-transparent text-text-muted hover:text-text'
                            }`}
                    >
                        Export JSON
                    </button>
                </nav>
            </div>

            {/* Tab Content */}
            {activeTab === 'submissions' && (
                <div>
                    <div className="mb-4">
                        <Input
                            type="text"
                            placeholder="Search submissions..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="max-w-sm"
                        />
                    </div>

                    <Card>
                        <CardBody className="p-0">
                            <SubmissionTable
                                submissions={filteredSubmissions}
                            />
                        </CardBody>
                    </Card>
                </div>
            )}

            {activeTab === 'export' && (
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <h2 className="font-medium text-text">Form Schema (JSON)</h2>
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm" onClick={handleExport}>
                                    {copied ? (
                                        <>
                                            <svg className="w-4 h-4 text-success-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            Copied!
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                            </svg>
                                            Copy
                                        </>
                                    )}
                                </Button>
                                <Button variant="primary" size="sm" onClick={handleDownload}>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                    </svg>
                                    Download
                                </Button>
                            </div>
                        </div>
                    </CardHeader>
                    <CardBody>
                        <pre className="p-4 bg-surface rounded-lg text-sm overflow-x-auto font-mono">
                            {JSON.stringify(form.schema, null, 2)}
                        </pre>
                    </CardBody>
                </Card>
            )}
        </div>
    );
}
