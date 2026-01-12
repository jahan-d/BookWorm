'use client';

import { useState, useEffect } from 'react';
import api from '@/services/api';
import { Loader2, Plus, Edit, Trash2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ManageBooksPage() {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBook, setEditingBook] = useState(null);

    useEffect(() => {
        fetchBooks();
    }, []);

    const fetchBooks = async () => {
        try {
            const res = await api.get('/books?limit=100'); // Fetch all for management
            setBooks(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this book?')) return;
        try {
            await api.delete(`/books/${id}`);
            setBooks(books.filter(b => b._id !== id));
        } catch (err) {
            console.error('Failed to delete book', err);
        }
    };

    const openModal = (book = null) => {
        setEditingBook(book);
        setIsModalOpen(true);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Manage Books</h1>
                <button
                    onClick={() => openModal()}
                    className="flex items-center space-x-2 bg-primary px-4 py-2 rounded-full hover:bg-blue-600 transition-colors"
                >
                    <Plus className="w-5 h-5" />
                    <span>Add Book</span>
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center"><Loader2 className="w-10 h-10 animate-spin" /></div>
            ) : (
                <div className="glass rounded-3xl overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-white/5 border-b border-white/10 text-muted-foreground uppercase text-xs">
                            <tr>
                                <th className="p-6">Book</th>
                                <th className="p-6">Author</th>
                                <th className="p-6">Genre</th>
                                <th className="p-6 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/10">
                            {books.map(book => (
                                <tr key={book._id} className="hover:bg-white/5 transition-colors">
                                    <td className="p-6 flex items-center space-x-4">
                                        <img src={book.coverImage} alt="" className="w-10 h-14 object-cover rounded" />
                                        <span className="font-bold">{book.title}</span>
                                    </td>
                                    <td className="p-6">{book.author}</td>
                                    <td className="p-6">
                                        <span className="px-3 py-1 rounded-full bg-white/10 text-xs">{book.genre}</span>
                                    </td>
                                    <td className="p-6 text-right space-x-2">
                                        <button onClick={() => openModal(book)} className="p-2 hover:bg-white/10 rounded-full text-blue-400">
                                            <Edit className="w-4 h-4" />
                                        </button>
                                        <button onClick={() => handleDelete(book._id)} className="p-2 hover:bg-white/10 rounded-full text-red-400">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Simplified Modal due to length constraint - Ideally use a separate component */}
            <AnimatePresence>
                {isModalOpen && (
                    <BookModal
                        book={editingBook}
                        onClose={() => setIsModalOpen(false)}
                        onSave={() => { setIsModalOpen(false); fetchBooks(); }}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}

function BookModal({ book, onClose, onSave }) {
    const [formData, setFormData] = useState({
        title: book?.title || '',
        author: book?.author || '',
        genre: book?.genre || '',
        description: book?.description || '',
        coverImage: book?.coverImage || '',
        pages: book?.pages || '',
        publishedDate: book?.publishedDate || '',
        rating: book?.rating || 0
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (book) {
                await api.put(`/books/${book._id}`, formData);
            } else {
                await api.post('/books', formData);
            }
            onSave();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        >
            <motion.div
                initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
                className="bg-zinc-900 w-full max-w-lg rounded-3xl p-8 border border-white/10 relative max-h-[90vh] overflow-y-auto"
            >
                <button onClick={onClose} className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full"><X className="w-5 h-5" /></button>
                <h2 className="text-2xl font-bold mb-6">{book ? 'Edit Book' : 'Add New Book'}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input className="input-field" placeholder="Title" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} required />
                    <input className="input-field" placeholder="Author" value={formData.author} onChange={e => setFormData({ ...formData, author: e.target.value })} required />
                    <div className="grid grid-cols-2 gap-4">
                        <input className="input-field" placeholder="Genre" value={formData.genre} onChange={e => setFormData({ ...formData, genre: e.target.value })} required />
                        <input className="input-field" type="number" placeholder="Pages" value={formData.pages} onChange={e => setFormData({ ...formData, pages: parseInt(e.target.value) })} />
                    </div>
                    <input className="input-field" type="date" placeholder="Published Date" value={formData.publishedDate ? new Date(formData.publishedDate).toISOString().split('T')[0] : ''} onChange={e => setFormData({ ...formData, publishedDate: e.target.value })} />
                    <input className="input-field" placeholder="Cover Image URL" value={formData.coverImage} onChange={e => setFormData({ ...formData, coverImage: e.target.value })} required />
                    <textarea className="input-field min-h-[100px]" placeholder="Description" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />

                    <button type="submit" className="w-full bg-primary py-3 rounded-xl font-bold hover:bg-blue-600 transition-colors">
                        {book ? 'Update Book' : 'Create Book'}
                    </button>
                </form>
            </motion.div>
        </motion.div>
    );
}
