import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { formatPrice } from '../utils/currencyHelper';
import { Sparkles, ArrowRight } from 'lucide-react';

const DealsCarousel = ({ deals, language, onDealClick, isDark }) => {
    // Safety check
    if (!deals || !deals.enabled || !deals.items || deals.items.length === 0) return null;

    const carouselRef = useRef(null);
    const [width, setWidth] = useState(0);

    return (
        <div style={{
            marginBottom: '12px',
            position: 'relative',
            zIndex: 5
        }}>
            {/* Header */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 24px',
                marginBottom: '0px'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Sparkles size={18} style={{ color: 'var(--color-item-price)' }} fill="currentColor" />
                    <h2 style={{
                        margin: 0,
                        fontSize: '18px',
                        fontWeight: 700,
                        color: 'var(--color-ink)',
                        letterSpacing: '-0.5px'
                    }}>
                        {language === 'mk' ? 'Понуди' : (language === 'sq' ? 'Ofertat' : "Deals")}
                    </h2>
                </div>
            </div>

            {/* Carousel Container */}
            <div
                ref={carouselRef}
                style={{
                    display: 'flex',
                    gap: '16px',
                    overflowX: 'auto',
                    padding: '15px 24px 24px 24px', // Exactly 15px top padding for the gap
                    scrollSnapType: 'x mandatory',
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none',
                    WebkitOverflowScrolling: 'touch'
                }}
            >
                {deals.items.map((deal, index) => (
                    <motion.div
                        key={deal.id || index}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        onClick={() => {
                            if (onDealClick) {
                                // Extract strings for transition if they are objects
                                const titleStr = typeof deal.title === 'object' ? (deal.title[language] || deal.title['en'] || '') : deal.title;
                                const descStr = typeof deal.description === 'object' ? (deal.description[language] || deal.description['en'] || '') : deal.description;

                                // Map deal structure to item structure expecting localized objects
                                onDealClick({
                                    ...deal,
                                    name: typeof deal.title === 'object' ? deal.title : { en: deal.title, mk: deal.title, sq: deal.title },
                                    description: typeof deal.description === 'object' ? deal.description : { en: deal.description, mk: deal.description, sq: deal.description }
                                });
                            }
                        }}
                        style={{
                            minWidth: '85%', // Show next card peeking
                            maxWidth: '320px',
                            height: '200px', // Increased height
                            borderRadius: '24px',
                            position: 'relative',
                            overflow: 'hidden',
                            scrollSnapAlign: 'center',
                            cursor: 'pointer',
                            backgroundColor: 'transparent',
                            border: 'none'
                        }}
                    >
                        {/* Background Image */}
                        {deal.image && (
                            <div style={{
                                position: 'absolute',
                                inset: 0,
                                backgroundImage: `url(${deal.image})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                transition: 'transform 0.5s ease',
                            }} className="deal-bg" />
                        )}

                        {/* Robust Dark/Light Gradient Overlay for Guaranteed Readability */}
                        <div style={{
                            position: 'absolute',
                            inset: 0,
                            background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.3) 50%, transparent 100%)',
                            zIndex: 1
                        }} />

                        {/* Content */}
                        <div style={{
                            position: 'absolute',
                            inset: 0,
                            padding: '20px',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'flex-start',
                            color: 'white',
                            maxWidth: '85%',
                            zIndex: 2 // Explicitly above gradient (which has zIndex 1)
                        }}>
                            {/* Tag */}
                            <div style={{
                                padding: '4px 10px',
                                backgroundColor: 'var(--color-item-price)',
                                borderRadius: '100px',
                                fontSize: '10px',
                                fontWeight: 700,
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em',
                                marginBottom: '12px',
                                color: 'white',
                                boxShadow: '0 4px 10px rgba(0,0,0,0.2)'
                            }}>
                                {deal.tag || 'Special'}
                            </div>

                            <h3 style={{
                                margin: '0 0 4px 0',
                                fontSize: '22px', // Larger for hierarchy
                                fontWeight: 700, // Reduced from 900
                                lineHeight: 1.1,
                                color: 'white', // Explicit white
                                textShadow: '0 2px 4px rgba(0,0,0,0.5)'
                            }}>
                                {typeof deal.title === 'object' ? (deal.title[language] || deal.title['en']) : deal.title}
                            </h3>

                            <p style={{
                                margin: '0 0 12px 0',
                                fontSize: '13px', // Slightly larger
                                fontWeight: 500,
                                opacity: 0.9, // Consistent opacity
                                lineHeight: 1.4,
                                display: '-webkit-box',
                                WebkitLineClamp: 2, // Reduced to 2 lines
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                                textShadow: '0 1px 2px rgba(0,0,0,0.5)'
                            }}>
                                {typeof deal.description === 'object' ? (deal.description[language] || deal.description['en']) : deal.description}
                            </p>

                            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                                <span style={{
                                    fontSize: '18px', // Slightly larger
                                    fontWeight: 800, // Reduced from 900 for better balance
                                    color: 'white',
                                    textShadow: '0 1px 3px rgba(0,0,0,0.5)'
                                }}>
                                    {formatPrice(deal.price, language === 'mk' ? 'MKD' : 'EUR')}
                                </span>
                                {deal.originalPrice > deal.price && (
                                    <span style={{
                                        fontSize: '13px', // Slightly larger
                                        textDecoration: 'line-through',
                                        color: 'white',
                                        opacity: 0.6,
                                        textShadow: '0 1px 2px rgba(0,0,0,0.5)'
                                    }}>
                                        {formatPrice(deal.originalPrice, language === 'mk' ? 'MKD' : 'EUR')}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Action Icon - Squircle to match "open" style */}
                        <div style={{
                            position: 'absolute',
                            bottom: '16px',
                            right: '16px',
                            width: '36px',
                            height: '36px',
                            borderRadius: '50%', // Full circle as requested
                            backgroundColor: 'var(--color-item-price)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            zIndex: 10
                        }}>
                            <ArrowRight size={20} />
                        </div>

                    </motion.div>
                ))
                }

                {/* Spacer for last item padding */}
                <div style={{ minWidth: '8px' }}></div>
            </div >
        </div >
    );
};

export default DealsCarousel;
