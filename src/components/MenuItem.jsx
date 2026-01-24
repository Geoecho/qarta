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

    return (
        <div
            onClick={() => onClick && onClick(item)}
            style={{
                position: 'relative', // Needed for absolute positioning of button
                display: 'grid',
                gridTemplateColumns: (hideIcon || !item.image) ? '1fr' : '1fr 100px',
                gap: '12px',
                paddingTop: index === 0 ? '16px' : '12px',
                paddingBottom: isLast ? '16px' : '12px',
                paddingRight: 0,
                paddingLeft: 0,
                borderBottom: isLast ? 'none' : '1px solid var(--border-color)',
                alignItems: 'start',
                cursor: 'pointer',
                backgroundColor: 'var(--bg-item-card, transparent)', // Configurable background
                transition: 'background-color 0.2s' // Add subtle hover effect potentially?
            }}
        >
            {/* Left Column: Content */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', minWidth: 0, paddingBottom: (hideIcon || !item.image) ? '24px' : '0', paddingRight: (hideIcon || !item.image) ? '40px' : '0' }}>
                {/* Title */}
                <h3 style={{
                    margin: '0 0 2px 0',
                    fontSize: '16px', // Slightly larger
                    fontWeight: 700, // Stronger hierarchy
                    color: 'var(--color-item-title, var(--color-ink))',
                    lineHeight: 1.3
                }}>
                    {item.name?.[language] || item.name?.['en'] || item.name || 'Unnamed Item'}
                </h3>

                {/* Price */}
                <div style={{
                    fontSize: '14px',
                    fontWeight: 600,
                    color: 'var(--color-item-price, var(--color-primary))'
                }}>
                    <AnimatedPrice value={item.price} currency={currency} />
                    {item.options && item.options.length > 0 && <span style={{ fontSize: '12px', fontWeight: 400, color: 'var(--color-text-subtle)', marginLeft: '4px' }}>+ options</span>}
                </div>

                {/* Description */}
                {(item.desc?.[language] || item.desc?.['en'] || item.description?.[language] || item.description?.['en']) && (
                    <p style={{
                        margin: 0,
                        fontSize: '13px', // Increased from 12px
                        color: 'var(--color-text-subtle)', // More consistent subtle color
                        opacity: 0.85,
                        lineHeight: 1.5,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                    }}>
                        {item.desc?.[language] || item.desc?.['en'] || item.description?.[language] || item.description?.['en']}
                    </p>
                )}

                {/* Ingredients */}
                {displayIngredients && (
                    <p style={{
                        margin: 0,
                        fontSize: '11px',
                        fontStyle: 'italic',
                        color: 'var(--color-item-desc, var(--color-text-subtle))', // Use same desc color
                        lineHeight: 1.4
                    }}>
                        {typeof displayIngredients === 'object'
                            ? (displayIngredients[language] || displayIngredients.en)
                            : displayIngredients
                        }
                    </p>
                )}

                {/* Allergens - Horizontal */}
                {displayAllergens.length > 0 && (
                    <div style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '4px',
                        marginTop: '2px'
                    }}>
                        {displayAllergens.map((alg, i) => {
                            const { icon: Icon, color, label } = getAllergenDetails(alg, language);
                            return (
                                <div key={i} style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '3px',
                                    padding: '3px 6px',
                                    borderRadius: '4px',
                                    backgroundColor: `${color}15`,
                                    border: `1px solid ${color}40`
                                }}>
                                    <Icon size={10} color={color} strokeWidth={2.5} />
                                    <span style={{
                                        fontSize: '9px',
                                        fontWeight: 700,
                                        color: color,
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.02em'
                                    }}>
                                        {label}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Options Chips Row */}
                {item.options && item.options.length > 0 && (
                    <div style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '6px',
                        marginTop: '4px'
                    }}>
                        {item.options.map((opt) => (
                            <div
                                key={opt.id}
                                style={{
                                    padding: '4px 8px',
                                    borderRadius: '6px',
                                    border: '1px solid var(--border-color)',
                                    backgroundColor: 'var(--bg-surface-secondary)',
                                    color: 'var(--color-text-subtle)',
                                    fontSize: '11px',
                                    fontWeight: 500,
                                    whiteSpace: 'nowrap'
                                }}
                            >
                                {opt.label?.[language] || opt.label?.['en'] || opt.label}
                                {opt.price > 0 && ` +${formatPrice(opt.price, currency)}`}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* No-Image Add Button (Top Right of Card) */}
            {(hideIcon || !item.image) && (
                <motion.button
                    whileTap={{ scale: 0.85, rotate: 90 }}
                    onClick={handleAddClick}
                    style={{
                        position: 'absolute',
                        top: '12px', // Moved to Top
                        right: '0px',
                        width: '36px', // Slightly larger touch target for primary action
                        height: '36px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--color-item-price)',
                        border: 'none', // Removed border to match design req
                        color: '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)', // Enhanced shadow
                        zIndex: 10
                    }}
                >
                    <Plus size={20} strokeWidth={3} />
                </motion.button>
            )}

            {/* Right Column: Image */}
            {(!hideIcon && item.image) && (
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
                            bottom: '-6px',
                            right: '-6px',
                            width: '28px',
                            height: '28px',
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
                        <Plus size={16} strokeWidth={3} />
                    </motion.button>
                </div>
            )}
        </div>
    );
};

export default MenuItem;
