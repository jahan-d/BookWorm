'use client';

import { useState, useEffect } from 'react';
import api from '@/services/api';
import { motion } from 'framer-motion';
import { Loader2, PlayCircle } from 'lucide-react';

export default function TutorialsPage() {
    const [tutorials, setTutorials] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTutorials();
    }, []);

    const fetchTutorials = async () => {
        try {
            const response = await api.get('/tutorials');
            setTutorials(response.data);
        } catch (err) {
            console.error('Failed to fetch tutorials:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen pt-24 px-6 pb-20">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold mb-4">Book Tutorials & Reviews</h1>
                    <p className="text-muted-foreground">Deep dive into your favorite stories with our curated video collection.</p>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="w-10 h-10 animate-spin text-primary" />
                    </div>
                ) : tutorials.length === 0 ? (
                    <div className="text-center py-20 text-muted-foreground glass rounded-3xl border border-white/5">
                        <p className="text-xl">No tutorials available at the moment.</p>
                        <p className="text-sm mt-2 opacity-60">Check back later for curated reading tips and reviews.</p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {tutorials.map((video, index) => (
                            <motion.div
                                key={video._id}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="glass rounded-3xl overflow-hidden group hover:shadow-2xl hover:shadow-primary/20 transition-all duration-500 border border-white/5 flex flex-col h-full"
                            >
                                <div className="relative aspect-video bg-black/40 group-hover:scale-105 transition-transform duration-700">
                                    <iframe
                                        width="100%"
                                        height="100%"
                                        src={video.videoUrl.includes('embed') ? video.videoUrl : `https://www.youtube.com/embed/${getYouTubeID(video.videoUrl)}`}
                                        title={video.title}
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                        className="absolute inset-0"
                                    />
                                </div>
                                <div className="p-8 flex flex-col flex-1">
                                    <div className="flex items-center space-x-2 mb-3">
                                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                                            <PlayCircle className="w-5 h-5 text-primary" />
                                        </div>
                                        <span className="text-xs font-bold uppercase tracking-widest text-primary/60">Tutorial</span>
                                    </div>
                                    <h3 className="font-bold text-xl mb-3 line-clamp-2 leading-tight group-hover:text-primary transition-colors">
                                        {video.title}
                                    </h3>
                                    <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed mb-6 flex-1">
                                        {video.description}
                                    </p>
                                    <button className="text-sm font-bold text-primary group-hover:translate-x-2 transition-transform inline-flex items-center space-x-2">
                                        <span>Full Screen Mode</span>
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                        </svg>
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

function getYouTubeID(url) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
}
