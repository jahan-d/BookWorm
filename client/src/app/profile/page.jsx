'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import api from '@/services/api';
import { Loader2, User, Mail, Camera, Save, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function ProfilePage() {
    const { user, loading: authLoading, refreshUser } = useAuth();
    const [name, setName] = useState('');
    const [photoURL, setPhotoURL] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (user) {
            setName(user.name || '');
            setPhotoURL(user.photoURL || '');
        }
    }, [user]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        setSuccess('');
        setError('');

        try {
            await api.put('/users/profile', { name, photoURL });
            await refreshUser();
            setSuccess('Profile updated successfully!');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    if (authLoading) return <div className="flex justify-center p-20"><Loader2 className="w-10 h-10 animate-spin" /></div>;

    return (
        <div className="min-h-screen pt-24 px-6 pb-20">
            <div className="max-w-2xl mx-auto">
                <Link href="/dashboard" className="flex items-center text-muted-foreground hover:text-white mb-8 transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Dashboard
                </Link>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass rounded-3xl p-8 border border-white/10"
                >
                    <h1 className="text-3xl font-bold mb-8">Profile Settings</h1>

                    {success && (
                        <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 text-sm text-center">
                            {success}
                        </div>
                    )}

                    {error && (
                        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm text-center">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleUpdate} className="space-y-6">
                        <div className="flex flex-col items-center mb-8">
                            <div className="relative group">
                                <div className="w-32 h-32 rounded-full overflow-hidden bg-secondary border-4 border-white/5 relative">
                                    <img
                                        src={photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'User')}&background=random`}
                                        alt="Avatar"
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Camera className="w-8 h-8 text-white" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2 text-muted-foreground">Full Name</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                                    <input
                                        className="input-field pl-11"
                                        value={name}
                                        onChange={e => setName(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2 text-muted-foreground">Email Address (Read Only)</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 w-5 h-5 text-muted-foreground/50" />
                                    <input
                                        className="input-field pl-11 bg-white/5 opacity-50 cursor-not-allowed"
                                        value={user?.email || ''}
                                        disabled
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2 text-muted-foreground">Photo URL</label>
                                <div className="relative">
                                    <Camera className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                                    <input
                                        className="input-field pl-11"
                                        value={photoURL}
                                        onChange={e => setPhotoURL(e.target.value)}
                                        placeholder="https://example.com/photo.jpg"
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full mt-8 bg-primary text-white font-bold py-4 rounded-xl flex items-center justify-center hover:bg-blue-600 transition-all shadow-lg shadow-blue-500/20"
                        >
                            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                                <>
                                    <Save className="w-5 h-5 mr-2" />
                                    Save Changes
                                </>
                            )}
                        </button>
                    </form>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <ConnectionsList />
                </motion.div>

                {/* My Reviews Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mt-12"
                >
                    <h2 className="text-2xl font-bold mb-6">My Reviews</h2>
                    <MyReviewsList />
                </motion.div>
            </div>
        </div>
    );
}

function MyReviewsList() {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMyReviews = async () => {
            try {
                // We need an endpoint or filter. ReviewController.getApprovedReviews is for books.
                // Let's assume we use /books but we might need a dedicated endpoint.
                // Since I cannot add many endpoints, I'll use the profile refresh to check if reviews are linked?
                // Actually, I'll add GET /users/reviews to the backend.
                const res = await api.get('/users/reviews');
                setReviews(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchMyReviews();
    }, []);

    if (loading) return <Loader2 className="w-6 h-6 animate-spin mx-auto" />;

    return (
        <div className="space-y-4">
            {reviews.length === 0 ? (
                <p className="text-muted-foreground italic text-center py-8 glass rounded-2xl">You haven&apos;t written any reviews yet.</p>
            ) : (
                reviews.map((review, i) => (
                    <div key={i} className="glass p-5 rounded-2xl border border-white/5 relative overflow-hidden">
                        <div className={cn(
                            "absolute top-0 right-0 px-3 py-1 text-[10px] font-bold uppercase tracking-widest",
                            review.status === 'approved' ? "bg-emerald-500 text-black" :
                                review.status === 'pending' ? "bg-amber-500 text-black" : "bg-red-500 text-white"
                        )}>
                            {review.status}
                        </div>
                        <h4 className="font-bold mb-1">Book ID: {review.bookId}</h4>
                        <div className="flex text-yellow-500 mb-2">
                            {[...Array(review.rating)].map((_, j) => <span key={j}>★</span>)}
                        </div>
                        <p className="text-sm text-muted-foreground italic">&quot;{review.text}&quot;</p>
                    </div>
                ))
            )}
        </div>
    );
}

function ConnectionsList() {
    const [network, setNetwork] = useState({ followers: [], following: [] });
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('following');
    const { user: currentUser, refreshUser } = useAuth();

    // Helper to check if we follow a user (useful for the Followers tab)
    const isFollowingUser = (email) => currentUser?.following?.includes(email);

    const fetchNetwork = async () => {
        try {
            const res = await api.get('/users/connections');
            setNetwork(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNetwork();
    }, [currentUser]); // Re-fetch when currentUser changes (e.g. after follow/unfollow)

    const handleToggleFollow = async (email) => {
        try {
            const isFollowing = isFollowingUser(email);
            if (isFollowing) {
                await api.post('/users/unfollow', { targetEmail: email });
            } else {
                await api.post('/users/follow', { targetEmail: email });
            }
            // Update both global user state and local network list
            await refreshUser();
            // We also technically need to update the local 'network' state if we want instant optimistic updates, 
            // but relying on the useEffect triggered by refreshUser -> currentUser change might be enough or we re-fetch.
            // Let's rely on re-fetch for accuracy.
        } catch (err) {
            console.error('Failed to toggle follow', err);
        }
    };

    if (loading) return <Loader2 className="w-6 h-6 animate-spin mx-auto" />;

    const displayedUsers = activeTab === 'following' ? network.following : network.followers;

    return (
        <div className="glass rounded-3xl p-8 border border-white/10 mt-12">
            <h2 className="text-2xl font-bold mb-6">My Network</h2>

            {/* Tabs */}
            <div className="flex space-x-1 bg-white/5 p-1 rounded-xl mb-6">
                <button
                    onClick={() => setActiveTab('following')}
                    className={cn(
                        "flex-1 py-2 text-sm font-bold rounded-lg transition-all",
                        activeTab === 'following' ? "bg-primary text-white shadow-lg" : "text-muted-foreground hover:bg-white/5"
                    )}
                >
                    Following ({network.following.length})
                </button>
                <button
                    onClick={() => setActiveTab('followers')}
                    className={cn(
                        "flex-1 py-2 text-sm font-bold rounded-lg transition-all",
                        activeTab === 'followers' ? "bg-primary text-white shadow-lg" : "text-muted-foreground hover:bg-white/5"
                    )}
                >
                    Followers ({network.followers.length})
                </button>
            </div>

            {/* List */}
            <div className="space-y-4">
                {displayedUsers.length === 0 ? (
                    <p className="text-muted-foreground italic text-center py-8">
                        {activeTab === 'following' ? "You aren't following anyone yet." : "You don't have any followers yet."}
                    </p>
                ) : (
                    displayedUsers.map((u, i) => {
                        const isFollowing = isFollowingUser(u.email);
                        // In 'following' tab, isFollowing is always true initially (unless toggled).
                        // In 'followers' tab, it might be true or false.

                        return (
                            <div key={i} className="flex items-center justify-between group">
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center font-bold text-sm">
                                        {u.photoURL ? <img src={u.photoURL} alt={u.name} className="w-full h-full rounded-full object-cover" /> : u.name?.[0]}
                                    </div>
                                    <div>
                                        <p className="font-medium">{u.name}</p>
                                        <p className="text-xs text-muted-foreground">{u.email}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleToggleFollow(u.email)}
                                    className={cn(
                                        "text-xs px-4 py-2 rounded-full border transition-colors font-medium",
                                        isFollowing
                                            ? "border-white/10 text-muted-foreground hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/50"
                                            : "border-primary text-primary hover:bg-primary hover:text-white"
                                    )}
                                >
                                    {isFollowing ? 'Following' : 'Follow Back'}
                                </button>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
