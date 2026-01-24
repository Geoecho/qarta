import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Smartphone, Zap, Globe, LayoutTemplate, Coffee, CheckCircle, Check, ChevronDown, ChevronUp, Instagram, Twitter, Facebook, Menu, X, Users, Share2, ArrowUp, QrCode, Plus, ShoppingBag, Utensils, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import './landing.css';

const translations = {
    en: {
        nav: {
            login: 'Log In',
            getStarted: 'Get Started',
            features: 'Features',
            howItWorks: 'How it Works',
            contact: 'Contact',
            faq: 'FAQ'
        },
        hero: {
            badge: 'Next-Gen Digital Menu',
            title: 'The Digital Menu for',
            titleHighlight: ['Restaurants', 'Cafes', 'Bars', 'Hotels'],
            subtitle: 'The simplicity of a PDF, upgraded. Give your customers a clear, beautiful menu that looks great on any device. Instant updates, no reprints.',
            createMenu: 'Contact Us',
            viewDemo: 'View Demo'
        },
        how: {
            title: 'How It Works',
            subtitle: 'Setup takes less than 5 minutes.',
            step1: 'Create Your Menu',
            step1Desc: 'Upload your items, photos, and prices in our easy admin dashboard.',
            step2: 'Print QR Codes',
            step2Desc: 'Download your unique QR code and place it on tables.',
            step3: 'Guests Scan & View',
            step3Desc: 'Customers scan the QR code to instantly view your beautiful digital menu.'
        },
        features: {
            title: 'What We Offer',
            subtitle: 'Everything you need to showcase your menu.',
            instantUpdates: 'Instant Updates',
            instantUpdatesDesc: 'Change prices, hide out-of-stock items, and update photos instantly. No re-printing.',
            multiLang: 'Multi-Language',
            multiLangDesc: 'Auto-translate your menu for tourists. Support for English, Macedonian, Albanian and more.',
            design: 'Beautiful Design',
            designDesc: 'Premium, app-like experience that feels native. Dark mode included by default.',
            noApp: 'No App Needed',
            noAppDesc: 'Customers just scan a QR code. Works instantly in any browser, iOS or Android.',
            waiters: 'Visual Menu',
            waitersDesc: 'Showcase your dishes with high-quality images that make guests hungry.',
            tracking: 'Eco-Friendly',
            trackingDesc: 'Save money on printing costs and reduce paper waste. Update anytime.'
        },
        testimonials: {
            title: 'Trusted by Venues',
            t1: "Since switching to Qarta, customers ask fewer questions because the photos are so clear.",
            a1: "Stefan, Cafe Skopje",
            t2: "The real-time updates are a lifesaver. We never have to explain 'sold out' items anymore.",
            a2: "Elena, Bistro 5",
            t3: "Setup was incredibly easy. We were up and running in 10 minutes.",
            a3: "Arben, Lounge Bar",
            t4: "Best investment for our restaurant. The digital menu looks professional.",
            a4: "David, The Rooftop",
            t5: "We save so much money on printing costs. Highly recommended.",
            a5: "Sarah, Green Garden",
            t6: "It looks amazing on every phone. Much better than our old PDF.",
            a6: "Michael, Urban Bistro"
        },
        contact: {
            title: 'Get in Touch',
            subtitle: 'Ready to modernize your venue? a customized package.',
            name: 'Enter your name',
            email: 'Your email, please',
            message: 'Your message',
            cta: 'Send'
        },
        faq: {
            title: 'Frequently Asked Questions',
            q1: 'Do I need special hardware?',
            a1: 'No! Qarta works on any smartphone, tablet, or computer. You just need a QR code.',
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
            contact: 'Контакт',
            faq: 'ЧПП'
        },
        hero: {
            badge: 'Дигитално Мени',
            title: 'Дигитално мени за',
            titleHighlight: ['Ресторани', 'Кафулиња', 'Барови', 'Хотели'],
            subtitle: 'Едноставноста на PDF, моќта на апликација. Овозможете им на вашите гости преубаво, јасно мени кое изгледа одлично на секој уред. Моментални промени, без печатење.',
            createMenu: 'Контактирајте не',
            viewDemo: 'Види Демо'
        },
        how: {
            title: 'Како работи',
            subtitle: 'Поставувањето трае помалку од 5 минути.',
            step1: 'Креирај Мени',
            step1Desc: 'Внесете артикли, слики и цени во нашиот административен панел.',
            step2: 'Испечати QR',
            step2Desc: 'Симнете го вашиот QR код и ставете го на масите.',
            step3: 'Преглед на Мени',
            step3Desc: 'Гостите скенираат и го разгледуваат менито од нивниот телефон.'
        },
        features: {
            title: 'Што Нудиме',
            subtitle: 'Сè што ви треба за модерен локал.',
            instantUpdates: 'Инстант Ажурирање',
            instantUpdatesDesc: 'Менувајте цени и достапност веднаш. Нема потреба од препечатување.',
            multiLang: 'Повеќе Јазици',
            multiLangDesc: 'Автоматски превод за туристи. Поддршка за Англиски, Македонски, Албански.',
            design: 'Преубав Дизајн',
            designDesc: 'Премиум искуство кое изгледа како апликација. Вклучен темен мод.',
            noApp: 'Без Апликација',
            noAppDesc: 'Гостите само скенираат QR код. Работи веднаш на секој телефон.',
            waiters: 'Богати Визуели',
            waitersDesc: 'Прикажете ги вашите јадења со висококвалитетни слики што отвораат апетит.',
            tracking: 'Еко-Пријателски',
            trackingDesc: 'Заштедете пари за печатење и намалете го отпадот од хартија. Ажурирајте било кога.'
        },
        testimonials: {
            title: 'Доверба од Рестораните',
            t1: "Откако го користиме Qarta, нарачките се зголемија за 20%. Гостите ги обожаваат сликите!",
            a1: "Стефан, Кафе Скопје",
            t2: "Ажурирањето во реално време е спас. Не мора да објаснуваме што немаме на залиха.",
            a2: "Елена, Бистро 5",
            t3: "Поставувањето беше прелесно. Бевме спремни за 10 минути.",
            a3: "Арбен, Lounge Bar",
            t4: "Најдобра инвестиција за нашиот ресторан. Менито изгледа професионално.",
            a4: "Давид, The Rooftop",
            t5: "Заштедуваме многу пари за печатење. Топло препорачувам.",
            a5: "Сара, Green Garden",
            t6: "Нашите келнери го обожаваат посебниот мод. Одлично искуство.",
            a6: "Мајкл, Urban Bistro"
        },
        contact: {
            title: 'Контакт',
            subtitle: 'Спремни за модернизација? Контактирајте не',
            name: 'Име',
            email: 'Емаил',
            message: 'Порака',
            cta: 'Испрати Порака'
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
            contact: 'Kontakt',
            faq: 'FAQ'
        },
        hero: {
            badge: 'Menu Dixhitale',
            title: 'Menu Dixhitale për',
            titleHighlight: ['Restorante', 'Kafe', 'Bare', 'Hotele'],
            subtitle: 'Harrojeni PDF-në. Jepuni klientëve tuaj një menu të bukur dhe interaktive. Pa shkarkime, pa pajisje shtesë.',
            createMenu: 'Na Kontaktoni',
            viewDemo: 'Shiko Demo'
        },
        how: {
            title: 'Si Punon',
            subtitle: 'Konfigurimi zgjat më pak se 5 minuta.',
            step1: 'Krijo Menunë',
            step1Desc: 'Ngarko artikujt, fotot dhe çmimet në panelin tonë.',
            step2: 'Printo QR',
            step2Desc: 'Shkarko kodin unik QR dhe vendose në tavolina.',
            step3: 'Shfleto Menunë',
            step3Desc: 'Klientët skanojnë dhe shfletojnë nga telefoni.'
        },
        features: {
            title: 'Çfarë Ofrojmë',
            subtitle: 'Gjithçka që ju nevojitet për një vend modern.',
            instantUpdates: 'Përditësime të Çastit',
            instantUpdatesDesc: 'Ndryshoni çmimet dhe disponueshmërinë menjëherë.',
            multiLang: 'Shumë Gjuhë',
            multiLangDesc: 'Përkthim automatik për turistët. Mbështetje për Anglisht, Maqedonisht, Shqip.',
            design: 'Dizajn i Bukur',
            designDesc: 'Përvojë premium si aplikacion. Modaliteti i errët i përfshirë.',
            noApp: 'Pa Aplikacion',
            noAppDesc: 'Klientët thjesht skanojnë një kod QR. Punon menjëherë.',
            waiters: 'Pamje Vizuale',
            waitersDesc: 'Paraqisni pjatat tuaja me foto cilësore që shtojnë oreksin.',
            tracking: 'Eko-Miqësore',
            trackingDesc: 'Kurseni para për printim dhe mbroni mjedisin. Përditëso cdo kohë.'
        },
        testimonials: {
            title: 'Besuar nga Bizneset',
            t1: "Që kur përdorim Qarta, porositë u rritën me 20%. Klientët i pëlqejnë fotot!",
            a1: "Stefan, Cafe Skopje",
            t2: "Përditësimet në kohë reale janë shpëtim. Nuk ka më 'mbaroi'.",
            a2: "Elena, Bistro 5",
            t3: "Konfigurimi ishte shumë i lehtë. Ishim gati në 10 minuta.",
            a3: "Arben, Lounge Bar",
            t4: "Investimi më i mirë për restorantin tonë. Menuja duket profesionale.",
            a4: "David, The Rooftop",
            t5: "Kursejmë shumë para për printim. E rekomandoj shumë.",
            a5: "Sarah, Green Garden",
            t6: "Kamarierët tanë e pëlqejnë modin e dedikuar. Përvojë e shkëlqyer.",
            a6: "Michael, Urban Bistro"
        },
        contact: {
            title: 'Kontakt',
            subtitle: 'Gati për të modernizuar vendin tuaj? Na kontaktoni për ofertë.',
            name: 'Emri',
            email: 'Email',
            message: 'Mesazhi',
            cta: 'Dërgo Mesazh'
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
    const [lang, setLang] = useState('mk');
    const [openFaq, setOpenFaq] = useState(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [mockupCartCount, setMockupCartCount] = useState(2); // Start with 2 items for visual demo
    const [hoveredNav, setHoveredNav] = useState(null); // For nav pill animation (kept for state but UI will change)
    const t = translations[lang];

    // Rotating Text Logic
    const [rotateIndex, setRotateIndex] = useState(0);
    useEffect(() => {
        const interval = setInterval(() => {
            setRotateIndex((prev) => (prev + 1) % 4); // 4 words
        }, 3000);
        return () => clearInterval(interval);
    }, []);



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

    // Cursor Logic Removed per user request ("no point")



    return (
        <div className="landing-page">
            {/* Custom Cursor Removed */}
            {/* Nav */}
            <nav className="landing-nav">
                <div className="landing-logo">Qarta.</div>

                {/* Desktop Styles for Lang Picker (Hidden on mobile if needed, but we keep it visible on mobile header now) */}
                {/* Desktop Links - Strictly Centered & Animated */}
                <div className="landing-nav-links" onMouseLeave={() => setHoveredNav(null)}>
                    {[
                        { id: 'how-it-works', label: t.nav.howItWorks },
                        { id: 'features', label: t.nav.features },
                        { id: 'contact', label: t.nav.contact }
                    ].map((item) => (
                        <a
                            key={item.id}
                            href={`#${item.id}`}
                            onClick={(e) => scrollToSection(e, item.id)}
                            onMouseEnter={() => setHoveredNav(item.id)}
                            className="nav-link-desktop"
                            style={{
                                position: 'relative',
                                color: hoveredNav === item.id ? '#fff' : '#94a3b8'
                            }}
                        >
                            {// Clean Underline Effect
                                hoveredNav === item.id && (
                                    <motion.div
                                        layoutId="nav-underline"
                                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                        style={{
                                            position: 'absolute',
                                            bottom: '0px',
                                            left: '16px',
                                            right: '16px',
                                            height: '2px',
                                            borderRadius: '2px',
                                            background: '#38bdf8',
                                            zIndex: 1
                                        }}
                                    />
                                )}
                            {item.label}
                        </a>
                    ))}
                </div>

                {/* Right Actions: Lang Picker + Login/Signup */}
                <div className="landing-nav-actions">
                    {/* Language Picker */}
                    <div style={{ display: 'flex', gap: '4px', marginRight: '8px' }}>
                        {['mk', 'en', 'sq'].map((l) => (
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
                        {['mk', 'en', 'sq'].map((l) => (
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
                            <a href="#contact" onClick={(e) => scrollToSection(e, 'contact')} className="mobile-nav-link">{t.nav.contact}</a>
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

                {/* Floating Icons - Positioned absolute relative to hero-section (max-width 1200px) */}
                <motion.div
                    className="hero-floating-icon left"
                    animate={{
                        y: [0, -20, 0],
                        rotate: [0, 5, 0]
                    }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    style={{
                        position: 'absolute',
                        left: '0',
                        top: '30%',
                        opacity: 0.6,
                        pointerEvents: 'none'
                    }}
                >
                    <div style={{
                        backgroundColor: 'rgba(56, 189, 248, 0.05)',
                        borderRadius: '20px',
                        border: '1px solid rgba(56, 189, 248, 0.2)',
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
                        right: '0',
                        top: '40%',
                        opacity: 0.6,
                        pointerEvents: 'none'
                    }}
                >
                    <div style={{
                        backgroundColor: 'rgba(56, 189, 248, 0.05)',
                        borderRadius: '20px',
                        border: '1px solid rgba(56, 189, 248, 0.2)',
                        boxShadow: '0 8px 32px rgba(56, 189, 248, 0.1)'
                    }}>
                        <Smartphone size={40} color="#38bdf8" />
                    </div>
                </motion.div>

                <div className="hero-content">
                    {/* Floating Icons - Positioned absolute relative to hero-content (which is centered), so use large negative values or percentage to push out */}
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
                        <AnimatePresence mode="wait">
                            <motion.span
                                key={rotateIndex}
                                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 0, scale: 0.95 }}
                                transition={{ duration: 0.4 }}
                                style={{ display: 'inline-block' }}
                            >
                                {t.hero.titleHighlight[rotateIndex]}
                            </motion.span>
                        </AnimatePresence>
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
                        <a href="#contact" onClick={(e) => scrollToSection(e, 'contact')} className="landing-btn landing-btn-primary hero-btn">
                            {t.hero.createMenu}
                        </a>
                        <Link to="/netaville" className="landing-btn landing-btn-glass hero-btn">
                            {t.hero.viewDemo} <ArrowRight size={18} style={{ marginLeft: 8 }} />
                        </Link>
                    </motion.div>
                </div>


                {/* 3-Phone Mobile Mockup Display (Realistic App UI) */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 40 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                    className="app-mockup-container desktop-mockup"
                    style={{
                        perspective: '2000px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: '60px', /* Increased gap for better visibility */
                        marginTop: '60px',
                        transformStyle: 'preserve-3d'
                    }}
                >
                    {/* Left Phone (Info Page) */}
                    <motion.div
                        animate={{
                            y: [0, -15, 0],
                            rotateY: [15, 18, 15],
                            rotateZ: [-2, -3, -2]
                        }}
                        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                        style={{
                            width: '260px',
                            height: '520px',
                            background: '#0f172a',
                            borderRadius: '32px',
                            border: '4px solid #334155',
                            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
                            position: 'relative',
                            overflow: 'hidden',
                            zIndex: 1
                        }}
                    >
                        {/* Header: Back Arrow + Title */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '20px 16px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <div style={{ width: '12px', height: '2px', background: '#fff', borderRadius: '10px' }} />
                                {/* Back Arrow Head */}
                                <div style={{ width: '8px', height: '8px', borderLeft: '2px solid #fff', borderBottom: '2px solid #fff', transform: 'rotate(45deg) translate(2px, -2px)' }} />
                            </div>
                            <div style={{ fontSize: '14px', fontWeight: 600, color: '#fff' }}>Information</div>
                        </div>

                        {/* Content Container */}
                        <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '20px' }}>

                            {/* Restaurant Identity */}
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: 'linear-gradient(135deg, #38bdf8 0%, #0ea5e9 100%)', marginBottom: '12px' }} />
                                <div style={{ width: '120px', height: '16px', background: '#fff', borderRadius: '4px', marginBottom: '6px' }} />
                                <div style={{ width: '80px', height: '10px', background: '#94a3b8', borderRadius: '4px', opacity: 0.7 }} />
                            </div>

                            {/* Info Sections */}
                            {[1, 2, 3].map(i => (
                                <div key={i} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '16px', padding: '16px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                                        <div style={{ width: '16px', height: '16px', borderRadius: '4px', background: '#38bdf8', opacity: 0.8 }} />
                                        <div style={{ width: '80px', height: '10px', background: '#fff', borderRadius: '4px', opacity: 0.9 }} />
                                    </div>
                                    <div style={{ width: '100%', height: '8px', background: '#94a3b8', borderRadius: '4px', marginBottom: '6px', opacity: 0.5 }} />
                                    <div style={{ width: '70%', height: '8px', background: '#94a3b8', borderRadius: '4px', opacity: 0.5 }} />
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Center Phone (Main Landing View with Search) */}
                    <motion.div
                        animate={{
                            y: [0, -25, 0]
                        }}
                        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                        style={{
                            width: '280px',
                            height: '560px',
                            background: '#0f172a',
                            borderRadius: '36px',
                            border: '5px solid #334155',
                            boxShadow: '0 30px 60px -12px rgba(14, 165, 233, 0.25)', // Blue shadow for focus
                            position: 'relative',
                            overflow: 'hidden',
                            zIndex: 10
                        }}
                    >
                        {/* Brand Header */}
                        <div style={{ height: '180px', background: 'linear-gradient(to bottom, rgba(56,189,248,0.2), #0f172a)', position: 'relative', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
                            <div style={{ width: '40px', height: '40px', background: '#38bdf8', borderRadius: '8px', marginBottom: '12px', boxShadow: '0 4px 12px rgba(56,189,248,0.3)' }} />
                            <div style={{ width: '120px', height: '16px', background: '#fff', borderRadius: '4px', marginBottom: '6px' }} />
                            <div style={{ width: '180px', height: '10px', background: '#94a3b8', borderRadius: '4px', opacity: 0.7 }} />
                        </div>

                        {/* Search Bar Skeleton */}
                        <div style={{ padding: '0 16px', marginBottom: '16px' }}>
                            <div style={{
                                height: '44px',
                                background: 'rgba(255,255,255,0.05)',
                                borderRadius: '100px',
                                border: '1px solid rgba(255,255,255,0.1)',
                                display: 'flex',
                                alignItems: 'center',
                                padding: '0 16px',
                                gap: '10px'
                            }}>
                                <div style={{ width: '16px', height: '16px', borderRadius: '50%', border: '2px solid #64748b' }} />
                                <div style={{ width: '100px', height: '8px', background: '#94a3b8', borderRadius: '4px', opacity: 0.5 }} />
                            </div>
                        </div>

                        {/* Category Nav */}
                        <div style={{ display: 'flex', gap: '8px', padding: '0 16px', marginBottom: '20px', overflow: 'hidden' }}>
                            <div style={{ padding: '6px 12px', background: '#38bdf8', borderRadius: '100px', fontSize: '10px', fontWeight: 700, color: '#0f172a' }}>Кафе</div>
                            {[1, 2, 3].map(i => (
                                <div key={i} style={{ width: '60px', height: '26px', background: 'rgba(255,255,255,0.05)', borderRadius: '100px', border: '1px solid rgba(255,255,255,0.1)' }} />
                            ))}
                        </div>

                        {/* List Preview */}
                        <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {[1, 2].map(i => (
                                <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 60px', gap: '12px', alignItems: 'start', paddingBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                        <div style={{ width: '70%', height: '10px', background: '#fff', borderRadius: '2px', opacity: 0.9 }} />
                                        <div style={{ width: '30%', height: '10px', background: '#38bdf8', borderRadius: '2px', fontWeight: 600 }} />
                                        <div style={{ width: '90%', height: '6px', background: '#94a3b8', borderRadius: '2px', opacity: 0.6, marginTop: '2px' }} />
                                        <div style={{ width: '60%', height: '6px', background: '#94a3b8', borderRadius: '2px', opacity: 0.6 }} />
                                    </div>
                                    <div style={{ width: '60px', height: '60px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }} />
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Right Phone (Item Detail View - Clicked Item) */}
                    <motion.div
                        animate={{
                            y: [0, -15, 0],
                            rotateY: [-15, -18, -15],
                            rotateZ: [2, 3, 2]
                        }}
                        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                        style={{
                            width: '260px',
                            height: '520px',
                            background: '#0f172a',
                            borderRadius: '32px',
                            border: '4px solid #334155',
                            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
                            position: 'relative',
                            overflow: 'hidden',
                            zIndex: 1
                        }}
                    >
                        {/* Large Hero Image for Item */}
                        <div style={{ height: '240px', background: 'rgba(56, 189, 248, 0.15)', position: 'relative' }}>
                            <div style={{ position: 'absolute', top: '16px', right: '16px', width: '32px', height: '32px', background: 'rgba(0,0,0,0.5)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <div style={{ width: '12px', height: '2px', background: '#fff', borderRadius: '4px', transform: 'rotate(45deg)', position: 'absolute' }} />
                                <div style={{ width: '12px', height: '2px', background: '#fff', borderRadius: '4px', transform: 'rotate(-45deg)', position: 'absolute' }} />
                            </div>
                        </div>

                        {/* Item Details Content */}
                        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {/* Title & Price */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                                <div style={{ width: '60%', height: '20px', background: '#fff', borderRadius: '4px' }} />
                                <div style={{ width: '25%', height: '20px', background: '#38bdf8', borderRadius: '4px' }} />
                            </div>

                            {/* Description */}
                            <div>
                                <div style={{ width: '100%', height: '8px', background: '#94a3b8', borderRadius: '2px', marginBottom: '6px', opacity: 0.7 }} />
                                <div style={{ width: '90%', height: '8px', background: '#94a3b8', borderRadius: '2px', marginBottom: '6px', opacity: 0.7 }} />
                                <div style={{ width: '60%', height: '8px', background: '#94a3b8', borderRadius: '2px', opacity: 0.7 }} />
                            </div>

                            {/* Options / Extras */}
                            <div style={{ marginTop: '8px' }}>
                                <div style={{ width: '30%', height: '10px', background: '#94a3b8', borderRadius: '2px', marginBottom: '12px' }} />
                                {[1, 2].map(i => (
                                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', alignItems: 'center' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <div style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.2)', borderRadius: '4px' }} />
                                            <div style={{ width: '80px', height: '8px', background: '#fff', borderRadius: '2px', opacity: 0.8 }} />
                                        </div>
                                        <div style={{ width: '30px', height: '8px', background: '#94a3b8', borderRadius: '2px', opacity: 0.6 }} />
                                    </div>
                                ))}
                            </div>

                            {/* Add To Order Button */}

                        </div>
                    </motion.div>
                </motion.div>

                {/* Mobile Specific Mockup (Simplified & Vertical) */}
                <motion.div
                    className="mobile-mockup-container"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                >
                    <div className="mobile-mockup-frame">
                        <div className="dynamic-island" style={{ top: '22px', width: '96px', height: '26px', background: '#000' }} />

                        <div className="mobile-screen">
                            {/* Header Area */}
                            <div style={{ padding: '0 0 24px', background: '#0f172a' }}>
                                <div style={{
                                    height: '140px',
                                    background: 'linear-gradient(180deg, rgba(56,189,248,0.1) 0%, rgba(15,23,42,1) 100%)',
                                    display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
                                    padding: '0 24px'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '16px', marginBottom: '8px' }}>
                                        <div style={{
                                            width: '48px', height: '48px',
                                            background: '#fff',
                                            borderRadius: '12px',
                                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                                        }} />
                                        <div style={{ flex: 1, paddingBottom: '4px' }}>
                                            <div style={{ width: '120px', height: '16px', background: '#fff', borderRadius: '4px', marginBottom: '8px', opacity: 0.9 }} />
                                            <div style={{ width: '80px', height: '10px', background: 'rgba(255,255,255,0.4)', borderRadius: '4px' }} />
                                        </div>
                                    </div>
                                </div>

                                {/* Categories */}
                                <div style={{ display: 'flex', gap: '12px', padding: '0 24px', overflow: 'hidden', marginTop: '16px' }}>
                                    {[1, 2, 3].map((_, i) => (
                                        <div key={i} style={{
                                            height: '34px',
                                            width: i === 0 ? '80px' : '70px',
                                            borderRadius: '100px',
                                            background: i === 0 ? '#38bdf8' : 'rgba(255,255,255,0.05)'
                                        }} />
                                    ))}
                                </div>
                            </div>

                            {/* Menu Items */}
                            <div style={{ padding: '0 24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                                {[1, 2, 3].map(i => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.8 + (i * 0.1) }}
                                        style={{ display: 'grid', gridTemplateColumns: '1fr 72px', gap: '16px' }}
                                    >
                                        <div style={{ paddingTop: '4px' }}>
                                            <div style={{ width: '80%', height: '14px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', marginBottom: '10px' }} />
                                            <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', marginBottom: '6px' }} />
                                            <div style={{ width: '60%', height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', marginBottom: '12px' }} />
                                            <div style={{ width: '40px', height: '10px', background: '#38bdf8', borderRadius: '4px', opacity: 0.6 }} />
                                        </div>

                                        <div style={{ width: '72px', height: '72px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', position: 'relative' }}>
                                            <div style={{
                                                position: 'absolute', bottom: '-6px', right: '-6px',
                                                width: '24px', height: '24px',
                                                background: '#38bdf8', borderRadius: '50%',
                                                border: '2px solid #0f172a'
                                            }} />
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Floating Action Button */}
                            <motion.div
                                initial={{ y: 60 }}
                                animate={{ y: 0 }}
                                transition={{ delay: 1.5, type: 'spring' }}
                                style={{
                                    position: 'absolute', bottom: '24px', left: '24px', right: '24px',
                                    height: '52px', background: '#38bdf8', borderRadius: '16px',
                                    padding: '0 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                    boxShadow: '0 10px 25px -5px rgba(56, 189, 248, 0.4)'
                                }}
                            >
                                <div style={{ width: '20px', height: '20px', background: 'rgba(0,0,0,0.1)', borderRadius: '50%' }} />
                                <div style={{ width: '80px', height: '8px', background: 'rgba(0,0,0,0.4)', borderRadius: '4px' }} />
                                <div style={{ width: '24px', height: '24px', background: 'rgba(0,0,0,0.1)', borderRadius: '50%' }} />
                            </motion.div>
                        </div>
                    </div>
                </motion.div>
            </section>

            {/* How It Works */}
            <motion.section
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.2 }}
                transition={{ duration: 0.8 }}
                id="how-it-works"
                className="how-section"
            >
                <div className="section-header align-left">
                    <div className="hero-badge">
                        <Share2 size={14} />
                        <span>Workflow</span>
                    </div>
                    <h2 className="section-title">{t.how.title}</h2>
                    <p className="section-subtitle">{t.how.subtitle}</p>
                </div>

                <motion.div
                    className="how-steps"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: false, amount: 0.2 }}
                    variants={{
                        visible: { transition: { staggerChildren: 0.3, delayChildren: 0.2 } },
                        hidden: {}
                    }}
                >
                    <div className="how-step">
                        <motion.div
                            className="step-number"
                            variants={{
                                visible: { scale: 1, opacity: 1 },
                                hidden: { scale: 0, opacity: 0 }
                            }}
                            transition={{ type: "spring", stiffness: 260, damping: 20 }}
                        >1</motion.div>
                        <div className="step-card">
                            <h3 className="step-title">{t.how.step1}</h3>
                            <p className="step-desc">{t.how.step1Desc}</p>
                        </div>
                    </div>
                    <div className="how-step">
                        <motion.div
                            className="step-number"
                            variants={{
                                visible: { scale: 1, opacity: 1 },
                                hidden: { scale: 0, opacity: 0 }
                            }}
                            transition={{ type: "spring", stiffness: 260, damping: 20 }}
                        >2</motion.div>
                        <div className="step-card">
                            <h3 className="step-title">{t.how.step2}</h3>
                            <p className="step-desc">{t.how.step2Desc}</p>
                        </div>
                    </div>
                    <div className="how-step">
                        <motion.div
                            className="step-number"
                            variants={{
                                visible: { scale: 1, opacity: 1 },
                                hidden: { scale: 0, opacity: 0 }
                            }}
                            transition={{ type: "spring", stiffness: 260, damping: 20 }}
                        >3</motion.div>
                        <div className="step-card">
                            <h3 className="step-title">{t.how.step3}</h3>
                            <p className="step-desc">{t.how.step3Desc}</p>
                        </div>
                    </div>
                </motion.div>
            </motion.section>

            {/* Features */}
            <motion.section
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.2 }}
                transition={{ duration: 0.8 }}
                id="features"
                className="features-section"
            >
                <div className="section-header align-left">
                    <div className="hero-badge">
                        <Zap size={14} />
                        <span>Capabilities</span>
                    </div>
                    <h2 className="section-title">{t.features.title}</h2>
                    <p className="section-subtitle">{t.features.subtitle}</p>
                </div>

                <motion.div
                    className="features-grid"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: false, amount: 0.2 }}
                    variants={{
                        visible: { transition: { staggerChildren: 0.1 } },
                        hidden: {}
                    }}
                >
                    <FeatureCard
                        icon={<Zap size={24} />}
                        title={t.features.instantUpdates}
                        desc={t.features.instantUpdatesDesc}
                        variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                    />
                    <FeatureCard
                        icon={<Globe size={24} />}
                        title={t.features.multiLang}
                        desc={t.features.multiLangDesc}
                        variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                    />
                    <FeatureCard
                        icon={<LayoutTemplate size={24} />}
                        title={t.features.design}
                        desc={t.features.designDesc}
                        variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                    />
                    <FeatureCard
                        icon={<Smartphone size={24} />}
                        title={t.features.noApp}
                        desc={t.features.noAppDesc}
                        variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                    />
                    <FeatureCard
                        icon={<Coffee size={24} />}
                        title={t.features.waiters}
                        desc={t.features.waitersDesc}
                        variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                    />
                    <FeatureCard
                        icon={<CheckCircle size={24} />}
                        title={t.features.tracking}
                        desc={t.features.trackingDesc}
                        variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                    />
                </motion.div>
            </motion.section>

            {/* Testimonials */}
            <motion.section
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.2 }}
                transition={{ duration: 0.8 }}
                className="testimonials-section"
            >
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
                                <TestimonialCard
                                    quote={t.testimonials.t4}
                                    author={t.testimonials.a4}
                                    initials="D"
                                />
                                <TestimonialCard
                                    quote={t.testimonials.t5}
                                    author={t.testimonials.a5}
                                    initials="S"
                                />
                                <TestimonialCard
                                    quote={t.testimonials.t6}
                                    author={t.testimonials.a6}
                                    initials="M"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </motion.section>

            {/* Pricing Section */}
            {/* FAQ */}
            <motion.section
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.2 }}
                transition={{ duration: 0.8 }}
                id="faq"
                className="faq-section"
            >
                <div className="section-header align-left">
                    <h2 className="section-title">{t.faq.title}</h2>
                </div>
                <div className="faq-container">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="faq-item">
                            <button className="faq-question" onClick={() => toggleFaq(i)}>
                                {t.faq[`q${i}`]}
                                <motion.div
                                    animate={{ rotate: openFaq === i ? 180 : 0 }}
                                    transition={{ duration: 0.3, ease: "easeInOut" }}
                                    style={{ display: 'flex', alignItems: 'center' }}
                                >
                                    <ChevronDown />
                                </motion.div>
                            </button>
                            <AnimatePresence initial={false}>
                                {openFaq === i && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3, ease: "easeInOut" }}
                                        style={{ overflow: 'hidden' }}
                                    >
                                        <div className="faq-answer">
                                            {t.faq[`a${i}`]}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>
            </motion.section>

            {/* Contact Section */}
            <motion.section
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.2 }}
                transition={{ duration: 0.8 }}
                id="contact"
                className="contact-section"
            >
                <h2 className="section-title">{t.contact.title}</h2>
                <p className="section-subtitle">{t.contact.subtitle}</p>

                <div className="contact-container">
                    <form className="contact-form" onSubmit={(e) => e.preventDefault()}>
                        <div className="form-group">
                            <input type="text" className="contact-input" placeholder={t.contact.name} />
                        </div>
                        <div className="form-group">
                            <input type="email" className="contact-input" placeholder={t.contact.email} />
                        </div>
                        <div className="form-group">
                            <textarea className="contact-input" placeholder={t.contact.message} />
                        </div>
                        <button type="submit" className="landing-btn landing-btn-primary contact-submit-btn">
                            {t.contact.cta} <ArrowRight size={20} />
                        </button>
                    </form>
                </div>
            </motion.section>

            {/* Footer */}
            <footer className="landing-footer">
                {/* Decorative Elements */}
                <div style={{ position: 'absolute', top: '-100px', left: '-100px', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(56,189,248,0.1) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />
                <div style={{ position: 'absolute', bottom: '-100px', right: '-100px', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(14,165,233,0.1) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />

                <motion.div
                    animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                    style={{ position: 'absolute', top: '40px', left: '40px', opacity: 0.05, pointerEvents: 'none' }}
                >
                    <Utensils size={120} />
                </motion.div>

                <motion.div
                    animate={{ y: [0, 20, 0], rotate: [0, -5, 0] }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    style={{ position: 'absolute', bottom: '80px', right: '40px', opacity: 0.05, pointerEvents: 'none' }}
                >
                    <TrendingUp size={140} />
                </motion.div>
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
                            color: 'white',
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

const FeatureCard = ({ icon, title, desc, variants }) => (
    <motion.div className="feature-card" variants={variants}>
        <div className="feature-icon">{icon}</div>
        <h3 className="feature-title">{title}</h3>
        <p className="feature-desc">{desc}</p>
    </motion.div>
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
