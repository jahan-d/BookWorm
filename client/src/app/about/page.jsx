export default function AboutPage() {
    return (
        <div className="min-h-screen pt-24 px-6 pb-20">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-5xl font-bold mb-6">About BookWorm</h1>
                <p className="text-xl text-muted-foreground mb-12">
                    Your personal reading companion for tracking, discovering, and sharing your literary journey.
                </p>

                <div className="space-y-8">
                    <section className="glass rounded-3xl p-8">
                        <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            BookWorm was created to help book lovers organize their reading life, discover new books,
                            and connect with fellow readers. We believe that reading is more enjoyable when shared,
                            and we're building a community where readers can track their progress, share reviews, and
                            inspire each other.
                        </p>
                    </section>

                    <section className="glass rounded-3xl p-8">
                        <h2 className="text-3xl font-bold mb-4">What We Offer</h2>
                        <ul className="space-y-4 text-muted-foreground">
                            <li className="flex items-start">
                                <span className="text-primary mr-3">📚</span>
                                <span><strong>Personal Library:</strong> Organize your books into custom shelves (Want to Read, Currently Reading, Read)</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-primary mr-3">🎯</span>
                                <span><strong>Reading Goals:</strong> Set and track annual reading targets to stay motivated</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-primary mr-3">📊</span>
                                <span><strong>Statistics:</strong> Visualize your reading habits with detailed analytics</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-primary mr-3">✍️</span>
                                <span><strong>Reviews & Ratings:</strong> Share your thoughts and discover what others are reading</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-primary mr-3">🤝</span>
                                <span><strong>Social Features:</strong> Follow readers, see activity feeds, and build your reading community</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-primary mr-3">🔍</span>
                                <span><strong>Smart Recommendations:</strong> Get personalized book suggestions based on your reading history</span>
                            </li>
                        </ul>
                    </section>

                    <section className="glass rounded-3xl p-8">
                        <h2 className="text-3xl font-bold mb-4">Join Our Community</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            Whether you're a casual reader or a bookworm who devours hundreds of books a year,
                            we welcome you to join our growing community. Start tracking your reading journey today!
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
