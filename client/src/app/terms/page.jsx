export default function TermsPage() {
    return (
        <div className="min-h-screen pt-24 px-6 pb-20">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-5xl font-bold mb-6">Terms of Service</h1>
                <p className="text-muted-foreground mb-12">
                    Last updated: {new Date().toLocaleDateString()}
                </p>

                <div className="space-y-8">
                    <section className="glass rounded-3xl p-8">
                        <h2 className="text-2xl font-bold mb-4">1. Acceptance of Terms</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            By accessing and using BookWorm, you accept and agree to be bound by these Terms of Service.
                            If you do not agree to these terms, please do not use our service.
                        </p>
                    </section>

                    <section className="glass rounded-3xl p-8">
                        <h2 className="text-2xl font-bold mb-4">2. User Accounts</h2>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            To use certain features of BookWorm, you must create an account. You agree to:
                        </p>
                        <ul className="list-disc list-inside text-muted-foreground space-y-2">
                            <li>Provide accurate and complete information</li>
                            <li>Maintain the security of your password</li>
                            <li>Be responsible for all activities under your account</li>
                            <li>Notify us immediately of any unauthorized use</li>
                            <li>Not share your account credentials with others</li>
                        </ul>
                    </section>

                    <section className="glass rounded-3xl p-8">
                        <h2 className="text-2xl font-bold mb-4">3. User Content</h2>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            You retain ownership of content you post (reviews, ratings, comments). However, by posting
                            content on BookWorm, you grant us a license to use, display, and distribute your content
                            within the platform. You agree that your content will:
                        </p>
                        <ul className="list-disc list-inside text-muted-foreground space-y-2">
                            <li>Be accurate and not misleading</li>
                            <li>Not violate any intellectual property rights</li>
                            <li>Not contain offensive, harmful, or illegal material</li>
                            <li>Not spam or manipulate the platform</li>
                        </ul>
                    </section>

                    <section className="glass rounded-3xl p-8">
                        <h2 className="text-2xl font-bold mb-4">4. Acceptable Use</h2>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            You agree not to:
                        </p>
                        <ul className="list-disc list-inside text-muted-foreground space-y-2">
                            <li>Violate any laws or regulations</li>
                            <li>Harass, abuse, or harm other users</li>
                            <li>Attempt to gain unauthorized access to our systems</li>
                            <li>Use automated systems to scrape or abuse our service</li>
                            <li>Impersonate others or create fake accounts</li>
                            <li>Share copyrighted material without permission</li>
                        </ul>
                    </section>

                    <section className="glass rounded-3xl p-8">
                        <h2 className="text-2xl font-bold mb-4">5. Intellectual Property</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            BookWorm and its original content, features, and functionality are owned by us and are
                            protected by intellectual property laws. Book covers, titles, and descriptions are property
                            of their respective publishers and authors.
                        </p>
                    </section>

                    <section className="glass rounded-3xl p-8">
                        <h2 className="text-2xl font-bold mb-4">6. Termination</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            We reserve the right to suspend or terminate your account if you violate these terms or engage in &quot;trolling&quot;, &quot;spamming&quot;, or other harmful behavior.ce or for any other reason. You may also delete your account at any
                            time through your account settings.
                        </p>
                    </section>

                    <section className="glass rounded-3xl p-8">
                        <h2 className="text-2xl font-bold mb-4">7. Disclaimers</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            BookWorm is provided "as is" without warranties of any kind. We do not guarantee that the
                            service will be uninterrupted, secure, or error-free. Book recommendations and information
                            are provided for informational purposes only.
                        </p>
                    </section>

                    <section className="glass rounded-3xl p-8">
                        <h2 className="text-2xl font-bold mb-4">8. Limitation of Liability</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            To the maximum extent permitted by law, we shall not be liable for any indirect, incidental,
                            special, consequential, or punitive damages arising from your use of BookWorm.
                        </p>
                    </section>

                    <section className="glass rounded-3xl p-8">
                        <h2 className="text-2xl font-bold mb-4">9. Changes to Terms</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            We reserve the right to modify these Terms of Service at any time. Significant changes will
                            be communicated to users. Continued use of the service after changes constitutes acceptance
                            of the new terms.
                        </p>
                    </section>

                    <section className="glass rounded-3xl p-8">
                        <h2 className="text-2xl font-bold mb-4">10. Contact</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            If you have questions about these Terms of Service, please contact us through our support
                            channels.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
