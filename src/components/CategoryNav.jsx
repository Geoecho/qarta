import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getSmartIcon, Utensils } from '../utils/iconMatcher';

const CategoryNav = ({ categories, activeCategory, onSelect, language }) => {
    const scrollContainerRef = useRef(null);

    // Scroll active category into view
    useEffect(() => {
        if (activeCategory && scrollContainerRef.current) {
            const activeEl = document.getElementById(`cat-btn-${activeCategory}`);
            if (activeEl) {
                activeEl.scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest',
                    inline: 'center'
                });
            }
        }
    }, [activeCategory]);

    return (
        <div style={{
            width: '100%',
            overflow: 'hidden',
            paddingBottom: '4px' // Reduced space for shadow to bring items closer
        }}>
            <div
                ref={scrollContainerRef}
                style={{
                    overflowX: 'auto',
                    overflowY: 'hidden',
                    display: 'flex',
                    gap: '16px',
                    padding: '15px 24px 8px 24px', // Reduced top padding for tighter fit
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none',
                    alignItems: 'center',
                    scrollBehavior: 'smooth'
                }}
            >
                {categories.map((cat) => {
                    const IconComponent = getSmartIcon(cat.id) || getSmartIcon(cat.label?.en) || Utensils;
                    const isActive = activeCategory === cat.id;

                    return (
                        <motion.button
                            id={`cat-btn-${cat.id}`}
                            key={cat.id}
                            onClick={() => onSelect(cat.id)}
                            whileTap={{ scale: 0.95 }}
                            animate={{
                                opacity: isActive ? 1 : 0.7, // Subtle opacity for inactive
                                scale: isActive ? 1.05 : 1
                            }}
                            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'flex-start',
                                gap: '12px', // Increased gap between image and text
                                padding: '0', // No padding on container
                                borderRadius: '0',
                                width: '88px', // Slightly narrower for cleaner look
                                border: 'none',
                                cursor: 'pointer',
                                flexShrink: 0,
                                position: 'relative',
                                overflow: 'visible', // Allow shadow overflow if any
                                backgroundColor: 'transparent', // Transparent background
                                color: isActive ? 'var(--color-ink)' : 'var(--color-text-subtle)', // Text color change
                            }}
                        >
                            {/* Image / Icon Container */}
                            <div
                                style={{
                                    width: '100%',
                                    aspectRatio: '1/1', // Force perfect square
                                    borderRadius: '20px', // Squircle matching Search Bar
                                    overflow: 'hidden',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    background: cat.bgColor ? cat.bgColor : 'var(--bg-surface-secondary)', // Always light background
                                    border: isActive ? '2px solid var(--color-item-price)' : 'none', // Remove stroke when disabled
                                    boxShadow: isActive ? '0 4px 12px rgba(0,0,0,0.1)' : 'none',
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                {cat.image ? (
                                    <img
                                        src={cat.image}
                                        alt=""
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                ) : (
                                    <IconComponent size={32} color={isActive ? 'var(--color-item-price)' : 'var(--color-text-subtle)'} />
                                )}
                            </div>

                            {/* Label */}
                            <div style={{
                                width: '100%', // Full width
                                marginTop: '4px',
                                textAlign: 'center',
                                minHeight: '34px',
                                display: 'flex',
                                alignItems: 'flex-start',
                                justifyContent: 'center',
                            }}>
                                <span style={{
                                    fontSize: '13px', // Larger, cleaner text
                                    fontWeight: isActive ? 700 : 500,
                                    lineHeight: '1.2',
                                    color: 'inherit',
                                    display: '-webkit-box',
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: 'vertical',
                                    overflow: 'hidden'
                                }}>
                                    {cat.label[language] || cat.label['en']}
                                </span>
                            </div>
                        </motion.button>
                    );
                })}
            </div>
        </div >
    );
};

export default CategoryNav;
