'use client';

import { useState, useEffect } from 'react';
import api from '@/services/api';
import { Loader2, Plus, Trash2, X, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ManageTutorialsPage() {
    const [tutorials, setTutorials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({ title: '', description: '', videoUrl: '' });

    useEffect(() => {
        fetchTutorials();
    }, []);

    const fetchTutorials = async () => {
        try {
            const res = await api.get('/admin/tutorials');
            setTutorials(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/admin/tutorials', formData);
            setFormData({ title: '', description: '', videoUrl: '' });
            setIsModalOpen(false);
            fetchTutorials();
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this tutorial?')) return;
        try {
            await api.delete(`/admin/tutorials/${id}`);
            fetchTutorials();
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) return <div className="flex justify-center p-10"><Loader2 className="w-10 h-10 animate-spin" /></div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Manage Tutorials</h1>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center space-x-2 bg-primary px-4 py-2 rounded-full hover:bg-blue-600 transition-colors"
                >
                    <Plus className="w-5 h-5" />
                    <span>Add Tutorial</span>
                </button>
            </div>

            <div className="grid gap-4">
                {tutorials.map((tutorial, i) => (
                    <div key={tutorial._id || i} className="glass p-6 rounded-2xl flex justify-between items-center group">
                        <div className="flex-1">
                            <h3 className="font-bold text-lg group-hover:text-primary transition-colors">{tutorial.title}</h3>
                            <a href={tutorial.videoUrl} target="_blank" className="text-primary text-sm flex items-center hover:underline mt-1">
                                {tutorial.videoUrl} <ExternalLink className="w-3 h-3 ml-1" />
                            </a>
                            <p className="text-muted-foreground text-sm mt-2 line-clamp-1">{tutorial.description}</p>
                        </div>
                        <button
                            onClick={() => handleDelete(tutorial._id)}
                            className="p-3 text-red-400 hover:bg-red-500/10 rounded-full transition-all"
                            title="Delete Tutorial"
                        >
                            <Trash2 className="w-5 h-5" />
                        </button>
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
                            className="bg-zinc-900 w-full max-w-lg rounded-3xl p-8 border border-white/10 relative"
                        >
                            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full"><X className="w-5 h-5" /></button>
                            <h2 className="text-2xl font-bold mb-6">Add New Tutorial</h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <input className="input-field" placeholder="Title" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} required />
                                <input className="input-field" placeholder="Video URL (YouTube)" value={formData.videoUrl} onChange={e => setFormData({ ...formData, videoUrl: e.target.value })} required />
                                <textarea className="input-field" placeholder="Description" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />

                                <button type="submit" className="w-full bg-primary py-3 rounded-xl font-bold hover:bg-blue-600 transition-colors">
                                    Add Tutorial
                                </button>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
