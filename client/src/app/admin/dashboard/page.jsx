'use client';

import { useState, useEffect } from 'react';
import api from '@/services/api';
import { Loader2, Users, Book, MessageSquare, List, BarChart as BarIcon } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function AdminDashboard() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

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

            <div className="grid lg:grid-cols-1 gap-8">
                <div className="glass p-8 rounded-3xl">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="font-bold text-xl flex items-center">
                            <BarIcon className="w-5 h-5 mr-2 text-emerald-500" />
                            Books per Genre
                        </h3>
                    </div>
                    <div className="h-[350px] w-full">
                        {stats?.booksPerGenre && stats.booksPerGenre.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={stats.booksPerGenre.map(g => ({ name: g._id || 'Unknown', count: g.count }))}
                                    margin={{ bottom: isMobile ? 40 : 10, left: isMobile ? -20 : 0, right: 10, top: 10 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                    <XAxis
                                        dataKey="name"
                                        stroke="#94a3b8"
                                        fontSize={isMobile ? 10 : 12}
                                        tickLine={false}
                                        axisLine={false}
                                        angle={isMobile ? -45 : 0}
                                        textAnchor={isMobile ? "end" : "middle"}
                                        interval={0}
                                    />
                                    <YAxis
                                        stroke="#94a3b8"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                        allowDecimals={false}
                                    />
                                    <Tooltip
                                        cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                        contentStyle={{ backgroundColor: '#18181b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                                        itemStyle={{ color: '#fff' }}
                                    />
                                    <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                                        {stats.booksPerGenre.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444'][index % 5]} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex items-center justify-center text-muted-foreground italic">
                                No genre data available.
                            </div>
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
