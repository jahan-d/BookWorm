'use client';

import { motion } from 'framer-motion';
import { Search, Home, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-[#09090b] relative overflow-hidden">
            {/* Ambient Background Glows */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[120px]" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-600/5 rounded-full blur-[120px]" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-xl w-full text-center relative z-10"
            >
                <div className="mb-12 relative inline-block">
                    <span className="text-[12rem] font-black leading-none bg-gradient-to-b from-white/20 to-transparent bg-clip-text text-transparent select-none">
                        404
                    </span>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-24 h-24 bg-primary/20 rounded-full blur-2xl animate-pulse" />
                        <Search className="w-16 h-16 text-primary relative z-10" />
                    </div>
                </div>

                <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
                    Lost in the Stacks
                </h1>

                <p className="text-xl text-muted-foreground mb-12 max-w-md mx-auto leading-relaxed">
                    The volume you're looking for seems to have been misplaced or never written.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <Link
                        href="/"
                        className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white text-black font-bold px-8 py-4 rounded-2xl hover:bg-white/90 transition-all active:scale-95"
                    >
                        <Home className="w-5 h-5" />
                        Return Home
                    </Link>

                    <button
                        onClick={() => window.history.back()}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white font-semibold px-8 py-4 rounded-2xl border border-white/10 transition-all active:scale-95"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Go Back
                    </button>
                </div>

                {/* Decorative Elements */}
                <div className="mt-20 flex justify-center gap-2 opacity-20">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="w-1.5 h-8 bg-white rounded-full" />
                    ))}
                    <div className="w-1.5 h-8 bg-primary rounded-full" />
                    {[1, 2].map((i) => (
                        <div key={i} className="w-1.5 h-8 bg-white rounded-full" />
                    ))}
                </div>
            </motion.div>
        </div>
    );
}
