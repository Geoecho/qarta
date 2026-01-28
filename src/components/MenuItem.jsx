import React from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { useOrder } from '../contexts/OrderContext';
import { formatPrice } from '../utils/currencyHelper';
import { getAllergenDetails } from '../utils/allergenHelper';
import AnimatedPrice from './AnimatedPrice';

const MenuItem = ({ item, index, isLast, language, onClick, hideIcon }) => {
    const { addToCart } = useOrder();

    // DEMO DATA: Hardcode allergens for specific items if missing
    let displayAllergens = item.allergens || [];
    let displayIngredients = item.ingredients || '';

    const currency = language === 'mk' ? 'MKD' : 'EUR';

    const handleAddClick = (e) => {
        e.stopPropagation();
        addToCart(item);
    };

    const hasImage = !hideIcon && item.image;

    return (
        <div
            onClick={() => onClick && onClick(item)}
            style={{
                position: 'relative', // Needed for absolute positioning of button
                display: 'grid',
                gridTemplateColumns: hasImage ? '1fr 100px' : '1fr', // Single columns for text-only
                gap: '12px',
                paddingTop: index === 0 ? '16px' : '16px', // Standardized vertical padding (16px)
                paddingBottom: isLast ? '16px' : '16px', // Standardized vertical padding (16px)
                paddingRight: hasImage ? 0 : '0px', // No right padding, we manage button space
                paddingLeft: 0,
                borderBottom: isLast ? 'none' : '1px solid var(--border-color)',
                alignItems: hasImage ? 'start' : 'stretch', // Stretch for text-only to allow bottom alignment
                cursor: 'pointer',
                backgroundColor: 'var(--bg-item-card, transparent)', // Configurable background
                transition: 'background-color 0.2s',
                minHeight: hasImage ? 'auto' : '80px' // Ensure enough height for button
            }}
        >
            {/* Left Column: Content */}
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '4px', // Tighter content gap
                minWidth: 0,
                paddingBottom: hasImage ? '0' : '0', // No extra padding needed, flex gap handles it
                paddingRight: hasImage ? '0' : '48px', // Reserve space for the button on the right
                justifyContent: 'flex-start',
                height: '100%'
            }}>
                {/* Title (Always Top) */}
                <h3 style={{
                    margin: 0,
                    fontSize: '16px',
                    fontWeight: 700,
                    color: 'var(--color-item-title, var(--color-ink))',
                    lineHeight: 1.3
                }}>
                    {item.name?.[language] || item.name?.['en'] || item.name || 'Unnamed Item'}
                </h3>

                {/* Price (Under Title) */}
                <div style={{
                    fontSize: '15px',
                    fontWeight: 600,
                    color: 'var(--color-item-price, var(--color-primary))',
                    marginBottom: '2px'
                }}>
                    <AnimatedPrice value={item.price} currency={currency} />
                    {item.options && item.options.length > 0 && <span style={{ fontSize: '12px', fontWeight: 400, color: 'var(--color-text-subtle)', marginLeft: '4px' }}>+ options</span>}
                </div>

                {/* Description (Under Price) */}
                {(item.desc?.[language] || item.desc?.['en'] || item.description?.[language] || item.description?.['en']) && (
                    <p style={{
                        margin: 0,
                        fontSize: '14px', // Good readable size
                        color: 'var(--color-text-subtle)',
                        opacity: 0.85,
                        lineHeight: 1.4,
                        marginBottom: '4px'
                    }}>
                        {item.desc?.[language] || item.desc?.['en'] || item.description?.[language] || item.description?.['en']}
                    </p>
                )}

                {/* Ingredients & Allergens Container - Pushed nicely */}
                <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {/* Ingredients */}
                    {displayIngredients && (
                        <p style={{
                            margin: 0,
                            fontSize: '12px',
                            fontStyle: 'italic',
                            color: 'var(--color-text-subtle)',
                            opacity: 0.7
                        }}>
                            {typeof displayIngredients === 'object'
                                ? (displayIngredients[language] || displayIngredients.en)
                                : displayIngredients
                            }
                        </p>
                    )}

                    {/* Allergens - Horizontal Row */}
                    {displayAllergens.length > 0 && (
                        <div style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: '6px',
                            marginTop: '2px'
                        }}>
                            {displayAllergens.map((alg, i) => {
                                const { icon: Icon, color, label } = getAllergenDetails(alg, language);
                                return (
                                    <div key={i} style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '4px',
                                        padding: '2px 0', // Minimal padding, just icon + text
                                    }}>
                                        <div style={{
                                            padding: '4px',
                                            borderRadius: '6px',
                                            backgroundColor: `${color}15`,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}>
                                            <Icon size={12} color={color} strokeWidth={2.5} />
                                        </div>
                                        <span style={{
                                            fontSize: '10px',
                                            fontWeight: 600,
                                            color: 'var(--color-text-subtle)', // Subtle text next to colorful icon
                                            textTransform: 'uppercase',
                                        }}>
                                            {label}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* No-Image Add Button (Bottom Right) */}
            {!hasImage && (
                <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={handleAddClick}
                    style={{
                        position: 'absolute',
                        bottom: isLast ? '16px' : '16px', // Align with bottom padding
                        right: '0px',
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%', // Circle
                        backgroundColor: 'var(--color-item-price)',
                        border: 'none',
                        color: '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                        zIndex: 10
                    }}
                >
                    <Plus size={18} strokeWidth={3} />
                </motion.button>
            )}

            {/* Right Column: Image */}
            {hasImage && (
                <div style={{ position: 'relative', width: '100px', height: '100px', flexShrink: 0 }}>
                    <img
                        src={item.image}
                        alt={item.name?.[language] || item.name?.['en'] || 'Item'}
                        loading="lazy"
                        decoding="async"
                        style={{
                            width: '100%',
                            height: '100%',
                            borderRadius: '20px', // Inner matches outer accordion 20px
                            objectFit: 'cover',
                            backgroundColor: 'var(--bg-surface-secondary)',
                            // border removed for cleaner look
                        }}
                    />
                    {/* Image Add Button (Bottom Right Overlap) */}
                    <motion.button
                        whileTap={{ scale: 0.85, rotate: 90 }} // Added rotation for micro-animation
                        onClick={handleAddClick}
                        style={{
                            position: 'absolute',
                            bottom: '-4px', // Slightly tucked
                            right: '-4px', // Slightly tucked
                            width: '32px', // Consistency: 32px
                            height: '32px',
                            borderRadius: '50%',
                            backgroundColor: 'var(--color-item-price)',
                            border: '2px solid var(--bg-surface)', // Border to separate from image/bg
                            color: '#fff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                            zIndex: 10
                        }}
                    >
                        <Plus size={18} strokeWidth={3} />
                    </motion.button>
                </div>
            )}
        </div>
    );
};

export default MenuItem;
