'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { BookOpen, User as UserIcon, LogOut, Menu } from 'lucide-react';
import { cn } from '@/lib/utils';

import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
    const { user, logout } = useAuth();
    const [scrolled, setScrolled] = React.useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

    React.useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close menu when route changes (optional, but good UX if using Next.js Link which doesn't full pattern reload)
    // Actually, simply clicking a link should close it. I'll add a helper.
    const closeMenu = () => setIsMobileMenuOpen(false);

    return (
        <nav className={cn(
            "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4",
            scrolled || isMobileMenuOpen ? "glass shadow-lg py-3" : "bg-transparent"
        )}>
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                <Link href="/" className="flex items-center space-x-2 text-2xl font-bold" onClick={closeMenu}>
                    <BookOpen className="w-8 h-8 text-primary" />
                    <span className="gradient-text">BookWorm</span>
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center space-x-8">
                    <Link href="/books" className="hover:text-primary transition-colors">Explorer</Link>
                    {user && user.role !== 'admin' && <Link href="/library" className="hover:text-primary transition-colors">My Library</Link>}

                    {user && user.role === 'admin' && (
                        <div className="relative group">
                            <button className="flex items-center space-x-1 hover:text-primary transition-colors font-medium">
                                <span>Admin Tools</span>
                                <svg className="w-4 h-4 transition-transform group-hover:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                            <div className="absolute top-full left-0 pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                                <div className="glass border border-white/10 rounded-2xl p-4 w-48 shadow-2xl backdrop-blur-xl space-y-2">
                                    <Link href="/admin/dashboard" className="block p-2 hover:bg-white/10 rounded-lg transition-colors text-sm">Dashboard</Link>
                                    <Link href="/admin/books" className="block p-2 hover:bg-white/10 rounded-lg transition-colors text-sm">Manage Books</Link>
                                    <Link href="/admin/genres" className="block p-2 hover:bg-white/10 rounded-lg transition-colors text-sm">Manage Genres</Link>
                                    <Link href="/admin/users" className="block p-2 hover:bg-white/10 rounded-lg transition-colors text-sm">Manage Users</Link>
                                    <Link href="/admin/reviews" className="block p-2 hover:bg-white/10 rounded-lg transition-colors text-sm">Moderate Reviews</Link>
                                    <Link href="/admin/tutorials" className="block p-2 hover:bg-white/10 rounded-lg transition-colors text-sm">Manage Tutorials</Link>
                                </div>
                            </div>
                        </div>
                    )}

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

                {/* Mobile Menu Toggle */}
                <button
                    className="md:hidden p-2 z-50 text-white"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    {isMobileMenuOpen ? <LogOut className="w-6 h-6 rotate-180" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="absolute top-full left-0 right-0 glass border-t border-white/10 p-6 md:hidden flex flex-col space-y-2 shadow-2xl max-h-[80vh] overflow-y-auto"
                    >
                        <Link href="/books" className="text-lg font-medium hover:text-primary p-3 rounded-xl hover:bg-white/10 transition-all block" onClick={closeMenu}>Explorer</Link>
                        {user && user.role !== 'admin' && <Link href="/library" className="text-lg font-medium hover:text-primary p-3 rounded-xl hover:bg-white/10 transition-all block" onClick={closeMenu}>My Library</Link>}

                        {user ? (
                            <>
                                <Link href="/dashboard" className="text-lg font-medium hover:text-primary p-3 rounded-xl hover:bg-white/10 transition-all block" onClick={closeMenu}>Dashboard</Link>

                                {user.role === 'admin' && (
                                    <div className="border-t border-white/10 pt-4 mt-2">
                                        <p className="px-3 text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">Admin Tools</p>
                                        <div className="grid grid-cols-1 gap-2">
                                            <Link href="/admin/dashboard" className="text-lg font-medium hover:text-primary p-3 rounded-xl hover:bg-white/10 transition-all block" onClick={closeMenu}>Admin Dashboard</Link>
                                            <Link href="/admin/books" className="text-lg font-medium hover:text-primary p-3 rounded-xl hover:bg-white/10 transition-all block" onClick={closeMenu}>Manage Books</Link>
                                            <Link href="/admin/genres" className="text-lg font-medium hover:text-primary p-3 rounded-xl hover:bg-white/10 transition-all block" onClick={closeMenu}>Manage Genres</Link>
                                            <Link href="/admin/users" className="text-lg font-medium hover:text-primary p-3 rounded-xl hover:bg-white/10 transition-all block" onClick={closeMenu}>Manage Users</Link>
                                            <Link href="/admin/reviews" className="text-lg font-medium hover:text-primary p-3 rounded-xl hover:bg-white/10 transition-all block" onClick={closeMenu}>Moderate Reviews</Link>
                                            <Link href="/admin/tutorials" className="text-lg font-medium hover:text-primary p-3 rounded-xl hover:bg-white/10 transition-all block" onClick={closeMenu}>Manage Tutorials</Link>
                                        </div>
                                    </div>
                                )}

                                <Link href="/profile" className="text-lg font-medium hover:text-primary transition-all flex items-center justify-between bg-white/5 hover:bg-white/10 p-3 rounded-xl mt-4" onClick={closeMenu}>
                                    <span>My Profile</span>
                                    <UserIcon className="w-5 h-5" />
                                </Link>
                                <button
                                    onClick={() => { logout(); closeMenu(); }}
                                    className="w-full text-left text-lg font-medium text-red-400 flex items-center space-x-2 hover:bg-red-500/10 p-3 rounded-xl transition-all"
                                >
                                    <LogOut className="w-5 h-5" />
                                    <span>Logout</span>
                                </button>
                            </>
                        ) : (
                            <div className="grid grid-cols-2 gap-4 pt-4">
                                <Link href="/login" className="text-center px-5 py-3 rounded-xl glass hover:bg-white/10 transition-all font-bold" onClick={closeMenu}>Login</Link>
                                <Link href="/register" className="text-center px-5 py-3 rounded-xl bg-primary hover:bg-blue-600 shadow-lg shadow-blue-500/30 transition-all font-bold" onClick={closeMenu}>Get Started</Link>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
