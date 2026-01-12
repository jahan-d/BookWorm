'use client';

import { useState, useEffect } from 'react';
import api from '@/services/api';
import BookCard from '@/components/ui/BookCard';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function LibraryPage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [shelves, setShelves] = useState({ read: [], currentlyReading: [], wantToRead: [] });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login');
        } else if (user) {
            fetchLibrary();
        }
    }, [user, authLoading]);

    const fetchLibrary = async () => {
        try {
            const response = await api.get('/users/library');
            const shelfData = response.data || {};

            // Fetch details for shelves
            const currentlyReadingBooks = await Promise.all((shelfData.currentlyReading || []).map(item =>
                api.get(`/books/${item.bookId || item}`).then(res => res.data).catch(() => null)
            ));

            const readBooks = await Promise.all((shelfData.read || []).map(item =>
                api.get(`/books/${item.bookId || item}`).then(res => res.data).catch(() => null)
            ));

            const wantToReadBooks = await Promise.all((shelfData.wantToRead || []).map(item =>
                api.get(`/books/${item.bookId || item}`).then(res => res.data).catch(() => null)
            ));

            setShelves({
                currentlyReading: currentlyReadingBooks.filter(Boolean),
                read: readBooks.filter(Boolean),
                wantToRead: wantToReadBooks.filter(Boolean)
            });

        } catch (err) {
            console.error('Failed to fetch library:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleProgressUpdate = async (bookId, pagesRead) => {
        try {
            await api.put('/users/progress', { bookId, pagesRead });
            await refreshUser();
            // Refresh library to show updated progress
            fetchLibrary();
        } catch (err) {
            console.error('Failed to update progress:', err);
        }
    };

    if (authLoading || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-24 px-6 pb-20">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-4xl font-bold mb-8">My Library</h1>

                <div className="space-y-12">
                    {/* Currently Reading */}
                    <section>
                        <h2 className="text-2xl font-bold mb-6 flex items-center text-primary">
                            <span className="w-2 h-8 bg-primary rounded-full mr-3" />
                            Currently Reading
                        </h2>
                        {shelves.currentlyReading.length === 0 ? (
                            <p className="text-muted-foreground italic">You aren't reading anything right now.</p>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {shelves.currentlyReading.map((book, i) => (
                                    <div key={book._id} className="glass p-6 rounded-2xl flex flex-col">
                                        <div className="flex space-x-4 mb-6">
                                            <div className="w-20 aspect-[2/3] rounded-lg overflow-hidden flex-shrink-0">
                                                <img src={book.coverImage} alt={book.title} className="w-full h-full object-cover" />
                                            </div>
                                            <div>
                                                <h3 className="font-bold line-clamp-1">{book.title}</h3>
                                                <p className="text-sm text-muted-foreground">{book.author}</p>
                                                <p className="text-xs text-primary mt-2 font-bold uppercase tracking-wider">{book.pages} Pages Total</p>
                                            </div>
                                        </div>

                                        <div className="mt-auto space-y-4">
                                            <div>
                                                <div className="flex justify-between text-sm mb-2">
                                                    <span className="text-muted-foreground">Progress</span>
                                                    <span className="font-bold">
                                                        {Math.round(((user.shelves?.currentlyReading?.find(s => s.bookId === book._id)?.progress || 0) / book.pages) * 100)}%
                                                    </span>
                                                </div>
                                                <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-primary transition-all duration-500"
                                                        style={{ width: `${Math.min(100, ((user.shelves?.currentlyReading?.find(s => s.bookId === book._id)?.progress || 0) / book.pages) * 100)}%` }}
                                                    />
                                                </div>
                                            </div>

                                            <div className="flex items-center space-x-2 pt-2">
                                                <input
                                                    type="number"
                                                    className="w-20 bg-black/20 border border-white/10 rounded-lg p-2 text-sm focus:border-primary focus:outline-none"
                                                    placeholder="Page"
                                                    defaultValue={user.shelves?.currentlyReading?.find(s => s.bookId === book._id)?.progress || 0}
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter') {
                                                            handleProgressUpdate(book._id, e.target.value);
                                                            e.target.blur();
                                                        }
                                                    }}
                                                />
                                                <span className="text-xs text-muted-foreground"> / {book.pages}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>

                    {/* Want to Read */}
                    <section>
                        <h2 className="text-2xl font-bold mb-6 flex items-center text-amber-500">
                            <span className="w-2 h-8 bg-amber-500 rounded-full mr-3" />
                            Want to Read
                        </h2>
                        {shelves.wantToRead.length === 0 ? (
                            <p className="text-muted-foreground italic">Your wishlist is empty.</p>
                        ) : (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                {shelves.wantToRead.map((book, i) => (
                                    <BookCard key={book._id} book={book} index={i} />
                                ))}
                            </div>
                        )}
                    </section>

                    {/* Read */}
                    <section>
                        <h2 className="text-2xl font-bold mb-6 flex items-center text-emerald-500">
                            <span className="w-2 h-8 bg-emerald-500 rounded-full mr-3" />
                            Read
                        </h2>
                        {shelves.read.length === 0 ? (
                            <p className="text-muted-foreground italic">No finished books yet.</p>
                        ) : (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                {shelves.read.map((book, i) => (
                                    <BookCard key={book._id} book={book} index={i} />
                                ))}
                            </div>
                        )}
                    </section>
                </div>
            </div>
        </div>
    );
}
