import React from 'react';
import { motion } from 'framer-motion';
import { Search, X } from 'lucide-react';

const SearchBar = ({ value, onChange, onClear, language, bottomOffset = 24 }) => {
    const t = {
        placeholder: {
            en: 'Search menu...',
            mk: 'Пребарај мени...',
            sq: 'Kërko në meny...'
        }
    };

    return (
        <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            style={{
                position: 'fixed',
                bottom: `calc(${bottomOffset}px + env(safe-area-inset-bottom, 0px))`,
                left: 0,
                right: 0,
                margin: '0 auto',
                width: 'calc(100% - 48px)',
                maxWidth: '432px',
                zIndex: 97, // Above backdrop (93)
                transition: 'bottom 0.3s ease'
            }}
        >
            <div style={{
                backgroundColor: 'var(--bg-surface)',
                borderRadius: '100px',
                padding: '16px 24px', // Taller touch target
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                border: '1px solid var(--border-color)',
                backdropFilter: 'blur(10px)'
            }}>
                <Search
                    size={20}
                    style={{
                        color: 'var(--color-text-subtle)',
                        flexShrink: 0
                    }}
                />
                <input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={t.placeholder[language] || t.placeholder.en}
                    style={{
                        flex: 1,
                        border: 'none',
                        background: 'transparent',
                        outline: 'none',
                        fontSize: '15px',
                        color: 'var(--color-ink)',
                        fontFamily: 'var(--font-sans)'
                    }}
                />
                {value && (
                    <motion.button
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={onClear}
                        style={{
                            background: 'var(--bg-surface-secondary)',
                            border: 'none',
                            borderRadius: '50%',
                            width: '28px',
                            height: '28px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            color: 'var(--color-text-subtle)',
                            flexShrink: 0
                        }}
                    >
                        <X size={16} />
                    </motion.button>
                )}
            </div>
        </motion.div>
    );
};

export default SearchBar;
