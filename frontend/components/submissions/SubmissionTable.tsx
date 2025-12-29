'use client';

import { useState } from 'react';
import { Submission } from '@/types/index';
import { Button } from '@/components/ui/Button';

interface SubmissionTableProps {
    submissions: Submission[];
    onDelete?: (submissionId: string) => void;
    isDeleting?: string | null;
}

export function SubmissionTable({ submissions, onDelete, isDeleting }: SubmissionTableProps) {
    const [expandedJson, setExpandedJson] = useState<string | null>(null);
    const [copiedId, setCopiedId] = useState<string | null>(null);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const copyToClipboard = async (data: Record<string, unknown>, id: string) => {
        try {
            await navigator.clipboard.writeText(JSON.stringify(data, null, 2));
            setCopiedId(id);
            setTimeout(() => setCopiedId(null), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    if (submissions.length === 0) {
        return (
            <div className="text-center py-12 text-text-muted">
                No submissions yet.
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-sm">
                <thead>
                    <tr className="border-b border-border">
                        <th className="text-left py-3 px-4 font-medium text-text-muted">ID</th>
                        <th className="text-left py-3 px-4 font-medium text-text-muted">Submitted</th>
                        <th className="text-left py-3 px-4 font-medium text-text-muted">Data</th>
                        <th className="text-right py-3 px-4 font-medium text-text-muted">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {submissions.map((submission, index) => (
                        <tr
                            key={submission.id}
                            className={`border-b border-border ${index % 2 === 0 ? 'bg-white' : 'bg-surface/50'}`}
                        >
                            <td className="py-3 px-4 font-mono text-xs text-text-muted">
                                {submission.id.slice(0, 8)}...
                            </td>
                            <td className="py-3 px-4 text-text">
                                {formatDate(submission.createdAt)}
                            </td>
                            <td className="py-3 px-4">
                                <button
                                    onClick={() => setExpandedJson(expandedJson === submission.id ? null : submission.id)}
                                    className="text-primary hover:text-primary-hover text-sm"
                                >
                                    {expandedJson === submission.id ? 'Hide' : 'View'} JSON
                                </button>
                                {expandedJson === submission.id && (
                                    <pre className="mt-2 p-3 bg-surface rounded-lg text-xs overflow-x-auto max-w-md">
                                        {JSON.stringify(submission.data, null, 2)}
                                    </pre>
                                )}
                            </td>
                            <td className="py-3 px-4">
                                <div className="flex items-center justify-end gap-2">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => copyToClipboard(submission.data, submission.id)}
                                    >
                                        {copiedId === submission.id ? (
                                            <svg className="w-4 h-4 text-success-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        ) : (
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                            </svg>
                                        )}
                                    </Button>
                                    {onDelete && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => onDelete(submission.id)}
                                            isLoading={isDeleting === submission.id}
                                        >
                                            <svg className="w-4 h-4 text-error-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </Button>
                                    )}
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
