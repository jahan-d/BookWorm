export default function PrivacyPage() {
    return (
        <div className="min-h-screen pt-24 px-6 pb-20">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-5xl font-bold mb-6">Privacy Policy</h1>
                <p className="text-muted-foreground mb-12">
                    Last updated: {new Date().toLocaleDateString()}
                </p>

                <div className="space-y-8">
                    <section className="glass rounded-3xl p-8">
                        <h2 className="text-2xl font-bold mb-4">Information We Collect</h2>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            When you create an account on BookWorm, we collect the following information:
                        </p>
                        <ul className="list-disc list-inside text-muted-foreground space-y-2">
                            <li>Email address (for authentication)</li>
                            <li>Name and profile photo (optional)</li>
                            <li>Reading activity (books added to shelves, reviews, ratings)</li>
                            <li>Reading goals and progress</li>
                            <li>Social connections (users you follow)</li>
                        </ul>
                    </section>

                    <section className="glass rounded-3xl p-8">
                        <h2 className="text-2xl font-bold mb-4">How We Use Your Information</h2>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            We use your information to:
                        </p>
                        <ul className="list-disc list-inside text-muted-foreground space-y-2">
                            <li>Provide and maintain your personal reading library</li>
                            <li>Generate personalized book recommendations</li>
                            <li>Display your reading statistics and progress</li>
                            <li>Enable social features (activity feeds, following users)</li>
                            <li>Improve our services and user experience</li>
                        </ul>
                    </section>

                    <section className="glass rounded-3xl p-8">
                        <h2 className="text-2xl font-bold mb-4">Data Security</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            We implement industry-standard security measures to protect your personal information.
                            Your password is encrypted, and we use secure connections (HTTPS) for all data transmission.
                            However, no method of transmission over the Internet is 100% secure, so we cannot guarantee absolute security.
                        </p>
                    </section>

                    <section className="glass rounded-3xl p-8">
                        <h2 className="text-2xl font-bold mb-4">Sharing Your Information</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            We do not sell, trade, or rent your personal information to third parties. Your reading activity
                            and reviews may be visible to other users based on your privacy settings and social connections.
                            We may share aggregated, anonymized data for analytics purposes.
                        </p>
                    </section>

                    <section className="glass rounded-3xl p-8">
                        <h2 className="text-2xl font-bold mb-4">Cookies</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            We use cookies and similar technologies to maintain your session, remember your preferences,
                            and analyze site usage. You can control cookie settings through your browser preferences.
                        </p>
                    </section>

                    <section className="glass rounded-3xl p-8">
                        <h2 className="text-2xl font-bold mb-4">Your Rights</h2>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            You have the right to:
                        </p>
                        <ul className="list-disc list-inside text-muted-foreground space-y-2">
                            <li>Access your personal data</li>
                            <li>Request correction of inaccurate data</li>
                            <li>Request deletion of your account and data</li>
                            <li>Export your data</li>
                            <li>Opt out of certain data collection practices</li>
                        </ul>
                    </section>

                    <section className="glass rounded-3xl p-8">
                        <h2 className="text-2xl font-bold mb-4">Changes to This Policy</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            We may update this Privacy Policy from time to time. We will notify you of any significant
                            changes by posting the new policy on this page with an updated "Last updated" date.
                        </p>
                    </section>

                    <section className="glass rounded-3xl p-8">
                        <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            If you have questions about this Privacy Policy or how we handle your data,
                            please contact us through our support channels.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
