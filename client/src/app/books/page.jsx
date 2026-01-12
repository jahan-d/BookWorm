'use client';

import { useState, useEffect } from 'react';
import api from '@/services/api';
import BookCard from '@/components/ui/BookCard';
import SearchBar from '@/components/ui/SearchBar';
import { motion } from 'framer-motion';
import { Loader2, AlertCircle } from 'lucide-react';

export default function BooksPage() {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState('');
    const [filteredBooks, setFilteredBooks] = useState([]);

    useEffect(() => {
        fetchBooks();
    }, []);

    useEffect(() => {
        const filtered = books.filter(book =>
            book.title.toLowerCase().includes(search.toLowerCase()) ||
            book.author.toLowerCase().includes(search.toLowerCase()) ||
            book.genre?.toLowerCase().includes(search.toLowerCase())
        );
        setFilteredBooks(filtered);
    }, [search, books]);

    const fetchBooks = async () => {
        try {
            const response = await api.get('/books');
            setBooks(response.data);
            setFilteredBooks(response.data);
        } catch (err) {
            console.error('Failed to fetch books:', err);
            // Fallback data for demo if API fails or returns empty
            if (process.env.NODE_ENV === 'development') {
                // Optionally load mock data here
            }
            setError('Failed to load books. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen pt-24 px-6 pb-20">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold mb-4">Explore Our Library</h1>
                    <p className="text-muted-foreground">Discover your next great adventure among thousands of titles.</p>
                </div>

                <SearchBar value={search} onChange={setSearch} onFilter={() => { }} />

                {loading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="w-10 h-10 animate-spin text-primary" />
                    </div>
                ) : error ? (
                    <div className="flex flex-col items-center justify-center py-20 text-red-400 bg-red-500/5 rounded-3xl border border-red-500/20">
                        <AlertCircle className="w-10 h-10 mb-4" />
                        <p>{error}</p>
                        <button
                            onClick={fetchBooks}
                            className="mt-6 px-6 py-2 bg-red-500/10 hover:bg-red-500/20 rounded-full transition-colors"
                        >
                            Try Again
                        </button>
                    </div>
                ) : (
                    <>
                        {filteredBooks.length === 0 ? (
                            <div className="text-center py-20 text-muted-foreground">
                                No books found matching "{search}"
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
                                {filteredBooks.map((book, index) => (
                                    <BookCard key={book._id} book={book} index={index} />
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
