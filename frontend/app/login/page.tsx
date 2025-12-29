'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardBody } from '@/components/ui/Card';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
    const { login, isLoading: authLoading } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            await login(email, password);
            // Redirect is handled by AuthContext
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Login failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-surface flex items-center justify-center px-4">
            <div className="w-full max-w-sm">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-primary rounded-xl mb-4">
                        <svg
                            className="w-7 h-7 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-semibold text-text">Welcome back</h1>
                    <p className="text-text-muted mt-1">Sign in to your PromptForm account</p>
                </div>

                {/* Login Form */}
                <Card>
                    <CardBody className="p-6">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {error && (
                                <div className="p-3 bg-error/20 border border-error rounded-lg text-error-text text-sm">
                                    {error}
                                </div>
                            )}

                            <Input
                                type="email"
                                label="Email address"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />

                            <Input
                                type="password"
                                label="Password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />

                            <Button type="submit" isLoading={isLoading} className="w-full">
                                Sign in
                            </Button>
                        </form>
                    </CardBody>
                </Card>

                {/* Sign up link */}
                <p className="text-center text-sm text-text-muted mt-6">
                    Don&apos;t have an account?{' '}
                    <Link href="/signup" className="text-primary hover:text-primary-hover font-medium">
                        Create one
                    </Link>
                </p>
            </div>
        </div>
    );
}
