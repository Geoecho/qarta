import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Smartphone, Zap, Globe, LayoutTemplate, Coffee, CheckCircle, Check, ChevronDown, ChevronUp, Instagram, Twitter, Facebook, Menu, X } from 'lucide-react';
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
        how: {
            title: 'How It Works',
            subtitle: 'Setup takes less than 5 minutes.',
            step1: 'Create Your Menu',
            step1Desc: 'Upload your items, photos, and prices in our easy admin dashboard.',
            step2: 'Print QR Codes',
            step2Desc: 'Download your unique QR code and place it on tables.',
            step3: 'Guests Order',
            step3Desc: 'Customers scan, browse, and order directly from their phone.'
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
        testimonials: {
            title: 'Trusted by Venues',
            t1: "Since switching to Qarta, our order volume increased by 20%. Customers love the photos!",
            a1: "Stefan, Cafe Skopje",
            t2: "The real-time updates are a lifesaver. We never have to explain 'sold out' items anymore.",
            a2: "Elena, Bistro 5",
            t3: "Setup was incredibly easy. We were up and running in 10 minutes.",
            a3: "Arben, Lounge Bar"
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
        },
        faq: {
            title: 'Frequently Asked Questions',
            q1: 'Do I need special hardware?',
            a1: 'No! Qarta works on any smartphone, tablet, or computer. You just need a device to receive orders.',
            q2: 'Can I change my menu anytime?',
            a2: 'Yes, updates are instant. Add items, change prices, or hide sold-out dishes in seconds.',
            q3: 'Is there a free trial?',
            a3: 'Yes, you can try Qarta completely free for 14 days. No credit card required.',
            q4: 'Do you support other languages?',
            a4: 'We support English, Macedonian, and Albanian out of the box. Contact us for more.'
        },
        footer: {
            made: 'Made for hospitality.',
            product: 'Product',
            features: 'Features',
            pricing: 'Pricing',
            login: 'Login',
            company: 'Company',
            about: 'About',
            contact: 'Contact',
            legal: 'Legal',
            privacy: 'Privacy',
            terms: 'Terms',
            copyright: '© 2025 Qarta. All rights reserved.'
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
        how: {
            title: 'Како работи',
            subtitle: 'Поставувањето трае помалку од 5 минути.',
            step1: 'Креирај Мени',
            step1Desc: 'Внесете артикли, слики и цени во нашиот административен панел.',
            step2: 'Испечати QR',
            step2Desc: 'Симнете го вашиот QR код и ставете го на масите.',
            step3: 'Нарачки',
            step3Desc: 'Гостите скенираат, разгледуваат и нарачуваат од нивниот телефон.'
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
        testimonials: {
            title: 'Доверба од Рестораните',
            t1: "Откако го користиме Qarta, нарачките се зголемија за 20%. Гостите ги обожаваат сликите!",
            a1: "Стефан, Кафе Скопје",
            t2: "Ажурирањето во реално време е спас. Не мора да објаснуваме што немаме на залиха.",
            a2: "Елена, Бистро 5",
            t3: "Поставувањето беше прелесно. Бевме спремни за 10 минути.",
            a3: "Арбен, Lounge Bar"
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
        },
        faq: {
            title: 'Често Поставувани Прашања',
            q1: 'Дали ми треба специјален хардвер?',
            a1: 'Не! Qarta работи на секој телефон, таблет или компјутер.',
            q2: 'Можам ли да го менувам менито било кога?',
            a2: 'Да, промените се моментални. Додадете јадења или сменете цени за секунда.',
            q3: 'Има ли бесплатен период?',
            a3: 'Да, можете да го пробате Qarta бесплатно 14 дена.',
            q4: 'Кои јазици се поддржани?',
            a4: 'Поддржуваме Англиски, Македонски и Албански.'
        },
        footer: {
            made: 'Направено за угостителство.',
            product: 'Продукт',
            features: 'Карактеристики',
            pricing: 'Цени',
            login: 'Најава',
            company: 'Компанија',
            about: 'За нас',
            contact: 'Контакт',
            legal: 'Правно',
            privacy: 'Приватност',
            terms: 'Услови',
            copyright: '© 2025 Qarta. Сите права задржани.'
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
        how: {
            title: 'Si Punon',
            subtitle: 'Konfigurimi zgjat më pak se 5 minuta.',
            step1: 'Krijo Menunë',
            step1Desc: 'Ngarko artikujt, fotot dhe çmimet në panelin tonë.',
            step2: 'Printo QR',
            step2Desc: 'Shkarko kodin unik QR dhe vendose në tavolina.',
            step3: 'Mysafirët Porosisin',
            step3Desc: 'Klientët skanojnë, shfletojnë dhe porosisin nga telefoni.'
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
        testimonials: {
            title: 'Besuar nga Bizneset',
            t1: "Që kur përdorim Qarta, porositë u rritën me 20%. Klientët i pëlqejnë fotot!",
            a1: "Stefan, Cafe Skopje",
            t2: "Përditësimet në kohë reale janë shpëtim. Nuk ka më 'mbaroi'.",
            a2: "Elena, Bistro 5",
            t3: "Konfigurimi ishte shumë i lehtë. Ishim gati në 10 minuta.",
            a3: "Arben, Lounge Bar"
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
        },
        faq: {
            title: 'Pyetjet e Shpeshta',
            q1: 'A më duhet pajisje speciale?',
            a1: 'Jo! Qarta punon në çdo telefon, tablet ose kompjuter.',
            q2: 'A mund të ndryshoj menunë?',
            a2: 'Po, ndryshimet janë të menjëhershme. Shtoni artikuj ose ndryshoni çmimet.',
            q3: 'A ka provë falas?',
            a3: 'Po, mund ta provoni Qarta falas për 14 ditë.',
            q4: 'Çfarë gjuhësh mbështesni?',
            a4: 'Ne mbështesim Anglisht, Maqedonisht dhe Shqip.'
        },
        footer: {
            made: 'Ndërtuar për mikpritjen.',
            product: 'Produkti',
            features: 'Veçoritë',
            pricing: 'Çmimet',
            login: 'Kyçu',
            company: 'Kompania',
            about: 'Rreth Nesh',
            contact: 'Kontakt',
            legal: 'Ligjore',
            privacy: 'Privatësia',
            terms: 'Kushtet',
            copyright: '© 2025 Qarta. Të gjitha të drejtat e rezervuara.'
        }
    }
};

const LandingPage = () => {
    const [lang, setLang] = useState('en');
    const [openFaq, setOpenFaq] = useState(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const t = translations[lang];

    const toggleFaq = (index) => {
        setOpenFaq(openFaq === index ? null : index);
    };

    // Close mobile menu when hash link clicked
    const closeMenu = () => setIsMobileMenuOpen(false);

    return (
        <div className="landing-page">
            {/* Nav */}
            <nav className="landing-nav">
                <div className="landing-logo">Qarta.</div>

                {/* Desktop Actions */}
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

                {/* Mobile Menu Toggle */}
                <button className="mobile-menu-toggle" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </nav>

            {/* Mobile Menu Overlay */}
            <div className={`mobile-menu-overlay ${isMobileMenuOpen ? 'open' : ''}`}>
                <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
                    {['en', 'mk', 'sq'].map((l) => (
                        <button
                            key={l}
                            onClick={() => { setLang(l); }}
                            className={`landing-lang-btn ${lang === l ? 'active' : ''}`}
                            style={{ fontSize: '16px', padding: '10px 20px' }}
                        >
                            {l.toUpperCase()}
                        </button>
                    ))}
                </div>

                <Link
                    to="/login"
                    onClick={closeMenu}
                    style={{ color: 'white', textDecoration: 'none', fontSize: '24px', fontWeight: 600 }}
                >
                    {t.nav.login}
                </Link>

                <Link
                    to="/login?mode=signup"
                    onClick={closeMenu}
                    className="landing-btn landing-btn-primary"
                    style={{ padding: '16px 48px', fontSize: '20px' }}
                >
                    {t.nav.getStarted}
                </Link>
            </div>

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
                            {/* Simple UI Representation */}
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

            {/* How It Works */}
            <section className="how-section">
                <div style={{ textAlign: 'center' }}>
                    <h2 className="section-title">{t.how.title}</h2>
                    <p className="section-subtitle">{t.how.subtitle}</p>
                </div>

                <div className="how-steps">
                    <div className="how-step">
                        <div className="step-number">1</div>
                        <div className="step-card">
                            <h3 className="step-title">{t.how.step1}</h3>
                            <p className="step-desc">{t.how.step1Desc}</p>
                        </div>
                    </div>
                    <div className="how-step">
                        <div className="step-number">2</div>
                        <div className="step-card">
                            <h3 className="step-title">{t.how.step2}</h3>
                            <p className="step-desc">{t.how.step2Desc}</p>
                        </div>
                    </div>
                    <div className="how-step">
                        <div className="step-number">3</div>
                        <div className="step-card">
                            <h3 className="step-title">{t.how.step3}</h3>
                            <p className="step-desc">{t.how.step3Desc}</p>
                        </div>
                    </div>
                </div>
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

            {/* Testimonials */}
            <section className="testimonials-section">
                <div style={{ textAlign: 'center' }}>
                    <h2 className="section-title">{t.testimonials.title}</h2>
                </div>
                <div className="testimonials-grid">
                    <TestimonialCard
                        quote={t.testimonials.t1}
                        author={t.testimonials.a1}
                        initials="S"
                    />
                    <TestimonialCard
                        quote={t.testimonials.t2}
                        author={t.testimonials.a2}
                        initials="E"
                    />
                    <TestimonialCard
                        quote={t.testimonials.t3}
                        author={t.testimonials.a3}
                        initials="A"
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

            {/* FAQ */}
            <section className="faq-section">
                <h2 className="section-title" style={{ textAlign: 'center' }}>{t.faq.title}</h2>
                <div className="faq-container">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="faq-item">
                            <button className="faq-question" onClick={() => toggleFaq(i)}>
                                {t.faq[`q${i}`]}
                                {openFaq === i ? <ChevronUp /> : <ChevronDown />}
                            </button>
                            {openFaq === i && (
                                <div className="faq-answer">
                                    {t.faq[`a${i}`]}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </section>

            {/* Footer */}
            <footer className="landing-footer">
                <div className="footer-content">
                    <div className="footer-brand">
                        <h2>Qarta.</h2>
                        <p>{t.footer.made}</p>
                        <div style={{ display: 'flex', gap: '16px', marginTop: '24px' }}>
                            <Instagram size={20} />
                            <Twitter size={20} />
                            <Facebook size={20} />
                        </div>
                    </div>
                    <div className="footer-col">
                        <h3>{t.footer.product}</h3>
                        <ul>
                            <li><Link to="/">{t.footer.features}</Link></li>
                            <li><Link to="/">{t.footer.pricing}</Link></li>
                            <li><Link to="/login">{t.footer.login}</Link></li>
                        </ul>
                    </div>
                    <div className="footer-col">
                        <h3>{t.footer.company}</h3>
                        <ul>
                            <li><a href="#">{t.footer.about}</a></li>
                            <li><a href="#">{t.footer.contact}</a></li>
                        </ul>
                    </div>
                    <div className="footer-col">
                        <h3>{t.footer.legal}</h3>
                        <ul>
                            <li><a href="#">{t.footer.privacy}</a></li>
                            <li><a href="#">{t.footer.terms}</a></li>
                        </ul>
                    </div>
                </div>
                <div className="footer-bottom">
                    <div>{t.footer.copyright}</div>
                </div>
            </footer>
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

const TestimonialCard = ({ quote, author, initials }) => (
    <div className="testimonial-card">
        <div className="testimonial-quote">"{quote}"</div>
        <div className="testimonial-author">
            <div className="author-avatar">{initials}</div>
            <div className="author-info">
                <div>{author}</div>
            </div>
        </div>
    </div>
);

export default LandingPage;
