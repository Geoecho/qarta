import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Smartphone, Zap, Globe, LayoutTemplate, Coffee, CheckCircle } from 'lucide-react';
import './landing.css';

const LandingPage = () => {
    return (
        <div className="landing-page">
            {/* Nav */}
            <nav className="landing-nav">
                <div className="landing-logo">Qarta.</div>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                    <Link to="/login" style={{ color: '#a1a1aa', textDecoration: 'none', fontWeight: 500, fontSize: '14px' }}>
                        Log In
                    </Link>
                    <Link to="/login?mode=signup" className="landing-btn landing-btn-primary" style={{ padding: '8px 20px', fontSize: '14px' }}>
                        Get Started
                    </Link>
                </div>
            </nav>

            {/* Hero */}
            <section className="hero-section">
                <div className="hero-blob" />

                <div className="hero-content">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="hero-badge"
                    >
                        <Zap size={14} />
                        <span>Now with Real-time Order Tracking</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="hero-title"
                    >
                        The Digital Menu for <br />
                        <span>Forward-Thinking Venues</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="hero-subtitle"
                    >
                        Ditch the PDF. Give your customers a beautiful, interactive menu that syncs in real-time. No downloads, no hardware, just scan and order.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="hero-actions"
                    >
                        <Link to="/login?mode=signup" className="landing-btn landing-btn-primary" style={{ padding: '14px 32px', fontSize: '18px' }}>
                            Create Menu
                        </Link>
                        <Link to="/netaville" className="landing-btn landing-btn-glass" style={{ padding: '14px 32px', fontSize: '18px' }}>
                            View Demo <ArrowRight size={18} style={{ marginLeft: 8 }} />
                        </Link>
                    </motion.div>
                </div>

                {/* Abstract Mockup */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 40 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                    className="app-mockup"
                >
                    <div className="mockup-frame">
                        <div className="mockup-inner">
                            {/* Simple UI Representation */}
                            <div style={{ width: '100%', height: '100%', display: 'flex', gap: '2px' }}>
                                <div style={{ flex: 1, background: '#1A1D23', padding: '24px' }}>
                                    <div style={{ width: '40%', height: '24px', background: 'rgba(255,255,255,0.1)', borderRadius: '6px', marginBottom: '32px' }} />
                                    <div style={{ display: 'flex', gap: '16px' }}>
                                        {[1, 2, 3].map(i => (
                                            <div key={i} style={{ flex: 1, aspectRatio: '3/4', background: 'rgba(255,255,255,0.05)', borderRadius: '12px' }} />
                                        ))}
                                    </div>
                                    <div style={{ marginTop: '32px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                        {[1, 2].map(i => (
                                            <div key={i} style={{ height: '60px', width: '100%', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', display: 'flex', alignItems: 'center', padding: '0 16px', justifyContent: 'space-between' }}>
                                                <div style={{ width: '30%', height: '12px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px' }} />
                                                <div style={{ width: '24px', height: '24px', background: '#FF5F1F', borderRadius: '50%' }} />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div style={{ width: '300px', background: '#0F0F11', borderLeft: '1px solid rgba(255,255,255,0.05)', padding: '24px', display: 'flex', flexDirection: 'column' }}>
                                    <div style={{ marginBottom: 'auto' }}>
                                        <div style={{ width: '60%', height: '16px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', marginBottom: '16px' }} />
                                        <div style={{ width: '100%', height: '100px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px' }} />
                                    </div>
                                    <div style={{ width: '100%', height: '48px', background: '#FF5F1F', borderRadius: '12px', marginTop: '24px' }} />
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </section>

            {/* Features */}
            <section className="features-section">
                <div className="features-grid">
                    <FeatureCard
                        icon={<Zap size={24} />}
                        title="Instant Updates"
                        desc="Change prices, hide out-of-stock items, and update photos instantly. No re-printing."
                    />
                    <FeatureCard
                        icon={<Globe size={24} />}
                        title="Multi-Language"
                        desc="Auto-translate your menu for tourists. Support for English, Macedonian, Albanian and more."
                    />
                    <FeatureCard
                        icon={<LayoutTemplate size={24} />}
                        title="Beautiful Design"
                        desc="Premium, app-like experience that feels native. Dark mode included by default."
                    />
                    <FeatureCard
                        icon={<Smartphone size={24} />}
                        title="No App Needed"
                        desc="Customers just scan a QR code. Works instantly in any browser, iOS or Android."
                    />
                    <FeatureCard
                        icon={<Coffee size={24} />}
                        title="Waiters Mode"
                        desc="Special mode for staff to visually explain dishes to guests."
                    />
                    <FeatureCard
                        icon={<CheckCircle size={24} />}
                        title="Order Tracking"
                        desc="Real-time status updates and estimated prep times to keep guests informed."
                    />
                </div>
            </section>
        </div>
    );
};

const FeatureCard = ({ icon, title, desc }) => (
    <div className="feature-card">
        <div className="feature-icon">{icon}</div>
        <h3 className="feature-title">{title}</h3>
        <p className="feature-desc">{desc}</p>
    </div>
);

export default LandingPage;
