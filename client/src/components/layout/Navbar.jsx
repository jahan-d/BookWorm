'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { BookOpen, User as UserIcon, LogOut, Menu } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Navbar() {
    const { user, logout } = useAuth();
    const [scrolled, setScrolled] = React.useState(false);

    React.useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav className={cn(
            "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4",
            scrolled ? "glass shadow-lg py-3" : "bg-transparent"
        )}>
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                <Link href="/" className="flex items-center space-x-2 text-2xl font-bold">
                    <BookOpen className="w-8 h-8 text-primary" />
                    <span className="gradient-text">BookWorm</span>
                </Link>

                <div className="hidden md:flex items-center space-x-8">
                    <Link href="/books" className="hover:text-primary transition-colors">Explorer</Link>
                    {user && <Link href="/library" className="hover:text-primary transition-colors">My Library</Link>}
                    {user ? (
                        <>
                            <Link href="/dashboard" className="hover:text-primary transition-colors">Dashboard</Link>
                            <div className="flex items-center space-x-4">
                                <Link href="/profile" className="flex items-center space-x-2 glass px-3 py-1 rounded-full hover:bg-white/10 transition-colors">
                                    <UserIcon className="w-4 h-4" />
                                    <span className="text-sm font-medium">{user.name || user.displayName || user.email}</span>
                                </Link>
                                <button
                                    onClick={() => logout()}
                                    className="p-2 hover:bg-red-500/10 rounded-full text-red-400 transition-all"
                                >
                                    <LogOut className="w-5 h-5" />
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="flex items-center space-x-4">
                            <Link href="/login" className="px-5 py-2 rounded-full glass hover:bg-white/10 transition-all">Login</Link>
                            <Link href="/register" className="px-5 py-2 rounded-full bg-primary hover:bg-blue-600 shadow-lg shadow-blue-500/30 transition-all">Get Started</Link>
                        </div>
                    )}
                </div>

                <button className="md:hidden p-2">
                    <Menu className="w-6 h-6" />
                </button>
            </div>
        </nav>
    );
}
