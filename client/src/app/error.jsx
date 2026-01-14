'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import Link from 'next/link';

export default function Error({ error, reset }) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-[#09090b] relative overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute top-1/4 -left-20 w-80 h-80 bg-blue-500/10 rounded-full blur-[120px] animate-pulse" />
            <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-purple-500/10 rounded-full blur-[120px] animate-pulse delay-700" />

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-md w-full glass p-10 rounded-[2.5rem] border border-white/10 text-center relative z-10"
            >
                <div className="w-20 h-20 bg-red-500/10 rounded-3xl flex items-center justify-center mx-auto mb-8">
                    <AlertTriangle className="w-10 h-10 text-red-500" />
                </div>

                <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                    Shelf Collapse!
                </h1>

                <p className="text-muted-foreground mb-10 leading-relaxed text-lg">
                    Something went wrong while loading this page. We're dusting off the shelves to get it fixed.
                </p>

                <div className="flex flex-col gap-4">
                    <button
                        onClick={() => reset()}
                        className="flex items-center justify-center gap-2 bg-primary hover:bg-blue-600 text-white font-bold py-4 rounded-2xl transition-all active:scale-95 shadow-lg shadow-blue-500/20"
                    >
                        <RefreshCw className="w-5 h-5" />
                        Try to Reload
                    </button>

                    <Link
                        href="/"
                        className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white font-semibold py-4 rounded-2xl border border-white/10 transition-all active:scale-95"
                    >
                        <Home className="w-5 h-5" />
                        Return Home
                    </Link>
                </div>
            </motion.div>
        </div>
    );
}
