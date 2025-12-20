import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, X } from 'lucide-react';

const MenuItem = ({ item, index, onAdd, isLast, language }) => {
    // If item has options, default to null (Base item/Regular)
    const [selectedOption, setSelectedOption] = useState(null);
    const [isExpanded, setIsExpanded] = useState(false);

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
                alignItems: 'flex-start', // Align top for complex items
                justifyContent: 'space-between',
                padding: '16px 0',
                borderBottom: isLast ? 'none' : '1px solid var(--border-color)',
                gap: '16px',
            }}
        >
            <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '4px' }}>
                    <h3 style={{
                        margin: 0,
                        fontSize: '16px',
                        fontWeight: 600,
                        color: 'var(--color-ink)'
                    }}>
                        {item.name[language] || item.name['en']}
                    </h3>
                    <span style={{
                        fontSize: '14px',
                        fontWeight: 500,
                        color: 'var(--color-text-subtle)'
                    }}>
                        {/* Dynamic price based on selection */}
                        ${((item.price + (selectedOption?.price || 0))).toFixed(2)}
                    </span>
                </div>
                <p style={{
                    margin: 0,
                    fontSize: '13px',
                    color: 'var(--color-text-subtle)',
                    lineHeight: 1.5,
                    paddingRight: '8px',
                    marginBottom: item.options ? '12px' : '0'
                }}>
                    {item.desc[language] || item.desc['en']}
                </p>

                {/* Customization Toggle */}
                {item.options && (
                    <div style={{ marginTop: '4px' }}>
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
                                                    // Toggle logic
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
                                                {opt.price > 0 && ` +$${opt.price.toFixed(2)}`}
                                            </button>
                                        );
                                    })}
                                </div>
                            </motion.div>
                        )}
                    </div>
                )}
            </div>

            <div style={{ position: 'relative', flexShrink: 0 }}>
                {/* Image */}
                <div style={{
                    width: '72px',
                    height: '72px',
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
                        bottom: '-6px',
                        right: '-6px',
                        width: '26px',
                        height: '26px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--color-primary)',
                        color: 'var(--color-on-primary)',
                        border: '2px solid var(--bg-surface)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        boxShadow: '0 4px 8px rgba(0,0,0,0.15)'
                    }}
                >
                    <Plus size={16} strokeWidth={3} />
                </motion.button>
            </div>
        </motion.div>
    );
};

export default MenuItem;
