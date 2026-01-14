'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import api from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, TrendingUp, Book, Target, Activity, Edit3, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function DashboardPage() {
    const { user, loading: authLoading, refreshUser } = useAuth();
    const router = useRouter();
    const [stats, setStats] = useState(null);
    const [feed, setFeed] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
    const [newGoal, setNewGoal] = useState('');

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login');
        } else if (user) {
            fetchDashboardData();
        }
    }, [user, authLoading]);

    const fetchDashboardData = async () => {
        try {
            // Try to load cached stats first
            if (typeof window !== 'undefined') {
                const cached = localStorage.getItem('dashboardStats');
                if (cached) {
                    setStats(JSON.parse(cached));
                    // We'll still fetch fresh data to keep it up‑to‑date
                }
            }
            const [statsRes, feedRes] = await Promise.all([
                api.get('/users/stats'),
                api.get('/users/feed')
            ]);
            setStats(statsRes.data);
            setFeed(feedRes.data);
            // Clear cached stats after successful fetch
            if (typeof window !== 'undefined') {
                localStorage.removeItem('dashboardStats');
            }
        } catch (err) {
            console.error('Failed to fetch dashboard data:', err);
        } finally {
            setLoading(false);
        }
    };
    const handleGoalUpdate = async (e) => {
        e.preventDefault();
        try {
            await api.put('/users/goal', { readingGoal: parseInt(newGoal) });
            await refreshUser();
            setStats({ ...stats, readingGoal: parseInt(newGoal) });
            setIsGoalModalOpen(false);
        } catch (err) {
            console.error('Failed to update goal:', err);
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
                <div className="flex items-center justify-between mb-12">
                    <div>
                        <h1 className="text-4xl font-bold mb-2">Hello, {user?.name?.split(' ')[0] || 'Reader'}</h1>
                        <p className="text-muted-foreground">Here is your daily reading overview.</p>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    <StatCard
                        icon={Book}
                        title="Books Read"
                        value={stats?.booksReadThisYear || 0}
                        subtitle="this year"
                        color="bg-blue-500/10 text-blue-500"
                    />
                    <StatCard
                        icon={Target}
                        title="Annual Goal"
                        value={`${stats?.goalProgress || 0}/${stats?.readingGoal || 0}`}
                        subtitle="books completed"
                        color="bg-purple-500/10 text-purple-500"
                        onAction={() => {
                            setNewGoal(stats?.readingGoal || 0);
                            setIsGoalModalOpen(true);
                        }}
                    />
                    <StatCard
                        icon={TrendingUp}
                        title="Pages Read"
                        value={stats?.totalPagesRead?.toLocaleString() || 0}
                        subtitle="total pages"
                        color="bg-emerald-500/10 text-emerald-500"
                    />
                    <StatCard
                        icon={Activity}
                        title="Avg. Rating"
                        value={stats?.averageRatingGiven || 'N/A'}
                        subtitle="per book"
                        color="bg-amber-500/10 text-amber-500"
                    />
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Recent Activity Feed */}
                    <div className="lg:col-span-2">
                        <h2 className="text-2xl font-bold mb-6">Activity Feed</h2>
                        <div className="glass rounded-3xl p-6 space-y-6">
                            {feed.length === 0 ? (
                                <p className="text-muted-foreground text-center py-8">No recent activity.</p>
                            ) : (
                                feed.map((item, i) => (
                                    <div key={i} className="flex items-start space-x-4 pb-6 border-b border-white/5 last:border-0 last:pb-0">
                                        <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center font-bold text-primary">
                                            {item.userName?.[0] || 'U'}
                                        </div>
                                        <div>
                                            <p className="font-medium">
                                                <span className="text-white">{item.userName}</span>{' '}
                                                <span className="text-muted-foreground">{item.details}</span>
                                            </p>
                                            <p className="text-xs text-muted-foreground mt-1">
                                                {new Date(item.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Sidebar / Recommendations */}
                    <div>
                        <h2 className="text-2xl font-bold mb-6">Discover Readers</h2>
                        <div className="glass rounded-3xl p-6 mb-8">
                            <DiscoveryList />
                        </div>

                        <h2 className="text-2xl font-bold mb-6">Suggestions</h2>
                        <div className="glass rounded-3xl p-6">
                            <SuggestionsList />
                        </div>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {isGoalModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
                            className="bg-zinc-900 w-full max-w-sm rounded-3xl p-8 border border-white/10 relative"
                        >
                            <button onClick={() => setIsGoalModalOpen(false)} className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full">
                                <X className="w-5 h-5" />
                            </button>
                            <h2 className="text-2xl font-bold mb-6">Set Annual Goal</h2>
                            <form onSubmit={handleGoalUpdate} className="space-y-4">
                                <div>
                                    <label className="block text-sm text-muted-foreground mb-2">How many books do you want to read this year?</label>
                                    <input
                                        type="number"
                                        className="input-field text-center text-2xl font-bold"
                                        value={newGoal}
                                        onChange={e => setNewGoal(e.target.value)}
                                        min="1"
                                        required
                                        autoFocus
                                    />
                                </div>
                                <button type="submit" className="w-full bg-primary py-3 rounded-xl font-bold hover:bg-blue-600 transition-colors">
                                    Update Goal
                                </button>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

function DiscoveryList() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user: currentUser, refreshUser } = useAuth();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await api.get('/users');
                setUsers(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    const handleFollow = async (email) => {
        try {
            await api.post('/users/follow', { targetEmail: email });
            await refreshUser(); // Update follower list in local state
        } catch (err) {
            console.error('Failed to follow', err);
        }
    };

    if (loading) return <div className="flex justify-center"><Loader2 className="w-5 h-5 animate-spin" /></div>;

    return (
        <div className="space-y-4">
            {users.map((u, i) => {
                const isFollowing = currentUser?.following?.includes(u.email);
                return (
                    <div key={i} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center font-bold text-xs">
                                {u.photoURL ? <img src={u.photoURL} className="w-full h-full rounded-full object-cover" /> : u.name?.[0]}
                            </div>
                            <span className="text-sm font-medium">{u.name}</span>
                        </div>
                        <button
                            onClick={() => handleFollow(u.email)}
                            disabled={isFollowing}
                            className={cn(
                                "text-xs px-3 py-1 rounded-full border transition-colors",
                                isFollowing ? "border-white/10 text-muted-foreground cursor-default" : "border-primary text-primary hover:bg-primary hover:text-white"
                            )}
                        >
                            {isFollowing ? 'Following' : 'Follow'}
                        </button>
                    </div>
                );
            })}
            {users.length === 0 && <p className="text-xs text-muted-foreground italic">No other readers found.</p>}
        </div>
    );
}

function StatCard({ icon: Icon, title, value, subtitle, color, onAction }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass p-6 rounded-2xl relative overflow-hidden group hover:bg-white/5 transition-colors"
        >
            <div className="flex justify-between items-start">
                <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110", color)}>
                    <Icon className="w-6 h-6" />
                </div>
                {onAction && (
                    <button
                        onClick={onAction}
                        className="p-2 hover:bg-white/10 rounded-lg text-muted-foreground hover:text-white transition-colors"
                    >
                        <Edit3 className="w-4 h-4" />
                    </button>
                )}
            </div>
            <h3 className="text-3xl font-bold mb-1">{value}</h3>
            <p className="font-medium text-white/80">{title}</p>
            <p className="text-xs text-muted-foreground">{subtitle}</p>
        </motion.div>
    );
}

function SuggestionsList() {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSuggestions = async () => {
            try {
                const res = await api.get('/users/recommendations');
                setBooks(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchSuggestions();
    }, []);

    if (loading) return <div className="flex justify-center"><Loader2 className="w-5 h-5 animate-spin" /></div>;

    return (
        <div className="space-y-4">
            {books.slice(0, 5).map((book, i) => (
                <Link key={i} href={`/books/${book._id}`} className="flex items-center space-x-3 group">
                    <img src={book.coverImage} className="w-10 h-14 object-cover rounded shadow-lg transition-transform group-hover:scale-105" />
                    <div className="overflow-hidden">
                        <p className="text-sm font-bold truncate group-hover:text-primary transition-colors">{book.title}</p>
                        <p className="text-xs text-muted-foreground">{book.author}</p>
                    </div>
                </Link>
            ))}
            {books.length === 0 && (
                <p className="text-xs text-muted-foreground italic text-center py-4">Add more books to your &apos;Read&apos; shelf to get personalized suggestions.</p>
            )}
        </div>
    );
}
