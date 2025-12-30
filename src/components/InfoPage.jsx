import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePlatform } from '../contexts/MenuContext';
import { ArrowLeft, Clock, MapPin, Phone, Instagram, Globe } from 'lucide-react';
import { motion } from 'framer-motion';

const InfoPage = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const { getRestaurantBySlug, loading } = usePlatform();
    const restaurant = getRestaurantBySlug(slug);

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
    useEffect(() => {
        const root = document.documentElement;
        const theme = restaurant?.theme || {};

        // Always apply Brand Primary Color
        // Priority: Dark Primary (if dark mode) > Global Primary > Default
        const effectivePrimary = (isDark && theme.darkPrimary) ? theme.darkPrimary : theme.primary;
        if (effectivePrimary) {
            root.style.setProperty('--color-primary', effectivePrimary);
        } else {
            root.style.removeProperty('--color-primary');
        }

        const themeMeta = document.querySelector('meta[name="theme-color"]');

        if (isDark) {
            root.classList.add('dark');

            // Apply Dark Mode Custom Theme
            const darkVars = {
                '--bg-app': theme.darkBackground || '#121212',
                '--bg-surface': theme.darkSurface || '#1E1E1E',
                '--color-ink': theme.darkText || '#FFFFFF',
                '--color-text-subtle': theme.darkTextMuted || '#A1A1AA',
                '--border-color': theme.darkBorder || '#27272a',
                '--overlay-bg': theme.darkOverlay || 'rgba(0,0,0,0.8)'
            };

            Object.entries(darkVars).forEach(([key, val]) => {
                root.style.setProperty(key, val);
            });
            if (themeMeta) themeMeta.content = darkVars['--bg-app'];
            document.body.style.backgroundColor = darkVars['--bg-app'];

        } else {
            root.classList.remove('dark');

            // Apply Light Mode Custom Theme
            const lightVars = {
                '--bg-app': theme.background || '#F5F5F7',
                '--bg-surface': theme.surface || '#FFFFFF',
                '--color-ink': theme.text || '#000000',
                '--color-text-subtle': theme.textMuted || '#666666',
                '--border-color': theme.border || '#e5e7eb',
                '--overlay-bg': theme.overlay || 'rgba(0,0,0,0.5)'
            };

            Object.entries(lightVars).forEach(([key, val]) => {
                root.style.setProperty(key, val);
            });
            if (themeMeta) themeMeta.content = lightVars['--bg-app'];
            document.body.style.backgroundColor = lightVars['--bg-app'];
        }

        return () => {
            root.style.removeProperty('--color-primary');
            // We don't remove every var for perf, but rely on next effect to overwrite or class removal
            ['--bg-app', '--bg-surface', '--color-ink', '--color-text-subtle', '--border-color', '--overlay-bg'].forEach(p => root.style.removeProperty(p));
            document.body.style.removeProperty('background-color');
        };
    }, [isDark, restaurant]);


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
                <button
                    onClick={() => navigate(`/${slug}`)}
                    style={{
                        background: 'var(--bg-surface-secondary)',
                        border: 'none',
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--color-ink)',
                        cursor: 'pointer'
                    }}
                >
                    <ArrowLeft size={20} />
                </button>
                <div style={{ fontSize: '18px', fontWeight: 700 }}>Information</div>
            </div>

            {/* Content */}
            <div style={{ padding: '0 24px 40px 24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>

                {/* Restaurant Identity */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '24px 0', borderBottom: '1px solid var(--border-color)' }}>
                    {restaurant.logo && (
                        <img src={restaurant.logo} alt="Logo" style={{ width: '80px', height: '80px', borderRadius: '20px', marginBottom: '16px', objectFit: 'cover' }} />
                    )}
                    <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 800 }}>{restaurant.name}</h1>
                    <p style={{ margin: '4px 0 0 0', color: 'var(--color-text-subtle)', fontSize: '14px' }}>@{restaurant.slug}</p>
                </div>

                {/* Working Hours */}
                <Section title="Working Hours" icon={Clock}>
                    {info.hours ? (
                        <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>{info.hours}</div>
                    ) : (
                        <div style={{ color: 'var(--color-text-subtle)', fontStyle: 'italic' }}>Hours not specified</div>
                    )}
                </Section>

                {/* Location */}
                <Section title="Location" icon={MapPin}>
                    {info.address ? (
                        <div>
                            <div style={{ marginBottom: '8px' }}>{info.address}</div>
                            {/* Check if address looks like a URL or provide a google maps search link */}
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
                                    fontSize: '14px'
                                }}
                            >
                                Get Directions →
                            </a>
                        </div>
                    ) : (
                        <div style={{ color: 'var(--color-text-subtle)', fontStyle: 'italic' }}>Location not specified</div>
                    )}
                </Section>

                {/* Contact */}
                <Section title="Contact" icon={Phone}>
                    {info.phone ? (
                        <a href={`tel:${info.phone}`} style={{ color: 'inherit', textDecoration: 'none', fontWeight: 600 }}>
                            {info.phone}
                        </a>
                    ) : (
                        <div style={{ color: 'var(--color-text-subtle)', fontStyle: 'italic' }}>Not available</div>
                    )}
                </Section>

            </div>
        </div>
    );
};

const Section = ({ title, icon: Icon, children }) => (
    <div style={{
        padding: '20px',
        backgroundColor: 'var(--bg-surface)',
        borderRadius: '20px',
        boxShadow: 'var(--shadow-sm)'
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

export default InfoPage;
