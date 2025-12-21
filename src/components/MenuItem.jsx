import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X } from 'lucide-react';
import { formatPrice } from '../utils/currencyHelper';

const MenuItem = ({ item, index, onAdd, isLast, language }) => {
    // If item has options, default to null (Base item/Regular)
    const [selectedOption, setSelectedOption] = useState(null);

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
                display: 'flex',
                gap: '12px',
                padding: '12px 0',
                borderBottom: isLast ? 'none' : '1px solid var(--border-color)',
                alignItems: 'flex-start'
            }}
        >
            {/* Content on Left */}
            <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
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

                {/* Price - Subtle */}
                <div style={{
                    fontSize: '14px',
                    fontWeight: 500,
                    color: 'var(--color-text-subtle)'
                }}>
                    {formatPrice((item.price + (selectedOption?.price || 0)), 'MKD')}
                </div>

                {/* Description */}
                {(item.desc?.[language] || item.desc?.['en'] || item.description?.[language] || item.description?.['en']) && (
                    <p style={{
                        margin: 0,
                        fontSize: '13px',
                        color: 'var(--color-text-subtle)',
                        lineHeight: 1.4,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                    }}>
                        {item.desc?.[language] || item.desc?.['en'] || item.description?.[language] || item.description?.['en']}
                    </p>
                )}

                {/* Options Chips Row */}
                {item.options && item.options.length > 0 && (
                    <div style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '6px',
                        marginTop: '2px'
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
                                {opt.price > 0 && ` +${formatPrice(opt.price, 'MKD')}`}
                            </motion.button>
                        ))}
                    </div>
                )}
            </div>

            {/* Image on Right */}
            <div style={{ position: 'relative', flexShrink: 0 }}>
                <div style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '12px',
                    backgroundColor: 'var(--bg-surface-secondary)',
                    backgroundImage: `url(${item.image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    border: '1px solid var(--border-color)'
                }} />

                {/* Add Button on Image */}
                <motion.button
                    whileTap={{ scale: 0.9 }}
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
