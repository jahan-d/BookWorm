'use client';

import { BookOpen, Github, X, Linkedin } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="glass border-t border-white/10 mt-auto">
            <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="grid md:grid-cols-4 gap-8">
                    <div className="space-y-4">
                        <Link href="/" className="flex items-center space-x-2 text-2xl font-bold">
                            <BookOpen className="w-8 h-8 text-primary" />
                            <span className="gradient-text">BookWorm</span>
                        </Link>
                        <p className="text-muted-foreground text-sm">
                            Your digital sanctuary for discovering, tracking, and sharing the joy of reading.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-bold mb-4">Platform</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="/books" className="hover:text-primary transition-colors">Browse Books</Link></li>
                            <li><Link href="/library" className="hover:text-primary transition-colors">My Library</Link></li>
                            <li><Link href="/tutorials" className="hover:text-primary transition-colors">Tutorials</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold mb-4">Company</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
                            <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
                            <li><Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold mb-4">Connect</h4>
                        <div className="flex space-x-4">
                            <SocialLink href="#" icon={X} />
                            <SocialLink href="#" icon={Github} />
                            <SocialLink href="#" icon={Linkedin} />
                        </div>
                    </div>
                </div>

                <div className="border-t border-white/10 mt-12 pt-8 text-center text-sm text-muted-foreground">
                    <p>&copy; {new Date().getFullYear()} BookWorm. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}

function SocialLink({ href, icon: Icon }) {
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 bg-white/5 rounded-full hover:bg-primary/20 hover:text-primary transition-all"
        >
            <Icon className="w-5 h-5" />
        </a>
    );
}
