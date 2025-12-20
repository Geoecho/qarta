import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X } from 'lucide-react';
import { formatPrice } from '../utils/currencyHelper';

const MenuItem = ({ item, index, onAdd, isLast, language }) => {
    // If item has options, default to null (Base item/Regular)
    const [selectedOption, setSelectedOption] = useState(null);
    const [isExpanded, setIsExpanded] = useState(false);

    const handleAdd = () => {
        if (selectedOption) {
            // Create a unique ID for the cart based on option
            const itemWithOption = {
                ...item,
                id: `${item.id} -${selectedOption.id} `,
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
                gridTemplateColumns: '1fr auto',
                gap: '16px',
                padding: '16px 0',
                borderBottom: isLast ? 'none' : '1px solid var(--border-color)',
            }}
        >
            {/* Left Column: Content */}
            <div style={{ minWidth: 0 }}> {/* minWidth: 0 allows text truncation */}
                {/* Title */}
                <h3 style={{
                    margin: '0 0 4px 0',
                    fontSize: '16px',
                    fontWeight: 600,
                    color: 'var(--color-ink)',
                    lineHeight: 1.3
                }}>
                    {item.name?.[language] || item.name?.['en'] || item.name || 'Unnamed Item'}
                </h3>

                {/* Description */}
                {(item.desc?.[language] || item.desc?.['en'] || item.description?.[language] || item.description?.['en']) && (
                    <p style={{
                        margin: '0 0 8px 0',
                        fontSize: '13px',
                        color: 'var(--color-text-subtle)',
                        lineHeight: 1.5,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                    }}>
                        {(item.desc?.[language] || item.desc?.['en'] || item.description?.[language] || item.description?.['en'] || '')}
                    </p>
                )}

                {/* Customization Toggle */}
                {item.options && item.options.length > 0 && (
                    <div style={{ marginTop: '8px' }}>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsExpanded(!isExpanded);
                            }}
                            style={{
                                background: 'transparent',
                                border: 'none',
                                padding: '4px 0',
                                color: selectedOption ? 'var(--color-primary)' : 'var(--color-text-subtle)',
                                fontSize: '13px',
                                fontWeight: 600,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px',
                                transition: 'color 0.2s'
                            }}
                        >
                            {selectedOption ? (
                                <>
                                    <span>{selectedOption.label[language] || selectedOption.label['en']}</span>
                                    <span style={{ opacity: 0.6, fontWeight: 400, marginLeft: '4px', fontSize: '12px' }}>• Edit</span>
                                </>
                            ) : (
                                <span>Customize</span>
                            )}
                            <motion.div
                                animate={{ rotate: isExpanded ? 45 : 0 }}
                                transition={{ duration: 0.2 }}
                                style={{ display: 'flex' }}
                            >
                                <Plus size={14} />
                            </motion.div>
                        </button>

                        {/* Options Drawer */}
                        {isExpanded && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                style={{ marginTop: '8px', overflow: 'hidden' }}
                            >
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', paddingBottom: '4px' }}>
                                    {item.options.map(opt => {
                                        const isSelected = selectedOption?.id === opt.id;
                                        return (
                                            <button
                                                key={opt.id}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setSelectedOption(isSelected ? null : opt);
                                                }}
                                                style={{
                                                    border: isSelected ? '1px solid var(--color-primary)' : '1px solid var(--border-color)',
                                                    backgroundColor: isSelected ? 'var(--color-primary)' : 'var(--bg-surface)',
                                                    color: isSelected ? 'var(--color-on-primary)' : 'var(--color-text)',
                                                    padding: '6px 12px',
                                                    borderRadius: '20px',
                                                    fontSize: '12px',
                                                    fontWeight: 500,
                                                    cursor: 'pointer',
                                                    transition: 'all 0.2s',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '4px',
                                                    boxShadow: isSelected ? '0 2px 4px rgba(0,0,0,0.1)' : 'none'
                                                }}
                                            >
                                                {opt.label[language] || opt.label['en']}
                                                {opt.price > 0 && ` + $${opt.price.toFixed(2)} `}
                                            </button>
                                        );
                                    })}
                                </div>
                            </motion.div>
                        )}
                    </div>
                )}
            </div>

            {/* Right Column: Image + Price + Add Button */}
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-end',
                gap: '8px',
                minWidth: '90px'
            }}>
                {/* Price - Fixed Position */}
                <div style={{
                    fontSize: '16px',
                    fontWeight: 700,
                    color: 'var(--color-ink)',
                    whiteSpace: 'nowrap'
                }}>
                    {formatPrice((item.price + (selectedOption?.price || 0)), 'MKD')}
                </div>

                {/* Image with Add Button */}
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

                    {/* Add Button */}
                    <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => {
                            e.stopPropagation();
                            handleAdd();
                        }}
                        style={{
                            position: 'absolute',
                            bottom: '-8px',
                            right: '-8px',
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            backgroundColor: 'var(--color-primary)',
                            color: 'var(--color-on-primary)',
                            border: '3px solid var(--bg-surface)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                        }}
                    >
                        <Plus size={18} strokeWidth={3} />
                    </motion.button>
                </div>
            </div>
        </motion.div>
    );
};

export default MenuItem;
