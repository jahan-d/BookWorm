'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import api from '@/services/api';
import { motion } from 'framer-motion';
import { Loader2, Star, BookOpen, Clock, Calendar, Check, Plus, Heart } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

export default function BookDetailsPage() {
    const { id } = useParams();
    const { user } = useAuth();
    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);
    const [shelfLoading, setShelfLoading] = useState(false);
    const [currentShelf, setCurrentShelf] = useState(null);

    useEffect(() => {
        fetchBookDetails();
    }, [id]);

    useEffect(() => {
        if (user && book) {
            checkUserShelf();
        }
    }, [user, book]);

    const fetchBookDetails = async () => {
        try {
            const response = await api.get(`/books/${id}`);
            setBook(response.data);
        } catch (err) {
            console.error('Failed to fetch book details:', err);
        } finally {
            setLoading(false);
        }
    };

    const checkUserShelf = async () => {
        // In a real app we would check user's library to see if this book is in a shelf
        // For now we can fetch library and check
        try {
            const res = await api.get('/users/library');
            const shelves = res.data || {};

            // Check within objects as backend stores { bookId, addedAt, ... }
            if (shelves.read?.some(item => (item.bookId || item) === id)) setCurrentShelf('read');
            else if (shelves.currentlyReading?.some(item => (item.bookId || item) === id)) setCurrentShelf('currentlyReading');
            else if (shelves.wantToRead?.some(item => (item.bookId || item) === id)) setCurrentShelf('wantToRead');
        } catch (err) {
            console.error(err);
        }
    };

    const handleShelfUpdate = async (shelfName) => {
        if (!user) return; // Prompt login
        setShelfLoading(true);
        try {
            await api.put('/users/shelf', {
                bookId: id,
                shelfName
            });
            setCurrentShelf(shelfName);
        } catch (err) {
            console.error('Failed to update shelf:', err);
        } finally {
            setShelfLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
            </div>
        );
    }

    if (!book) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-muted-foreground">Book not found.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-24 px-6 pb-20">
            <div className="max-w-7xl mx-auto">
                <div className="grid md:grid-cols-3 gap-12">
                    {/* Cover Image & Actions */}
                    <div className="space-y-8">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="aspect-[2/3] rounded-3xl overflow-hidden shadow-2xl relative"
                        >
                            <img
                                src={book.coverImage || 'https://via.placeholder.com/600x900?text=No+Cover'}
                                alt={book.title}
                                className="w-full h-full object-cover"
                            />
                        </motion.div>

                        {user && (
                            <div className="glass p-6 rounded-2xl space-y-4">
                                <h3 className="font-bold mb-2">Reading Status</h3>
                                <div className="grid grid-cols-1 gap-3">
                                    <ShelfButton
                                        active={currentShelf === 'currentlyReading'}
                                        onClick={() => handleShelfUpdate('currentlyReading')}
                                        label="Currently Reading"
                                        icon={BookOpen}
                                        color="text-blue-400"
                                        loading={shelfLoading}
                                    />
                                    <ShelfButton
                                        active={currentShelf === 'wantToRead'}
                                        onClick={() => handleShelfUpdate('wantToRead')}
                                        label="Want to Read"
                                        icon={Plus}
                                        color="text-amber-400"
                                        loading={shelfLoading}
                                    />
                                    <ShelfButton
                                        active={currentShelf === 'read'}
                                        onClick={() => handleShelfUpdate('read')}
                                        label="Finished"
                                        icon={Check}
                                        color="text-emerald-400"
                                        loading={shelfLoading}
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Details */}
                    <div className="md:col-span-2 space-y-8">
                        <div>
                            <motion.h1
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-4xl md:text-5xl font-bold mb-4"
                            >
                                {book.title}
                            </motion.h1>
                            <p className="text-xl text-muted-foreground mb-6">by <span className="text-primary font-semibold">{book.author}</span></p>

                            <div className="flex flex-wrap gap-4 mb-8">
                                <Badge icon={Star} label={book.rating || 'N/A'} sublabel="Rating" />
                                <Badge icon={BookOpen} label={book.genre} sublabel="Genre" />
                                <Badge icon={Clock} label={book.pages} sublabel="Pages" />
                                <Badge icon={Calendar} label={book.publishedDate ? new Date(book.publishedDate).getFullYear() : 'N/A'} sublabel="Published" />
                            </div>
                        </div>

                        <section>
                            <h2 className="text-2xl font-bold mb-4">Synopsis</h2>
                            <p className="text-lg leading-relaxed text-muted-foreground">
                                {book.description || 'No description available.'}
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold mb-4">Reviews</h2>

                            {user && (
                                <ReviewForm bookId={book._id} onReviewSubmitted={() => { fetchBookDetails(); }} />
                            )}

                            <div className="space-y-4 mt-8">
                                {book.reviews && book.reviews.length > 0 ? (
                                    book.reviews.map((review, i) => (
                                        <div key={i} className="glass p-4 rounded-xl relative overflow-hidden">
                                            {review.status !== 'approved' && (
                                                <div className={cn(
                                                    "absolute top-0 right-0 px-3 py-1 text-[10px] font-bold uppercase tracking-widest",
                                                    review.status === 'pending' ? "bg-amber-500 text-black" : "bg-red-500 text-white"
                                                )}>
                                                    {review.status}
                                                </div>
                                            )}
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center space-x-2">
                                                    <span className="font-bold">{review.userName || 'Anonymous'}</span>
                                                    {review.userEmail === user?.email && (
                                                        <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded-full text-muted-foreground">You</span>
                                                    )}
                                                </div>
                                                <div className="flex text-yellow-500">
                                                    {[...Array(review.rating)].map((_, j) => <Star key={j} className="w-4 h-4 fill-current" />)}
                                                </div>
                                            </div>
                                            <p className="text-muted-foreground">{review.text}</p>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-muted-foreground italic">No reviews yet.</p>
                                )}
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}

function Badge({ icon: Icon, label, sublabel }) {
    return (
        <div className="flex items-center space-x-3 glass pr-4 pl-3 py-2 rounded-xl">
            <div className="p-2 bg-white/5 rounded-lg">
                <Icon className="w-5 h-5" />
            </div>
            <div>
                <p className="font-bold leading-none">{label}</p>
                <p className="text-xs text-muted-foreground mt-1">{sublabel}</p>
            </div>
        </div>
    );
}

function ShelfButton({ active, onClick, label, icon: Icon, color, loading }) {
    return (
        <button
            onClick={onClick}
            disabled={loading}
            className={cn(
                "w-full flex items-center justify-between p-3 rounded-xl border transition-all",
                active ? `bg-${color.split('-')[1]}-500/10 border-${color.split('-')[1]}-500/50` : "border-white/5 hover:bg-white/5",
            )}
        >
            <div className="flex items-center space-x-3">
                <Icon className={cn("w-5 h-5", color)} />
                <span className={active ? "font-bold" : "text-muted-foreground"}>{label}</span>
            </div>
            {active && <Check className="w-5 h-5 text-primary" />}
        </button>
    )
}

function ReviewForm({ bookId, onReviewSubmitted }) {
    const [rating, setRating] = useState(5);
    const [text, setText] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await api.post('/reviews', { bookId, rating, text });
            setText('');
            setRating(5);
            onReviewSubmitted();
        } catch (err) {
            console.error('Failed to submit review:', err);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="glass p-6 rounded-2xl mb-8 border-l-4 border-primary">
            <h3 className="font-bold mb-4">Write a Review</h3>
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-2 text-muted-foreground">Rating</label>
                    <div className="flex space-x-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                onClick={() => setRating(star)}
                                className={cn("p-1 transition-transform hover:scale-110", star <= rating ? "text-yellow-500" : "text-white/20")}
                            >
                                <Star className={cn("w-6 h-6", star <= rating && "fill-current")} />
                            </button>
                        ))}
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium mb-2 text-muted-foreground">Your Thoughts</label>
                    <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        required
                        rows={3}
                        className="w-full bg-black/20 rounded-lg p-3 border border-white/10 focus:border-primary focus:outline-none transition-colors"
                        placeholder="What did you think of this book?"
                    />
                </div>
                <button
                    type="submit"
                    disabled={submitting}
                    className="bg-primary text-white px-6 py-2 rounded-full font-medium hover:bg-blue-600 transition-colors disabled:opacity-50"
                >
                    {submitting ? 'Submitting...' : 'Post Review'}
                </button>
            </div>
        </form>
    );
}
