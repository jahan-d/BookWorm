'use client';

import { useState, useEffect } from 'react';
import api from '@/services/api';
import { Loader2, Check, X, Star } from 'lucide-react';

export default function ManageReviewsPage() {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchReviews();
    }, []);

    const fetchReviews = async () => {
        try {
            const res = await api.get('/admin/reviews');
            setReviews(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleModerate = async (id, action) => {
        if (!window.confirm(`Are you sure you want to ${action} this review?`)) return;
        try {
            await api.post('/admin/reviews/moderate', { id, action });
            setReviews(reviews.filter(r => r._id !== id));
        } catch (err) {
            console.error(`Failed to ${action} review`, err);
        }
    };

    if (loading) return <div className="flex justify-center p-10"><Loader2 className="w-10 h-10 animate-spin" /></div>;

    return (
        <div>
            <h1 className="text-3xl font-bold mb-8">Pending Reviews</h1>

            {reviews.length === 0 ? (
                <div className="glass p-12 rounded-3xl text-center text-muted-foreground">
                    <p>No pending reviews to moderate.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {reviews.map(review => (
                        <div key={review._id} className="glass p-6 rounded-2xl">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="font-bold text-lg mb-1">{review.userName || review.userEmail}</h3>
                                    <div className="flex text-yellow-500 mb-2">
                                        {[...Array(review.rating)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                                    </div>
                                    <p className="text-sm text-muted-foreground">For Book ID: {review.bookId}</p>
                                </div>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => handleModerate(review._id, 'approve')}
                                        className="p-2 bg-emerald-500/20 text-emerald-500 rounded-full hover:bg-emerald-500/30 transition-colors"
                                        title="Approve"
                                    >
                                        <Check className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={() => handleModerate(review._id, 'delete')}
                                        className="p-2 bg-red-500/20 text-red-500 rounded-full hover:bg-red-500/30 transition-colors"
                                        title="Reject"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                            <p className="bg-black/20 p-4 rounded-xl text-white/90 italic">"{review.text}"</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
