'use client';

import { Search, Filter } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SearchBar({ value, onChange, onFilter }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative max-w-2xl mx-auto mb-12"
        >
            <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/50 to-accent/50 rounded-2xl blur-lg opacity-20 group-hover:opacity-30 transition-opacity" />
                <div className="relative flex items-center bg-secondary/80 backdrop-blur-xl border border-white/10 rounded-2xl p-2 shadow-2xl">
                    <Search className="w-6 h-6 text-muted-foreground ml-4" />
                    <input
                        type="text"
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder="Search by title, author, or genre..."
                        className="w-full bg-transparent border-none focus:ring-0 text-lg px-4 py-3 placeholder:text-muted-foreground/50"
                    />
                    <button
                        onClick={onFilter}
                        className="p-3 hover:bg-white/10 rounded-xl transition-colors text-muted-foreground hover:text-primary"
                    >
                        <Filter className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
