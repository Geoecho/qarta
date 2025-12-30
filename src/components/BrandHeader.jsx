import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon, Info } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

const BrandHeader = ({ isDark, toggleTheme, language, setLanguage, logoUrl }) => {
    const navigate = useNavigate();
    const { slug } = useParams();

    return (
        <div style={{
            padding: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'var(--bg-app)',
            zIndex: 92 // Below search backdrop (93)
        }}>
            {/* Logo */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                    height: '32px', // Matches approx height of language toggle
                    display: 'flex',
                    alignItems: 'center',
                }}>
                    <img
                        src={logoUrl || "/logo.png"}
                        alt="Logo"
                        style={{
                            height: '100%',
                            width: 'auto',
                            objectFit: 'contain',
                            transition: 'filter 0.3s'
                        }}
                    />
                </div>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
                {/* Info Button */}
                <motion.button
                    whileTap={{ scale: 0.9 }}
                    whileHover={{ scale: 1.05 }}
                    onClick={() => navigate(`/${slug}/info`)}
                    style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%', // Circle
                        border: '1px solid var(--border-color)',
                        background: 'var(--bg-header-control)',
                        color: 'var(--color-header-icon)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer'
                    }}
                >
                    <Info size={20} />
                </motion.button>

                {/* Language Toggle (Segmented with Liquid Animation) */}
                <div style={{
                    display: 'flex',
                    background: 'var(--bg-header-control)',
                    borderRadius: '100px', // Pill
                    padding: '4px',
                    border: '1px solid var(--border-color)',
                    position: 'relative'
                }}>
                    {['mk', 'en', 'sq'].map((lang) => (
                        <button
                            key={lang}
                            onClick={() => setLanguage(lang)}
                            style={{
                                border: 'none',
                                background: 'transparent',
                                color: language === lang ? 'var(--color-header-icon)' : 'var(--color-text-subtle)',
                                fontSize: '12px',
                                fontWeight: 700,
                                padding: '6px 12px',
                                borderRadius: '100px',
                                cursor: 'pointer',
                                position: 'relative',
                                zIndex: 2,
                                transition: 'color 0.2s',
                                textTransform: 'uppercase'
                            }}
                        >
                            {language === lang && (
                                <motion.div
                                    layoutId="language-pill"
                                    style={{
                                        position: 'absolute',
                                        inset: 0,
                                        backgroundColor: 'var(--bg-surface)', // Active pill remains surface color for contrast
                                        borderRadius: '100px',
                                        boxShadow: 'var(--shadow-sm)',
                                        zIndex: -1
                                    }}
                                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                />
                            )}
                            {lang.toUpperCase()}
                        </button>
                    ))}
                </div>

                {/* Theme Toggle */}
                <motion.button
                    whileTap={{ scale: 0.9 }}
                    whileHover={{ scale: 1.05 }}
                    onClick={toggleTheme}
                    style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%', // Circle
                        border: '1px solid var(--border-color)',
                        background: 'var(--bg-header-control)',
                        color: 'var(--color-header-icon)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer'
                    }}
                >
                    {isDark ? <Sun size={20} /> : <Moon size={20} />}
                </motion.button>
            </div>
        </div>
    );
};

export default BrandHeader;
