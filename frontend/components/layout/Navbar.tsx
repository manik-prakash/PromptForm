'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';

export function Navbar() {
    const { user, logout, isLoading } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const displayName = user?.email?.split('@')[0] || 'User';

    return (
        <nav className="bg-white border-b border-border">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/dashboard" className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                            <svg
                                className="w-5 h-5 text-white"
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
                        <span className="text-lg font-semibold text-text">PromptForm</span>
                    </Link>

                    {/* User menu */}
                    {!isLoading && user && (
                        <div className="relative">
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-surface transition-colors"
                            >
                                <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                                    <span className="text-sm font-medium text-primary">
                                        {displayName.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                                <span className="hidden sm:block text-sm text-text">{displayName}</span>
                                <svg
                                    className="w-4 h-4 text-text-muted"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M19 9l-7 7-7-7"
                                    />
                                </svg>
                            </button>

                            {isMenuOpen && (
                                <>
                                    <div
                                        className="fixed inset-0 z-10"
                                        onClick={() => setIsMenuOpen(false)}
                                    />
                                    <div className="absolute right-0 mt-2 w-48 bg-white border border-border rounded-lg shadow-lg py-1 z-20">
                                        <div className="px-4 py-2 text-xs text-text-muted border-b border-border">
                                            {user.email}
                                        </div>
                                        <Link
                                            href="/dashboard"
                                            className="block px-4 py-2 text-sm text-text hover:bg-surface"
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            Dashboard
                                        </Link>
                                        <hr className="my-1 border-border" />
                                        <button
                                            className="w-full text-left px-4 py-2 text-sm text-error-text hover:bg-surface"
                                            onClick={() => {
                                                setIsMenuOpen(false);
                                                logout();
                                            }}
                                        >
                                            Sign out
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}

