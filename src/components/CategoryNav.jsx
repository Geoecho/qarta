import React from 'react';
import { motion } from 'framer-motion';
import { getSmartIcon, Utensils } from '../utils/iconMatcher';

const CategoryNav = ({ categories, activeCategory, onSelect, language }) => {
    return (
        <div style={{
            position: 'sticky',
            top: 0,
            zIndex: 91, // Below search backdrop (93)
            backgroundColor: 'var(--bg-app)',
            paddingBottom: '8px',
            paddingTop: '12px',
            transition: 'background-color 0.3s ease'
        }}>
            <div style={{
                overflowX: 'auto',
                display: 'flex',
                gap: '12px',
                padding: '16px 24px',
                paddingBottom: '32px', // Increased to avoid bottom shadow clip
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
            }}>
                {categories.map((cat) => {
                    // Smart Icon Resolution: Automatically match icon based on name/ID
                    const IconComponent = getSmartIcon(cat.id) || getSmartIcon(cat.label?.en) || Utensils;

                    const isActive = activeCategory === cat.id;

                    return (
                        <motion.button
                            key={cat.id}
                            onClick={() => onSelect(cat.id)}
                            whileTap="tap"
                            initial="idle"
                            animate="idle"
                            style={{
                                height: '52px',
                                padding: '4px 20px 4px 6px',
                                borderRadius: '100px',
                                border: isActive ? 'none' : '1px solid var(--border-color)',
                                backgroundColor: isActive ? 'var(--color-primary)' : 'var(--bg-surface)',
                                color: isActive ? 'var(--color-on-primary)' : 'var(--color-text-subtle)',
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                                gap: '12px',
                                cursor: 'pointer',
                                flexShrink: 0,
                                transition: 'all 0.3s',
                                boxShadow: isActive ? 'var(--shadow-md)' : 'none',
                                whiteSpace: 'nowrap'
                            }}
                        >
                            <motion.div
                                variants={{
                                    idle: { rotate: 0 },
                                    tap: {
                                        rotate: [0, -25, 25, -15, 15, -5, 5, 0],
                                        transition: { duration: 0.5, ease: "easeInOut" }
                                    }
                                }}
                                style={{
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '50%',
                                    background: isActive ? 'rgba(255,255,255,0.2)' : 'var(--bg-surface-secondary)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: isActive ? 'currentColor' : 'var(--color-ink)'
                                }}>
                                <IconComponent size={18} strokeWidth={2.5} />
                            </motion.div>

                            <span style={{
                                fontSize: '14px',
                                fontWeight: 600,
                                letterSpacing: '0.01em',
                                textTransform: 'capitalize'
                            }}>
                                {cat.label[language] || cat.label['en']}
                            </span>
                        </motion.button>
                    );
                })}
            </div>
        </div >
    );
};

export default CategoryNav;
