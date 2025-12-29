'use client';

import { useEffect } from 'react';

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error('Global error:', error);
    }, [error]);

    return (
        <html>
            <body>
                <div style={{
                    minHeight: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#0f0f0f',
                    color: '#ffffff',
                    fontFamily: 'system-ui, -apple-system, sans-serif',
                    padding: '1rem',
                }}>
                    <div style={{
                        textAlign: 'center',
                        maxWidth: '400px',
                    }}>
                        <div style={{
                            width: '64px',
                            height: '64px',
                            margin: '0 auto 1.5rem',
                            backgroundColor: 'rgba(239, 68, 68, 0.2)',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                            <svg
                                width="32"
                                height="32"
                                fill="none"
                                stroke="#ef4444"
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
                        <h1 style={{
                            fontSize: '1.5rem',
                            fontWeight: '600',
                            marginBottom: '0.5rem',
                        }}>
                            Something went wrong
                        </h1>
                        <p style={{
                            color: '#9ca3af',
                            marginBottom: '1.5rem',
                            lineHeight: '1.5',
                        }}>
                            A critical error occurred. Please try again or contact support if the problem persists.
                        </p>
                        <button
                            onClick={reset}
                            style={{
                                backgroundColor: '#6366f1',
                                color: '#ffffff',
                                padding: '0.75rem 1.5rem',
                                borderRadius: '0.5rem',
                                border: 'none',
                                fontSize: '0.875rem',
                                fontWeight: '500',
                                cursor: 'pointer',
                            }}
                        >
                            Try again
                        </button>
                    </div>
                </div>
            </body>
        </html>
    );
}
