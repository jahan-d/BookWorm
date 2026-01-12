'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Loader2 } from 'lucide-react';

export default function AdminLayout({ children }) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading) {
            if (!user) {
                router.push('/login');
            } else if (user.role !== 'admin') {
                router.push('/dashboard'); // Or library
            }
        }
    }, [user, loading, router]);

    if (loading || !user || user.role !== 'admin') {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="pt-20 px-6 pb-12">
            <div className="max-w-7xl mx-auto">
                <nav className="flex space-x-6 overflow-x-auto pb-4 mb-8 border-b border-white/10">
                    <NavLink href="/admin/dashboard" label="Overview" />
                    <NavLink href="/admin/books" label="Manage Books" />
                    <NavLink href="/admin/users" label="Users" />
                    <NavLink href="/admin/reviews" label="Reviews" />
                    <NavLink href="/admin/genres" label="Genres" />
                </nav>
                {children}
            </div>
        </div>
    );
}

function NavLink({ href, label }) {
    return (
        <a
            href={href}
            className="whitespace-nowrap px-4 py-2 rounded-full hover:bg-white/10 transition-colors text-sm font-medium"
        >
            {label}
        </a>
    );
}
