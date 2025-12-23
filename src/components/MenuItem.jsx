import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X } from 'lucide-react';
import { formatPrice } from '../utils/currencyHelper';
import { getAllergenDetails } from '../utils/allergenHelper';

const MenuItem = ({ item, index, onAdd, isLast, language }) => {
    const [selectedOption, setSelectedOption] = useState(null);

    // DEMO DATA: Hardcode allergens for specific items if missing
    // Ideally this comes from the admin panel, but user asked for immediate demo
    let displayAllergens = item.allergens || [];
    let displayIngredients = item.ingredients || '';

    if (item.name?.en?.toLowerCase().includes('pepperoni') && !item.allergens) {
        displayAllergens = ['Gluten', 'Dairy', 'Spicy'];
        displayIngredients = 'Tomato sauce, Mozzarella, Spicy Pepperoni, Oregano';
    }

    const currency = language === 'mk' ? 'MKD' : 'EUR';

    const handleAdd = () => {
        if (selectedOption) {
            // Create a unique ID for the cart based on option
            const itemWithOption = {
                ...item,
                id: `${item.id}-${selectedOption.id}`,
                name: {
                    ...item.name,
                    en: `${item.name.en} (${selectedOption.label.en})`,
                    mk: `${item.name.mk} (${selectedOption.label.mk})`,
                    sq: `${item.name.sq || item.name.en} (${selectedOption.label.sq || selectedOption.label.en})`
                },
                price: item.price + selectedOption.price
            };
            onAdd && onAdd(itemWithOption);
        } else {
            onAdd && onAdd(item);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, duration: 0.3 }}
            style={{
                display: 'grid',
                gridTemplateColumns: '1fr 100px',
                gap: '12px',
                padding: '12px 0',
                borderBottom: isLast ? 'none' : '1px solid var(--border-color)',
                alignItems: 'start'
            }}
        >
            {/* Left Column: Content */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', minWidth: 0 }}>
                {/* Title */}
                <h3 style={{
                    margin: 0,
                    fontSize: '15px',
                    fontWeight: 600,
                    color: 'var(--color-ink)',
                    lineHeight: 1.3
                }}>
                    {item.name?.[language] || item.name?.['en'] || item.name || 'Unnamed Item'}
                </h3>

                {/* Price */}
                <div style={{
                    fontSize: '14px',
                    fontWeight: 600,
                    color: 'var(--color-primary)'
                }}>
                    {formatPrice((item.price + (selectedOption?.price || 0)), currency)}
                </div>

                {/* Description */}
                {(item.desc?.[language] || item.desc?.['en'] || item.description?.[language] || item.description?.['en']) && (
                    <p style={{
                        margin: 0,
                        fontSize: '12px',
                        color: 'var(--color-text-subtle)',
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
                        color: 'var(--color-text-subtle)',
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
                            const { icon: Icon, color, label } = getAllergenDetails(alg);
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
                            <motion.button
                                key={opt.id}
                                whileTap={{ scale: 0.95 }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedOption(opt.id === selectedOption?.id ? null : opt);
                                }}
                                style={{
                                    padding: '5px 10px',
                                    borderRadius: '100px',
                                    border: `1.5px solid ${selectedOption?.id === opt.id ? 'var(--color-primary)' : 'var(--border-color)'}`,
                                    backgroundColor: selectedOption?.id === opt.id ? 'var(--color-primary)' : 'transparent',
                                    color: selectedOption?.id === opt.id ? 'var(--color-on-primary)' : 'var(--color-ink)',
                                    fontSize: '12px',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    whiteSpace: 'nowrap'
                                }}
                            >
                                {opt.label?.[language] || opt.label?.['en'] || opt.label}
                                {opt.price > 0 && ` +${formatPrice(opt.price, currency)}`}
                            </motion.button>
                        ))}
                    </div>
                )}
            </div>

            {/* Right Column: Image */}
            <div style={{ position: 'relative', width: '100px', height: '100px' }}>
                <div style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: '12px',
                    backgroundColor: 'var(--bg-surface-secondary)',
                    backgroundImage: `url(${item.image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    border: '1px solid var(--border-color)'
                }} />

                {/* Add Button */}
                <motion.button
                    whileTap={{ scale: 0.8, rotate: -10 }}
                    whileHover={{ scale: 1.1 }}
                    onClick={(e) => {
                        e.stopPropagation();
                        handleAdd();
                    }}
                    style={{
                        position: 'absolute',
                        bottom: '-6px',
                        right: '-6px',
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--color-primary)',
                        color: 'var(--color-on-primary)',
                        border: '2px solid var(--bg-surface)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                    }}
                >
                    <Plus size={18} strokeWidth={2.5} />
                </motion.button>
            </div>
        </motion.div>
    );
};

export default MenuItem;
