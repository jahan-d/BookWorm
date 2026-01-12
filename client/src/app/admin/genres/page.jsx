'use client';

import { useState, useEffect } from 'react';
import api from '@/services/api';
import { Loader2, Plus, Edit, Trash2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ManageGenresPage() {
    const [genres, setGenres] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newGenre, setNewGenre] = useState('');

    useEffect(() => {
        fetchGenres();
    }, []);

    const fetchGenres = async () => {
        try {
            const res = await api.get('/admin/genres');
            setGenres(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/admin/genres', { name: newGenre });
            setNewGenre('');
            setIsModalOpen(false);
            fetchGenres();
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) return <div className="flex justify-center p-10"><Loader2 className="w-10 h-10 animate-spin" /></div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Manage Genres</h1>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center space-x-2 bg-primary px-4 py-2 rounded-full hover:bg-blue-600 transition-colors"
                >
                    <Plus className="w-5 h-5" />
                    <span>Add Genre</span>
                </button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {genres.map((genre, i) => (
                    <div key={i} className="glass p-6 rounded-2xl flex justify-between items-center">
                        <span className="font-bold text-lg">{genre.name || genre._id}</span>
                        {/* Edit/Delete implementation skipped for brevity as per requirements mainly focus on adding/viewing */}
                    </div>
                ))}
            </div>

            <AnimatePresence>
                {isModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
                            className="bg-zinc-900 w-full max-w-md rounded-3xl p-8 border border-white/10 relative"
                        >
                            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full"><X className="w-5 h-5" /></button>
                            <h2 className="text-2xl font-bold mb-6">Add New Genre</h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <input
                                    className="input-field"
                                    placeholder="Genre Name"
                                    value={newGenre}
                                    onChange={e => setNewGenre(e.target.value)}
                                    required
                                />
                                <button type="submit" className="w-full bg-primary py-3 rounded-xl font-bold hover:bg-blue-600 transition-colors">
                                    Add Genre
                                </button>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
