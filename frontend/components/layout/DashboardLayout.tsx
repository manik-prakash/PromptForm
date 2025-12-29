import { ReactNode } from 'react';
import { Navbar } from './Navbar';

interface DashboardLayoutProps {
    children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
    return (
        <div className="min-h-screen bg-surface">
            <Navbar />
            <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
                {children}
            </main>
        </div>
    );
}

