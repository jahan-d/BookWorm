'use client';

import { useState, useEffect } from 'react';
import api from '@/services/api';
import { Loader2, Users, Book, MessageSquare, List } from 'lucide-react';

export default function AdminDashboard() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const response = await api.get('/admin/stats');
            setStats(response.data);
        } catch (err) {
            console.error('Failed to fetch admin stats:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="flex justify-center p-20"><Loader2 className="w-10 h-10 animate-spin text-primary" /></div>;

    return (
        <div>
            <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                <StatCard icon={Book} label="Total Books" value={stats?.totalBooks || 0} color="text-blue-500 bg-blue-500/10" />
                <StatCard icon={Users} label="Total Users" value={stats?.totalUsers || 0} color="text-purple-500 bg-purple-500/10" />
                <StatCard icon={MessageSquare} label="Pending Reviews" value={stats?.pendingReviews || 0} color="text-amber-500 bg-amber-500/10" />
                <StatCard icon={List} label="Genres Active" value={stats?.booksPerGenre?.length || 0} color="text-emerald-500 bg-emerald-500/10" />
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
                <div className="glass p-6 rounded-3xl">
                    <h3 className="font-bold text-xl mb-6">Books per Genre</h3>
                    <div className="space-y-4">
                        {stats?.booksPerGenre?.map((genre, i) => (
                            <div key={i} className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors">
                                <span className="font-medium">{genre._id || 'Uncategorized'}</span>
                                <span className="px-3 py-1 bg-white/10 rounded-full text-sm">{genre.count} books</span>
                            </div>
                        ))}
                        {(!stats?.booksPerGenre || stats.booksPerGenre.length === 0) && (
                            <p className="text-muted-foreground">No data available.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatCard({ icon: Icon, label, value, color }) {
    return (
        <div className="glass p-6 rounded-2xl flex items-center space-x-4">
            <div className={`p-4 rounded-xl ${color}`}>
                <Icon className="w-6 h-6" />
            </div>
            <div>
                <p className="text-muted-foreground text-sm">{label}</p>
                <p className="text-3xl font-bold">{value}</p>
            </div>
        </div>
    );
}
