import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Smartphone, Zap, Globe, LayoutTemplate, Coffee, CheckCircle, Check } from 'lucide-react';
import './landing.css';

const translations = {
    en: {
        nav: {
            login: 'Log In',
            getStarted: 'Get Started'
        },
        hero: {
            badge: 'Now with Real-time Order Tracking',
            title: 'The Digital Menu for',
            titleHighlight: 'Forward-Thinking Venues',
            subtitle: 'Ditch the PDF. Give your customers a beautiful, interactive menu that syncs in real-time. No downloads, no hardware, just scan and order.',
            createMenu: 'Create Menu',
            viewDemo: 'View Demo'
        },
        features: {
            instantUpdates: 'Instant Updates',
            instantUpdatesDesc: 'Change prices, hide out-of-stock items, and update photos instantly. No re-printing.',
            multiLang: 'Multi-Language',
            multiLangDesc: 'Auto-translate your menu for tourists. Support for English, Macedonian, Albanian and more.',
            design: 'Beautiful Design',
            designDesc: 'Premium, app-like experience that feels native. Dark mode included by default.',
            noApp: 'No App Needed',
            noAppDesc: 'Customers just scan a QR code. Works instantly in any browser, iOS or Android.',
            waiters: 'Waiters Mode',
            waitersDesc: 'Special mode for staff to visually explain dishes to guests.',
            tracking: 'Order Tracking',
            trackingDesc: 'Real-time status updates and estimated prep times to keep guests informed.'
        },
        pricing: {
            title: 'Simple, Transparent Pricing',
            subtitle: 'Choose the plan that fits your business needs.',
            monthly: 'Monthly',
            sixMonths: '6 Months',
            annual: 'Annually',
            month: '/mo',
            save: 'Save',
            bestValue: 'Best Value',
            features: {
                menu: 'Unlimited Menu Items',
                qr: 'QR Code Generation',
                analytics: 'Basic Analytics',
                support: 'Email Support',
                priority: 'Priority Support',
                customDomain: 'Custom Domain Support'
            },
            cta: 'Start Now'
        }
    },
    mk: {
        nav: {
            login: 'Најава',
            getStarted: 'Почни'
        },
        hero: {
            badge: 'Сега со следење на нарачки во живо',
            title: 'Дигитално мени за',
            titleHighlight: 'Модерни Ресторани',
            subtitle: 'Заборавете на PDF. Овозможете им на вашите гости преубаво, интерактивно мени кое се синхронизира во реално време. Без симнување апликации.',
            createMenu: 'Креирај Мени',
            viewDemo: 'Види Демо'
        },
        features: {
            instantUpdates: 'Инстант Ажурирање',
            instantUpdatesDesc: 'Менувајте цени и достапност веднаш. Нема потреба од препечатување.',
            multiLang: 'Повеќе Јазици',
            multiLangDesc: 'Автоматски превод за туристи. Поддршка за Англиски, Македонски, Албански.',
            design: 'Преубав Дизајн',
            designDesc: 'Премиум искуство кое изгледа како апликација. Вклучен темен мод.',
            noApp: 'Без Апликација',
            noAppDesc: 'Гостите само скенираат QR код. Работи веднаш на секој телефон.',
            waiters: 'Келнерски Мод',
            waitersDesc: 'Специјален поглед за персоналот за презентација на храната.',
            tracking: 'Следење Нарачки',
            trackingDesc: 'Статус на нарачка и време на подготовка во реално време.'
        },
        pricing: {
            title: 'Едноставни Цени',
            subtitle: 'Изберете го планот кој најмногу ви одговара.',
            monthly: 'Месечно',
            sixMonths: '6 Месеци',
            annual: 'Годишно',
            month: '/мес',
            save: 'Заштеди',
            bestValue: 'Најпопуларно',
            features: {
                menu: 'Неограничени Артикли',
                qr: 'QR Код Генератор',
                analytics: 'Основна Аналитика',
                support: 'Емаил Поддршка',
                priority: 'Приоритетна Поддршка',
                customDomain: 'Сопствен Домен'
            },
            cta: 'Избери План'
        }
    },
    sq: {
        nav: {
            login: 'Kyçu',
            getStarted: 'Fillo Tani'
        },
        hero: {
            badge: 'Tani me gjurmim të porosive në kohë reale',
            title: 'Menu Dixhitale për',
            titleHighlight: 'Vendi Moderne',
            subtitle: 'Harrojeni PDF-në. Jepuni klientëve tuaj një menu të bukur dhe interaktive. Pa shkarkime, pa pajisje shtesë.',
            createMenu: 'Krijo Menu',
            viewDemo: 'Shiko Demo'
        },
        features: {
            instantUpdates: 'Përditësime të Çastit',
            instantUpdatesDesc: 'Ndryshoni çmimet dhe disponueshmërinë menjëherë.',
            multiLang: 'Shumë Gjuhë',
            multiLangDesc: 'Përkthim automatik për turistët. Mbështetje për Anglisht, Maqedonisht, Shqip.',
            design: 'Dizajn i Bukur',
            designDesc: 'Përvojë premium si aplikacion. Modaliteti i errët i përfshirë.',
            noApp: 'Pa Aplikacion',
            noAppDesc: 'Klientët thjesht skanojnë një kod QR. Punon menjëherë.',
            waiters: 'Modaliteti i Kamarierit',
            waitersDesc: 'Pamje speciale për stafin për të shpjeguar ushqimet.',
            tracking: 'Gjurmimi i Porosisë',
            trackingDesc: 'Statusi në kohë reale dhe koha e përgatitjes.'
        },
        pricing: {
            title: 'Çmime Transparente',
            subtitle: 'Zgjidhni planin që i përshtatet biznesit tuaj.',
            monthly: 'Mujore',
            sixMonths: '6 Muaj',
            annual: 'Vjetore',
            month: '/muaj',
            save: 'Kurse',
            bestValue: 'Vlera më e mirë',
            features: {
                menu: 'Artikuj pa limit',
                qr: 'Gjenerim i kodit QR',
                analytics: 'Analitikë Bazë',
                support: 'Mbështetje me Email',
                priority: 'Mbështetje Prioritare',
                customDomain: 'Domen i Personalizuar'
            },
            cta: 'Fillo Tani'
        }
    }
};

const LandingPage = () => {
    const [lang, setLang] = useState('en');
    const t = translations[lang];

    return (
        <div className="landing-page">
            {/* Nav */}
            <nav className="landing-nav">
                <div className="landing-logo">Qarta.</div>

                <div className="landing-nav-actions">
                    <div style={{ display: 'flex', gap: '8px' }}>
                        {['en', 'mk', 'sq'].map((l) => (
                            <button
                                key={l}
                                onClick={() => setLang(l)}
                                className={`landing-lang-btn ${lang === l ? 'active' : ''}`}
                            >
                                {l.toUpperCase()}
                            </button>
                        ))}
                    </div>

                    <Link to="/login" style={{ color: '#a1a1aa', textDecoration: 'none', fontWeight: 500, fontSize: '14px', marginLeft: '12px' }}>
                        {t.nav.login}
                    </Link>
                    <Link to="/login?mode=signup" className="landing-btn landing-btn-primary" style={{ padding: '8px 20px', fontSize: '14px' }}>
                        {t.nav.getStarted}
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
                        <span>{t.hero.badge}</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="hero-title"
                    >
                        {t.hero.title} <br />
                        <span>{t.hero.titleHighlight}</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="hero-subtitle"
                    >
                        {t.hero.subtitle}
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="hero-actions"
                    >
                        <Link to="/login?mode=signup" className="landing-btn landing-btn-primary" style={{ padding: '14px 32px', fontSize: '18px' }}>
                            {t.hero.createMenu}
                        </Link>
                        <Link to="/netaville" className="landing-btn landing-btn-glass" style={{ padding: '14px 32px', fontSize: '18px' }}>
                            {t.hero.viewDemo} <ArrowRight size={18} style={{ marginLeft: 8 }} />
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
                            {/* Simple UI Representation - Keeping neutral colors */}
                            <div style={{ width: '100%', height: '100%', display: 'flex', gap: '2px' }}>
                                <div style={{ flex: 1, background: '#0f172a', padding: '24px' }}>
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
                                                <div style={{ width: '24px', height: '24px', background: '#0ea5e9', borderRadius: '50%' }} />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div style={{ width: '300px', background: '#020617', borderLeft: '1px solid rgba(255,255,255,0.05)', padding: '24px', display: 'flex', flexDirection: 'column' }}>
                                    <div style={{ marginBottom: 'auto' }}>
                                        <div style={{ width: '60%', height: '16px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', marginBottom: '16px' }} />
                                        <div style={{ width: '100%', height: '100px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px' }} />
                                    </div>
                                    <div style={{ width: '100%', height: '48px', background: '#0ea5e9', borderRadius: '12px', marginTop: '24px' }} />
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
                        title={t.features.instantUpdates}
                        desc={t.features.instantUpdatesDesc}
                    />
                    <FeatureCard
                        icon={<Globe size={24} />}
                        title={t.features.multiLang}
                        desc={t.features.multiLangDesc}
                    />
                    <FeatureCard
                        icon={<LayoutTemplate size={24} />}
                        title={t.features.design}
                        desc={t.features.designDesc}
                    />
                    <FeatureCard
                        icon={<Smartphone size={24} />}
                        title={t.features.noApp}
                        desc={t.features.noAppDesc}
                    />
                    <FeatureCard
                        icon={<Coffee size={24} />}
                        title={t.features.waiters}
                        desc={t.features.waitersDesc}
                    />
                    <FeatureCard
                        icon={<CheckCircle size={24} />}
                        title={t.features.tracking}
                        desc={t.features.trackingDesc}
                    />
                </div>
            </section>

            {/* Pricing Section */}
            <section className="pricing-section">
                <h2 className="section-title">{t.pricing.title}</h2>
                <p className="section-subtitle">{t.pricing.subtitle}</p>

                <div className="pricing-grid">
                    {/* Monthly */}
                    <div className="pricing-card">
                        <div className="pricing-plan">{t.pricing.monthly}</div>
                        <div className="pricing-price">1200<span> {t.pricing.month}</span></div>
                        <div className="pricing-period">MKD</div>
                        <ul className="pricing-features">
                            <li><Check size={16} className="pricing-check" /> {t.pricing.features.menu}</li>
                            <li><Check size={16} className="pricing-check" /> {t.pricing.features.qr}</li>
                            <li><Check size={16} className="pricing-check" /> {t.pricing.features.analytics}</li>
                            <li><Check size={16} className="pricing-check" /> {t.pricing.features.support}</li>
                        </ul>
                        <Link to="/login?mode=signup" className="landing-btn landing-btn-glass pricing-cta">{t.pricing.cta}</Link>
                    </div>

                    {/* 6 Months */}
                    <div className="pricing-card">
                        <div className="popular-badge">{t.pricing.save} 17%</div>
                        <div className="pricing-plan">{t.pricing.sixMonths}</div>
                        <div className="pricing-price">6000<span> / 6 mo</span></div>
                        <div className="pricing-period">MKD</div>
                        <ul className="pricing-features">
                            <li><Check size={16} className="pricing-check" /> {t.pricing.features.menu}</li>
                            <li><Check size={16} className="pricing-check" /> {t.pricing.features.qr}</li>
                            <li><Check size={16} className="pricing-check" /> {t.pricing.features.analytics}</li>
                            <li><Check size={16} className="pricing-check" /> {t.pricing.features.support}</li>
                        </ul>
                        <Link to="/login?mode=signup" className="landing-btn landing-btn-glass pricing-cta">{t.pricing.cta}</Link>
                    </div>

                    {/* Annual */}
                    <div className="pricing-card popular">
                        <div className="popular-badge">{t.pricing.bestValue}</div>
                        <div className="pricing-plan">{t.pricing.annual}</div>
                        <div className="pricing-price">10800<span> / yr</span></div>
                        <div className="pricing-period">MKD (900/mo)</div>
                        <ul className="pricing-features">
                            <li><Check size={16} className="pricing-check" /> {t.pricing.features.menu}</li>
                            <li><Check size={16} className="pricing-check" /> {t.pricing.features.qr}</li>
                            <li><Check size={16} className="pricing-check" /> {t.pricing.features.analytics}</li>
                            <li><Check size={16} className="pricing-check" /> {t.pricing.features.priority}</li>
                            <li><Check size={16} className="pricing-check" /> {t.pricing.features.customDomain}</li>
                        </ul>
                        <Link to="/login?mode=signup" className="landing-btn landing-btn-primary pricing-cta">{t.pricing.cta}</Link>
                    </div>
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
