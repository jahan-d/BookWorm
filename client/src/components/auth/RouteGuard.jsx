'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Loader2 } from 'lucide-react';

export default function RouteGuard({ children }) {
    const { user, loading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    const publicPaths = ['/login', '/register'];

    useEffect(() => {
        if (!loading) {
            if (!user && !publicPaths.includes(pathname)) {
                router.push('/login');
            } else if (user) {
                // Redirect logic for root path
                if (pathname === '/') {
                    if (user.role === 'admin') {
                        router.push('/admin/dashboard');
                    } else {
                        router.push('/library');
                    }
                }
                // Prevent authenticated users from accessing login/register
                if (publicPaths.includes(pathname)) {
                    if (user.role === 'admin') {
                        router.push('/admin/dashboard');
                    } else {
                        router.push('/library');
                    }
                }
            }
        }
    }, [user, loading, pathname, router]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black text-white">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
            </div>
        );
    }

    // While redirecting, show nothing or loader to prevent flashing
    if (!user && !publicPaths.includes(pathname)) {
        return null;
    }

    return children;
}
