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
                                {shelves.currentlyReading.map((book) => {
                                    const userProgress = user?.shelves?.currentlyReading?.find(s => s.bookId === book._id)?.progress || 0;
                                    const handleProgressChange = async (bookId, pages) => {
                                        // Update progress on server
                                        await api.put('/users/progress', { bookId, pagesRead: pages });
                                        // Refresh user data (includes updated shelves)
                                        await refreshUser();
                                        // Fetch updated dashboard stats and store for dashboard page
                                        const statsRes = await api.get('/users/stats');
                                        if (typeof window !== 'undefined') {
                                            localStorage.setItem('dashboardStats', JSON.stringify(statsRes.data));
                                        }
                                    };
                                    return (
                                        <CurrentlyReadingCard
                                            key={book._id}
                                            book={book}
                                            userProgress={userProgress}
                                            onProgressChange={handleProgressChange}
                                        />
                                    );
                                })}
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
