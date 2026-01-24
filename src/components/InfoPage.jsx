import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, MapPin, Instagram, Globe } from 'lucide-react';
import { usePlatform } from '../contexts/MenuContext';
import { useTheme } from '../hooks/useTheme';

const InfoPage = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const { getRestaurantBySlug, loading } = usePlatform();
    const restaurant = getRestaurantBySlug(slug);

    // Language State (Read from local storage to match app state)
    const [language] = useState(() => {
        return localStorage.getItem('qarta_lang') || 'en';
    });

    // Translations
    const t = {
        info: { en: 'Info', mk: 'Инфо', sq: 'Info' },
        hours: { en: 'Working Hours', mk: 'Работно Време', sq: 'Orari i Punës' },
        location: { en: 'Location', mk: 'Локација', sq: 'Vendndodhja' },
        contact: { en: 'Contact', mk: 'Контакт', sq: 'Kontakt' },
        directions: { en: 'Get Directions', mk: 'Насоки', sq: 'Merr Drejtimet' },
        noHours: { en: 'Hours not specified', mk: 'Времето не е наведено', sq: 'Orari mungon' },
        noLocation: { en: 'Location not specified', mk: 'Локацијата не е наведена', sq: 'Vendndodhja mungon' },
        notAvailable: { en: 'Not available', mk: 'Не е достапно', sq: 'Jo në dispozicion' },
        share: { en: 'Share', mk: 'Сподели', sq: 'Shpërnda' },
        locationCopied: { en: 'Address copied!', mk: 'Адресата е копирана!', sq: 'Adresa u kopjua!' }
    };

    // Theme Logic (similar to ClientApp)
    const [isDark, setIsDark] = useState(() => {
        const saved = localStorage.getItem('qarta_theme');
        return saved ? JSON.parse(saved) : true;
    });

    useEffect(() => {
        if (restaurant?.theme?.defaultMode) {
            const saved = localStorage.getItem('qarta_theme');
            if (saved === null) {
                setIsDark(restaurant.theme.defaultMode === 'dark');
            }
        }
    }, [restaurant]);

    // Apply Theme
    useTheme(restaurant, isDark);


    if (loading) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>;
    if (!restaurant) return <div>Restaurant not found</div>;

    const info = restaurant.info || {};

    return (
        <div style={{
            minHeight: '100vh',
            maxWidth: '480px',
            margin: '0 auto',
            background: 'var(--bg-app)',
            color: 'var(--color-ink)',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column'
        }}>
            {/* Header */}
            <div style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                <motion.button
                    whileTap={{ scale: 0.96 }}
                    whileHover={{ scale: 1.04 }}
                    onClick={() => navigate(`/${slug}`)}
                    style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        border: '1px solid var(--border-color)',
                        background: 'var(--bg-header-control)',
                        color: 'var(--color-header-icon)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                    }}
                >
                    <ArrowLeft size={20} />
                </motion.button>
                <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-ink)' }}>{t.info[language]}</div>
            </div>

            {/* Content */}
            <div style={{ padding: '24px 24px 40px 24px', display: 'flex', flexDirection: 'column', gap: '32px' }}>

                {/* Restaurant Identity */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '20px', padding: '0 0 24px 0', borderBottom: '1px solid var(--border-color)' }}>
                    {restaurant.logo && (
                        <div style={{
                            width: '80px',
                            height: '80px',
                            flexShrink: 0
                        }}>
                            <img
                                src={restaurant.logo}
                                alt="Logo"
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'contain', // No cropping
                                    filter: 'var(--logo-filter, none)',
                                    transition: 'filter 0.3s'
                                }}
                            />
                        </div>
                    )}

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
                        <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 800, lineHeight: 1.2, color: 'var(--color-ink)' }}>{restaurant.name}</h1>

                        {info.subtitle && (
                            <p style={{ margin: 0, color: 'var(--color-text-subtle)', fontSize: '15px', fontWeight: 500 }}>
                                {info.subtitle}
                            </p>
                        )}


                    </div>
                </div>

                {/* Working Hours */}
                <Section title={t.hours[language]} icon={Clock}>
                    {info.hours ? (
                        <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>{info.hours}</div>
                    ) : (
                        <div style={{ color: 'var(--color-text-subtle)', fontStyle: 'italic' }}>{t.noHours[language]}</div>
                    )}
                </Section>

                {/* Location */}
                <Section title={t.location[language]} icon={MapPin}>
                    {info.address ? (
                        <div>
                            <div style={{ marginBottom: '28px', lineHeight: '1.5', color: 'var(--color-ink)', fontWeight: 500 }}>{info.address}</div>

                            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginTop: '12px' }}>
                                {/* Google Maps Link */}
                                <a
                                    href={info.address.startsWith('http') ? info.address : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(info.address)}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '6px',
                                        color: 'var(--color-primary)',
                                        fontWeight: 600,
                                        textDecoration: 'none',
                                        fontSize: '14px',
                                        background: 'color-mix(in srgb, var(--color-primary), transparent 90%)',
                                        padding: '8px 12px',
                                        borderRadius: '8px'
                                    }}
                                >
                                    <MapPin size={16} />
                                    {t.directions[language]}
                                </a>

                                {/* Share Location Button */}
                                <button
                                    onClick={() => {
                                        if (navigator.share) {
                                            navigator.share({
                                                title: restaurant.name,
                                                text: `Check out ${restaurant.name} at ${info.address}`,
                                                url: info.address.startsWith('http') ? info.address : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(info.address)}`
                                            }).catch(console.error);
                                        } else {
                                            // Fallback: Copy to clipboard
                                            navigator.clipboard.writeText(`${restaurant.name} - ${info.address}`);
                                            alert(t.locationCopied?.[language] || "Address copied to clipboard!");
                                        }
                                    }}
                                    style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '6px',
                                        color: 'var(--color-ink)',
                                        fontWeight: 600,
                                        fontSize: '14px',
                                        background: 'var(--bg-header-control)',
                                        padding: '8px 12px',
                                        borderRadius: '8px',
                                        border: '1px solid var(--border-color)',
                                        cursor: 'pointer'
                                    }}
                                >
                                    {/* Share Icon */}
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <circle cx="18" cy="5" r="3"></circle>
                                        <circle cx="6" cy="12" r="3"></circle>
                                        <circle cx="18" cy="19" r="3"></circle>
                                        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                                        <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                                    </svg>
                                    {t.share?.[language] || "Share"}
                                </button>
                            </div>

                            {/* Hidden logic to remove old link if needed, but we replaced the container */}
                        </div>
                    ) : (
                        <div style={{ color: 'var(--color-text-subtle)', fontStyle: 'italic' }}>{t.noLocation[language]}</div>
                    )}
                </Section>


                {/* Social Media Cards */}
                {(info.socials?.instagram || info.socials?.tiktok || info.socials?.website) && (
                    <div style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '16px',
                        marginTop: '8px'
                    }}>
                        {info.socials.instagram && (
                            <SocialCard
                                href={`https://instagram.com/${info.socials.instagram.replace('@', '')}`}
                                icon={Instagram}
                                label="Instagram"
                            />
                        )}
                        {info.socials.tiktok && (
                            <SocialCard
                                href={`https://tiktok.com/@${info.socials.tiktok.replace('@', '')}`}
                                icon={({ size, color }) => (
                                    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
                                    </svg>
                                )}
                                label="TikTok"
                            />
                        )}
                        {info.socials.website && (
                            <SocialCard
                                href={info.socials.website.startsWith('http') ? info.socials.website : `https://${info.socials.website}`}
                                icon={Globe}
                                label="Website"
                            />
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

const Section = ({ title, icon: Icon, children }) => (
    <div style={{
        padding: '20px',
        backgroundColor: 'var(--bg-surface)',
        borderRadius: '20px'
    }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', color: 'var(--color-primary)' }}>
            <Icon size={20} />
            <span style={{ fontWeight: 700, fontSize: '16px', color: 'var(--color-ink)' }}>{title}</span>
        </div>
        <div style={{ fontSize: '15px', color: 'var(--color-text-subtle)' }}>
            {children}
        </div>
    </div>
);

const SocialCard = ({ href, icon: Icon, label }) => {
    return (
        <a
            href={href}
            target="_blank"
            rel="noreferrer"
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textDecoration: 'none',
                padding: '16px',
                backgroundColor: 'var(--bg-surface)',
                borderRadius: '24px',
                border: '1px solid var(--border-color)',
                transition: 'transform 0.2s',
                width: '100px',
                height: '100px',
                color: 'var(--color-ink)'
            }}
            onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.1)';
            }}
            onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.05)';
            }}
        >
            <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '32px', // "Inner is bigger" rule
                background: 'color-mix(in srgb, var(--color-primary), transparent 90%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '12px',
                color: 'var(--color-primary)',
                flexShrink: 0 // Prevent oval distortion
            }}>
                <Icon size={28} color="var(--color-primary)" />
            </div>
            <div style={{ fontWeight: 700, fontSize: '13px', marginBottom: '2px' }}>
                {label}
            </div>
        </a>
    );
};

export default InfoPage;
