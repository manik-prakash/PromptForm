'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface User {
    id: string;
    email: string;
    createdAt: string;
}

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<void>;
    signup: (email: string, password: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

function getAuthToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('auth_token');
}

function setAuthToken(token: string): void {
    localStorage.setItem('auth_token', token);
}

function clearAuthToken(): void {
    localStorage.removeItem('auth_token');
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isMounted, setIsMounted] = useState(false);

    // Check for existing auth on mount
    useEffect(() => {
        setIsMounted(true);
        let isCancelled = false;

        const checkAuth = async () => {
            const token = getAuthToken();
            if (!token) {
                if (!isCancelled) {
                    setIsLoading(false);
                }
                return;
            }

            try {
                const response = await fetch(`${API_BASE_URL}/auth/me`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (isCancelled) return;

                if (response.ok) {
                    const data = await response.json();
                    setUser(data.data.user);
                } else {
                    clearAuthToken();
                }
            } catch (error) {
                if (!isCancelled) {
                    console.error('Auth check failed:', error);
                    clearAuthToken();
                }
            } finally {
                if (!isCancelled) {
                    setIsLoading(false);
                }
            }
        };

        checkAuth();

        return () => {
            isCancelled = true;
        };
    }, []);

    const login = useCallback(async (email: string, password: string) => {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || data.message || 'Login failed');
        }

        setAuthToken(data.data.token);
        setUser(data.data.user);
        router.push('/dashboard');
    }, [router]);

    const signup = useCallback(async (email: string, password: string) => {
        const response = await fetch(`${API_BASE_URL}/auth/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || data.message || 'Signup failed');
        }

        setAuthToken(data.data.token);
        setUser(data.data.user);
        router.push('/dashboard');
    }, [router]);

    const logout = useCallback(() => {
        clearAuthToken();
        setUser(null);
        router.push('/login');
    }, [router]);

    return (
        <AuthContext.Provider
            value={{
                user,
                isLoading,
                isAuthenticated: !!user,
                login,
                signup,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
