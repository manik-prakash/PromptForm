import { ReactNode } from 'react';

interface CardProps {
    children: ReactNode;
    className?: string;
}

interface CardHeaderProps {
    children: ReactNode;
    className?: string;
}

interface CardBodyProps {
    children: ReactNode;
    className?: string;
}

interface CardFooterProps {
    children: ReactNode;
    className?: string;
}

export function Card({ children, className = '' }: CardProps) {
    return (
        <div className={`bg-white border border-border rounded-xl ${className}`}>
            {children}
        </div>
    );
}

export function CardHeader({ children, className = '' }: CardHeaderProps) {
    return (
        <div className={`px-6 py-4 border-b border-border ${className}`}>
            {children}
        </div>
    );
}

export function CardBody({ children, className = '' }: CardBodyProps) {
    return (
        <div className={`px-6 py-4 ${className}`}>
            {children}
        </div>
    );
}

export function CardFooter({ children, className = '' }: CardFooterProps) {
    return (
        <div className={`px-6 py-4 border-t border-border ${className}`}>
            {children}
        </div>
    );
}
