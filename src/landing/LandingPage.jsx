import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Smartphone, Zap, Globe, LayoutTemplate, Coffee, CheckCircle, Check, ChevronDown, ChevronUp, Instagram, Twitter, Facebook, Menu, X, Users, Share2, ArrowUp, QrCode } from 'lucide-react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import './landing.css';

const translations = {
    en: {
        nav: {
            login: 'Log In',
            getStarted: 'Get Started',
            features: 'Features',
            howItWorks: 'How it Works',
            pricing: 'Pricing',
            faq: 'FAQ'
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
            getStarted: 'Почни',
            features: 'Карактеристики',
            howItWorks: 'Како работи',
            pricing: 'Цени',
            faq: 'ЧПП'
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
            getStarted: 'Fillo Tani',
            features: 'Veçoritë',
            howItWorks: 'Si Punon',
            pricing: 'Çmimet',
            faq: 'FAQ'
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

    // Custom Smooth Scroll Function (Guaranteed Animation)
    const scrollToSection = (e, id) => {
        e.preventDefault();
        const element = document.getElementById(id);
        if (!element) return;

        let offset = 80;
        if (id === 'pricing') {
            offset = 20; // Scroll less for pricing (more space at top)
        }
        const bodyRect = document.body.getBoundingClientRect().top;
        const elementRect = element.getBoundingClientRect().top;
        const elementPosition = elementRect - bodyRect;
        const targetPosition = elementPosition - offset;
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        const duration = 800; // ms
        let start = null;

        // Easing function: easeInOutCubic
        const ease = (t, b, c, d) => {
            t /= d / 2;
            if (t < 1) return c / 2 * t * t * t + b;
            t -= 2;
            return c / 2 * (t * t * t + 2) + b;
        };

        const animation = (currentTime) => {
            if (start === null) start = currentTime;
            const timeElapsed = currentTime - start;
            const run = ease(timeElapsed, startPosition, distance, duration);
            window.scrollTo(0, run);
            if (timeElapsed < duration) requestAnimationFrame(animation);
        };

        requestAnimationFrame(animation);
        closeMenu();
    };

    // Back to Top Button Logic
    const [showBackToTop, setShowBackToTop] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 400) {
                setShowBackToTop(true);
            } else {
                setShowBackToTop(false);
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        const startPosition = window.pageYOffset;
        const targetPosition = 0;
        const distance = targetPosition - startPosition;
        const duration = 800; // ms
        let start = null;

        // Same cubic ease
        const ease = (t, b, c, d) => {
            t /= d / 2;
            if (t < 1) return c / 2 * t * t * t + b;
            t -= 2;
            return c / 2 * (t * t * t + 2) + b;
        };

        const animation = (currentTime) => {
            if (start === null) start = currentTime;
            const timeElapsed = currentTime - start;
            const run = ease(timeElapsed, startPosition, distance, duration);
            window.scrollTo(0, run);
            if (timeElapsed < duration) requestAnimationFrame(animation);
        };

        requestAnimationFrame(animation);
    };

    // Custom Cursor Logic - Instant Tracking
    const cursorX = useMotionValue(-100);
    const cursorY = useMotionValue(-100);

    // Click Ripple State
    const [clicks, setClicks] = useState([]);

    // Hero Tilt Logic
    const heroX = useMotionValue(0);
    const heroY = useMotionValue(0);
    const rotateX = useTransform(heroY, [-300, 300], [5, -5]); // Reverse Y for logical tilt
    const rotateY = useTransform(heroX, [-300, 300], [-5, 5]);

    const handleHeroMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        heroX.set(x);
        heroY.set(y);
    };

    const handleHeroMouseLeave = () => {
        heroX.set(0);
        heroY.set(0);
    };

    useEffect(() => {
        const handleClick = (e) => {
            const newClick = { x: e.clientX, y: e.clientY, id: Date.now() };
            setClicks(prev => [...prev, newClick]);
            // Cleanup click after animation
            setTimeout(() => {
                setClicks(prev => prev.filter(c => c.id !== newClick.id));
            }, 600);
        };
        window.addEventListener('click', handleClick);
        return () => window.removeEventListener('click', handleClick);
    }, []);

    return (
        <div className="landing-page">
            {/* Click Animation Ripples */}
            {clicks.map(click => (
                <motion.div
                    key={click.id}
                    initial={{ opacity: 1, scale: 0 }}
                    animate={{ opacity: 0, scale: 2 }}
                    transition={{ duration: 0.5 }}
                    style={{
                        position: 'fixed',
                        left: click.x,
                        top: click.y,
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        border: '2px solid #38bdf8',
                        zIndex: 9999,
                        pointerEvents: 'none',
                        x: '-50%',
                        y: '-50%'
                    }}
                />
            ))}

            {/* Custom Cursor Dot - Instant 1:1 Tracking */}
            <motion.div
                style={{
                    x: cursorX,
                    y: cursorY,
                    position: 'fixed',
                    left: 0,
                    top: 0,
                    zIndex: 99999, // Safe high Z-Index
                    pointerEvents: 'none',
                    marginTop: -6, // Center 12px dot
                    marginLeft: -6
                }}
                className="custom-cursor-dot"
            >
                <div style={{
                    width: '12px',
                    height: '12px',
                    background: '#38bdf8',
                    borderRadius: '50%',
                    border: '1px solid white', // Contrast ring
                    boxShadow: '0 0 12px rgba(56, 189, 248, 0.6)'
                }} />
            </motion.div>
            {/* Nav */}
            <nav className="landing-nav">
                <div className="landing-logo">Qarta.</div>

                {/* Desktop Styles for Lang Picker (Hidden on mobile if needed, but we keep it visible on mobile header now) */}
                {/* Desktop Links - Strictly Centered */}
                {/* Desktop Links - Strictly Centered */}
                <div className="landing-nav-links">
                    <a href="#how-it-works" onClick={(e) => scrollToSection(e, 'how-it-works')} className="nav-link-desktop">{t.nav.howItWorks}</a>
                    <a href="#features" onClick={(e) => scrollToSection(e, 'features')} className="nav-link-desktop">{t.nav.features}</a>
                    <a href="#pricing" onClick={(e) => scrollToSection(e, 'pricing')} className="nav-link-desktop">{t.nav.pricing}</a>
                </div>

                {/* Right Actions: Lang Picker + Login/Signup */}
                <div className="landing-nav-actions">
                    {/* Language Picker */}
                    <div style={{ display: 'flex', gap: '4px', marginRight: '8px' }}>
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

                    <Link to="/login" style={{ color: '#a1a1aa', textDecoration: 'none', fontWeight: 500, fontSize: '14px' }}>
                        {t.nav.login}
                    </Link>
                    <Link to="/login?mode=signup" className="landing-btn landing-btn-primary" style={{ padding: '8px 20px', fontSize: '14px' }}>
                        {t.nav.getStarted}
                    </Link>
                </div>

                {/* Mobile Controls (Lang + Toggle) */}
                <div className="mobile-nav-controls" style={{ alignItems: 'center', gap: '12px' }}>
                    {/* Language Picker on Mobile Header */}
                    <div style={{ display: 'flex', gap: '4px' }}>
                        {['en', 'mk', 'sq'].map((l) => (
                            <button
                                key={l}
                                onClick={() => setLang(l)}
                                className={`landing-lang-btn ${lang === l ? 'active' : ''}`}
                                style={{ padding: '4px 8px', fontSize: '11px' }}
                            >
                                {l.toUpperCase()}
                            </button>
                        ))}
                    </div>

                    <button className="mobile-menu-toggle" onClick={() => setIsMobileMenuOpen(true)}>
                        <Menu size={24} />
                    </button>
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="mobile-menu-overlay open"
                    >
                        {/* Close Button */}
                        <button
                            onClick={closeMenu}
                            style={{
                                position: 'absolute',
                                top: '24px',
                                right: '24px',
                                background: 'rgba(255,255,255,0.1)',
                                border: 'none',
                                borderRadius: '50%',
                                width: '40px',
                                height: '40px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                cursor: 'pointer'
                            }}
                        >
                            <X size={24} />
                        </button>

                        <motion.div
                            className="mobile-menu-content"
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.1, staggerChildren: 0.1 }}
                            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '32px' }}
                        >
                            <a href="#how-it-works" onClick={(e) => scrollToSection(e, 'how-it-works')} className="mobile-nav-link">{t.nav.howItWorks}</a>
                            <a href="#features" onClick={(e) => scrollToSection(e, 'features')} className="mobile-nav-link">{t.nav.features}</a>
                            <a href="#pricing" onClick={(e) => scrollToSection(e, 'pricing')} className="mobile-nav-link">{t.nav.pricing}</a>
                            <a href="#faq" onClick={(e) => scrollToSection(e, 'faq')} className="mobile-nav-link">{t.nav.faq}</a>

                            <div style={{ width: '40px', height: '1px', background: 'rgba(255,255,255,0.1)', margin: '8px 0' }} />

                            <Link
                                to="/login"
                                onClick={closeMenu}
                                style={{ color: 'white', textDecoration: 'none', fontSize: '20px', fontWeight: 600 }}
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
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Hero */}
            <section className="hero-section">
                <div className="hero-blob" />

                <div className="hero-content">
                    {/* Floating Icons - Positioned absolute relative to hero-content (which is centered), so use large negative values or percentage to push out */}
                    <motion.div
                        className="hero-floating-icon left"
                        animate={{
                            y: [0, -20, 0],
                            rotate: [0, 5, 0]
                        }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        style={{
                            position: 'absolute',
                            left: '0', /* Stick to left edge */
                            top: '30%', /* Move down past heading */
                            opacity: 0.6,
                            pointerEvents: 'none'
                        }}
                    >
                        <div style={{
                            padding: '16px',
                            background: 'rgba(56, 189, 248, 0.03)',
                            backdropFilter: 'blur(8px)',
                            borderRadius: '20px',
                            border: '1px solid rgba(56, 189, 248, 0.1)',
                            boxShadow: '0 8px 32px rgba(56, 189, 248, 0.1)'
                        }}>
                            <QrCode size={40} color="#38bdf8" />
                        </div>
                    </motion.div>

                    <motion.div
                        className="hero-floating-icon right"
                        animate={{
                            y: [0, 20, 0],
                            rotate: [0, -5, 0]
                        }}
                        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                        style={{
                            position: 'absolute',
                            right: '0', /* Stick to right edge */
                            top: '40%', /* Move down past heading */
                            opacity: 0.6,
                            pointerEvents: 'none'
                        }}
                    >
                        <div style={{
                            padding: '16px',
                            background: 'rgba(56, 189, 248, 0.03)',
                            backdropFilter: 'blur(8px)',
                            borderRadius: '20px',
                            border: '1px solid rgba(56, 189, 248, 0.1)',
                            boxShadow: '0 8px 32px rgba(56, 189, 248, 0.1)'
                        }}>
                            <Smartphone size={40} color="#38bdf8" />
                        </div>
                    </motion.div>

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

                {/* Abstract Mockup with Tilt & Animation */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 40 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                    style={{ perspective: 1000 }}
                    className="app-mockup-container"
                    onMouseMove={handleHeroMouseMove}
                    onMouseLeave={handleHeroMouseLeave}
                >
                    <motion.div
                        className="app-mockup"
                        style={{
                            rotateX: rotateX,
                            rotateY: rotateY,
                            transformStyle: "preserve-3d"
                        }}
                    >
                        <div className="mockup-frame">
                            <div className="mockup-inner">
                                {/* Functional-style UI */}
                                <div style={{ width: '100%', height: '100%', display: 'flex', gap: '2px' }}>

                                    {/* Sidebar / Main Content */}
                                    <div style={{ flex: 1, background: '#0f172a', padding: '24px', display: 'flex', flexDirection: 'column' }}>
                                        {/* Header Area */}
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                                            <div style={{ width: '120px', height: '24px', background: 'rgba(255,255,255,0.1)', borderRadius: '6px' }} />
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <motion.div
                                                    animate={{ opacity: [1, 0.5, 1] }}
                                                    transition={{ duration: 2, repeat: Infinity }}
                                                    style={{ width: '8px', height: '8px', background: '#22c55e', borderRadius: '50%' }}
                                                />
                                                <div style={{ fontSize: '12px', color: '#22c55e', fontWeight: 600 }}>Live Store</div>
                                            </div>
                                        </div>

                                        {/* Sales Notification Pop-up */}
                                        <motion.div
                                            initial={{ y: 20, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1, x: [0, 0, 0] }}
                                            transition={{ delay: 2, duration: 0.5 }}
                                            style={{
                                                position: 'absolute',
                                                top: '80px',
                                                right: '40px',
                                                background: '#38bdf8',
                                                color: 'black',
                                                padding: '8px 12px',
                                                borderRadius: '8px',
                                                boxShadow: '0 4px 12px rgba(56,189,248,0.3)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '8px',
                                                zIndex: 10
                                            }}
                                        >
                                            <div style={{ width: '20px', height: '20px', background: 'rgba(0,0,0,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <Check size={12} strokeWidth={3} />
                                            </div>
                                            <div>
                                                <div style={{ fontSize: '10px', fontWeight: 700 }}>New Order</div>
                                                <div style={{ fontSize: '10px', opacity: 0.8 }}>Just now · $45.00</div>
                                            </div>
                                        </motion.div>

                                        {/* Animated Charts / Stats */}
                                        <div style={{ display: 'flex', gap: '16px', marginBottom: '32px' }}>
                                            {[1, 2, 3].map(i => (
                                                <div key={i} style={{ flex: 1, aspectRatio: '3/4', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', padding: '12px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', gap: '8px' }}>
                                                    <div style={{ fontSize: '10px', color: '#94a3b8' }}>Sales</div>
                                                    <motion.div
                                                        animate={{ height: ['30%', '60%', '40%', '70%', '30%'] }}
                                                        transition={{ duration: 3 + i, repeat: Infinity, ease: "easeInOut" }}
                                                        style={{ width: '100%', background: `rgba(56, 189, 248, ${0.3 + (i * 0.1)})`, borderRadius: '4px' }}
                                                    />
                                                    <div style={{ height: '4px', width: '40%', background: 'rgba(255,255,255,0.1)', borderRadius: '2px' }} />
                                                </div>
                                            ))}
                                        </div>

                                        {/* Menu Items List */}
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                            {[{ n: 'Burger Combo', p: '$14' }, { n: 'Cappuccino', p: '$5' }].map((item, i) => (
                                                <div key={i} style={{ height: '48px', width: '100%', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', display: 'flex', alignItems: 'center', padding: '0 16px', justifyContent: 'space-between', border: '1px solid rgba(255,255,255,0.03)' }}>
                                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                                        <div style={{ width: '80px', height: '8px', background: 'rgba(255,255,255,0.2)', borderRadius: '4px' }} />
                                                        <div style={{ width: '40px', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px' }} />
                                                    </div>
                                                    <div style={{ padding: '4px 8px', background: 'rgba(56, 189, 248, 0.1)', borderRadius: '4px', color: '#38bdf8', fontSize: '12px', fontWeight: 600 }}>
                                                        {item.p}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Right Panel / Preview Phone */}
                                    <div style={{ width: '280px', background: '#020617', borderLeft: '1px solid rgba(255,255,255,0.05)', padding: '24px', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
                                        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '100px', background: 'linear-gradient(to bottom, rgba(56,189,248,0.05), transparent)', pointerEvents: 'none' }} />

                                        <div style={{ marginBottom: 'auto', zIndex: 1 }}>
                                            <div style={{ width: '60%', height: '16px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', marginBottom: '24px' }} />
                                            {/* Product Card */}
                                            <div style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                                <div style={{ width: '100%', aspectRatio: '16/9', background: 'rgba(56,189,248,0.1)', borderRadius: '8px', marginBottom: '12px' }} />
                                                <div style={{ width: '80%', height: '12px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', marginBottom: '8px' }} />
                                                <div style={{ width: '40%', height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px' }} />
                                            </div>
                                        </div>
                                        {/* Add to Cart Button */}
                                        <motion.div
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            style={{ width: '100%', height: '44px', background: '#0ea5e9', borderRadius: '12px', marginTop: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 600, fontSize: '14px', boxShadow: '0 4px 12px rgba(14, 165, 233, 0.4)' }}
                                        >
                                            Add to Order
                                        </motion.div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            </section>

            {/* How It Works */}
            <section id="how-it-works" className="how-section">
                <div className="section-header align-left">
                    <div className="hero-badge">
                        <Share2 size={14} />
                        <span>Workflow</span>
                    </div>
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
            <section id="features" className="features-section">
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
                <div className="section-header align-right">
                    <div className="hero-badge" style={{ justifyContent: 'flex-end', marginLeft: 'auto', marginRight: '0' }}>
                        <Users size={14} />
                        <span>Community</span>
                    </div>
                    <h2 className="section-title">{t.testimonials.title}</h2>
                </div>

                <div className="testimonials-carousel-container">
                    <div className="testimonials-track">
                        {/* Render multiple sets for seamless loop */}
                        {[...Array(3)].map((_, setIndex) => (
                            <div key={setIndex} className="testimonials-set">
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
                        ))}
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section id="pricing" className="pricing-section">
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
            <section id="faq" className="faq-section">
                <div className="section-header align-left">
                    <h2 className="section-title">{t.faq.title}</h2>
                </div>
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

            {/* Back to Top Button */}
            <AnimatePresence>
                {showBackToTop && (
                    <motion.button
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        onClick={scrollToTop}
                        className="back-to-top-btn"
                        style={{
                            position: 'fixed',
                            bottom: '32px',
                            right: '32px',
                            width: '48px',
                            height: '48px',
                            borderRadius: '50%',
                            background: '#38bdf8',
                            color: 'black',
                            border: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            zIndex: 90,
                            boxShadow: '0 4px 12px rgba(56, 189, 248, 0.4)'
                        }}
                    >
                        <ArrowUp size={24} />
                    </motion.button>
                )}
            </AnimatePresence>
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
