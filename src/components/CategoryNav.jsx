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
            paddingBottom: '16px' // Increased space for shadow
        }}>
            <div
                ref={scrollContainerRef}
                style={{
                    overflowX: 'auto',
                    overflowY: 'hidden',
                    display: 'flex',
                    gap: '16px',
                    padding: '12px 24px',
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
                                scale: isActive ? 1.05 : 1
                            }}
                            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'flex-start',
                                gap: '8px',
                                padding: '6px',
                                borderRadius: '24px',
                                width: '124px',
                                height: 'auto', // Allow height to fit square image + text
                                minHeight: '170px', // Uniform height
                                border: isActive ? 'none' : '1px solid var(--border-color)',
                                cursor: 'pointer',
                                flexShrink: 0,
                                position: 'relative',
                                overflow: 'hidden',
                                transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
                                backgroundColor: isActive ? 'var(--color-item-price)' : 'var(--bg-header-control)', // Use dynamic price color
                                color: isActive ? '#ffffff' : 'var(--color-text-subtle)',
                                boxShadow: isActive ? '0 2px 8px rgba(0,0,0,0.05)' : 'none'
                            }}
                        >


                            {/* Image / Icon Container */}
                            <div
                                style={{
                                    width: '100%',
                                    aspectRatio: '1/1', // Force perfect square
                                    borderRadius: '18px', // Reduced from 32px
                                    overflow: 'hidden',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    background: cat.bgColor ? cat.bgColor : (isActive ? 'rgba(255,255,255,0.2)' : 'var(--category-bg, rgba(0,0,0,0.03))'),
                                    zIndex: 1,
                                    position: 'relative',
                                    flexShrink: 0
                                }}
                            >
                                {cat.image ? (
                                    <img
                                        src={cat.image}
                                        alt=""
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                ) : (
                                    <IconComponent size={32} />
                                )}
                            </div>

                            {/* Label */}
                            {/* Label */}
                            <div style={{
                                width: '100%',
                                zIndex: 1,
                                color: 'inherit',
                                flex: 1, // Fill remaining space if any
                                minHeight: '34px',
                                display: 'flex',
                                alignItems: 'center', // Center vertically in space
                                justifyContent: 'center',
                                paddingBottom: '4px',
                                overflow: 'hidden'
                            }}>
                                <span style={{
                                    fontSize: '11px',
                                    fontWeight: isActive ? 600 : 500, // Reduced heavy bold
                                    textAlign: 'center',
                                    lineHeight: '1.2',
                                    display: '-webkit-box',
                                    WebkitLineClamp: 3,
                                    WebkitBoxOrient: 'vertical',
                                    overflow: 'hidden',
                                    wordBreak: 'break-word',
                                    width: '100%'
                                }}>
                                    {cat.label[language] || cat.label['en']}
                                </span>
                            </div>
                        </motion.button>
                    );
                })}
            </div>
        </div>
    );
};

export default CategoryNav;
