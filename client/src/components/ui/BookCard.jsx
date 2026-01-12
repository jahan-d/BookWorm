'use client';

import { motion } from 'framer-motion';
import { Star, Clock, BookOpen } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function BookCard({ book, index = 0 }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group relative"
        >
            <Link href={`/books/${book._id}`}>
                <div className="relative aspect-[2/3] rounded-2xl overflow-hidden mb-4">
                    <div className="absolute inset-0 bg-secondary/50 animate-pulse" />
                    <img
                        src={book.coverImage || 'https://via.placeholder.com/300x450?text=No+Cover'}
                        alt={book.title}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    <div className="absolute bottom-4 left-4 right-4 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <div className="flex items-center space-x-1 text-yellow-400 mb-2">
                            <Star className="w-4 h-4 fill-current" />
                            <span className="font-bold">{book.rating || 'N/A'}</span>
                        </div>
                        <p className="text-white text-sm line-clamp-2">{book.description}</p>
                    </div>
                </div>

                <h3 className="font-bold text-lg mb-1 truncate group-hover:text-primary transition-colors">
                    {book.title}
                </h3>
                <p className="text-muted-foreground text-sm mb-3">
                    by {book.author}
                </p>

                <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                    <div className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{book.pages} pages</span>
                    </div>
                    <div className="flex items-center space-x-1">
                        <BookOpen className="w-3 h-3" />
                        <span>{book.genre}</span>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}
