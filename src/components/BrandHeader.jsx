import React from 'react';
import { Sun, Moon } from 'lucide-react';

const BrandHeader = ({ isDark, toggleTheme, language, setLanguage, logoUrl }) => {
    return (
        <div style={{
            padding: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'var(--bg-app)',
            zIndex: 100
        }}>
            {/* Logo */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '12px',
                    backgroundColor: 'var(--color-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--color-on-primary)',
                    overflow: 'hidden'
                }}>
                    <img
                        src={logoUrl || "/logo.png"}
                        alt="Logo"
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'contain',
                            // Invert logo color only if it's the default black logo and we are in dark mode
                            // If user uploaded a custom logo, we probably shouldn't blindly invert it, 
                            // BUT consistent behavior was requested. I'll keep the invert for now as a "feature"
                            filter: isDark ? 'invert(1)' : 'none',
                            transition: 'filter 0.3s'
                        }}
                    />
                </div>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
                {/* Language Toggle */}
                <div style={{
                    display: 'flex',
                    background: 'var(--bg-surface-secondary)',
                    borderRadius: '10px',
                    padding: '3px',
                    border: '1px solid var(--border-color)'
                }}>
                    <button
                        onClick={() => setLanguage('mk')}
                        style={{
                            border: 'none',
                            background: language === 'mk' ? 'var(--bg-surface)' : 'transparent',
                            color: language === 'mk' ? 'var(--color-ink)' : 'var(--color-text-subtle)',
                            boxShadow: language === 'mk' ? 'var(--shadow-sm)' : 'none',
                            fontSize: '12px',
                            fontWeight: 700,
                            padding: '6px 10px',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                        }}
                    >
                        MK
                    </button>
                    <button
                        onClick={() => setLanguage('en')}
                        style={{
                            border: 'none',
                            background: language === 'en' ? 'var(--bg-surface)' : 'transparent',
                            color: language === 'en' ? 'var(--color-ink)' : 'var(--color-text-subtle)',
                            boxShadow: language === 'en' ? 'var(--shadow-sm)' : 'none',
                            fontSize: '12px',
                            fontWeight: 700,
                            padding: '6px 10px',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                        }}
                    >
                        EN
                    </button>
                    <button
                        onClick={() => setLanguage('sq')}
                        style={{
                            border: 'none',
                            background: language === 'sq' ? 'var(--bg-surface)' : 'transparent',
                            color: language === 'sq' ? 'var(--color-ink)' : 'var(--color-text-subtle)',
                            boxShadow: language === 'sq' ? 'var(--shadow-sm)' : 'none',
                            fontSize: '12px',
                            fontWeight: 700,
                            padding: '6px 10px',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                        }}
                    >
                        AL
                    </button>
                </div>

                {/* Theme Toggle */}
                <button
                    onClick={toggleTheme}
                    style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '12px',
                        border: '1px solid var(--border-color)',
                        background: 'var(--bg-surface-secondary)',
                        color: 'var(--color-ink)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer'
                    }}
                >
                    {isDark ? <Sun size={20} /> : <Moon size={20} />}
                </button>
            </div>
        </div>
    );
};

export default BrandHeader;
