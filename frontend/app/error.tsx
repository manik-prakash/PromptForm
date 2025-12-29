'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardBody } from '@/components/ui/Card';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error('Error:', error);
    }, [error]);

    return (
        <div className="min-h-screen bg-surface flex items-center justify-center px-4">
            <Card className="w-full max-w-md">
                <CardBody className="text-center py-12">
                    <div className="w-16 h-16 bg-error/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg
                            className="w-8 h-8 text-error-text"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                            />
                        </svg>
                    </div>
                    <h1 className="text-xl font-semibold text-text mb-2">
                        Something went wrong
                    </h1>
                    <p className="text-text-muted mb-6">
                        An unexpected error occurred. Please try again.
                    </p>
                    {error.digest && (
                        <p className="text-xs text-text-muted mb-4 font-mono">
                            Error ID: {error.digest}
                        </p>
                    )}
                    <div className="flex gap-3 justify-center">
                        <Button variant="outline" onClick={() => window.location.href = '/'}>
                            Go Home
                        </Button>
                        <Button onClick={reset}>
                            Try Again
                        </Button>
                    </div>
                </CardBody>
            </Card>
        </div>
    );
}
