import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { getSmartIcon, Utensils } from '../utils/iconMatcher';
import MenuItem from './MenuItem';

const MenuAccordion = ({ section, isOpen, onToggle, onAddToCart, language }) => {
    // Smart Icon Resolution
    const IconComponent = getSmartIcon(section.id) || getSmartIcon(section.title?.en) || Utensils;
    const [activeFilter, setActiveFilter] = useState('all');

    // Reset filter when closed (optional, keeps it clean)
    // useEffect(() => { if(!isOpen) setActiveFilter('all'); }, [isOpen]);

    const visibleItems = activeFilter === 'all'
        ? section.items
        : section.items.filter(item => item.tag === activeFilter);

    return (
        <div style={{
            marginBottom: '12px',
            backgroundColor: 'var(--bg-surface)',
            borderRadius: '20px',
            border: '1px solid var(--border-color)',
            overflow: 'hidden',
            boxShadow: 'var(--shadow-sm)'
        }}>
            {/* Header */}
            <button
                onClick={onToggle}
                style={{
                    width: '100%',
                    padding: '16px 20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: isOpen ? 'var(--bg-surface-secondary)' : 'var(--bg-surface)',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'background 0.2s',
                    textAlign: 'left'
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                        color: isOpen ? 'var(--color-ink)' : 'var(--color-text-subtle)',
                        transition: 'color 0.2s'
                    }}>
                        <IconComponent size={20} />
                    </div>
                    <span style={{
                        fontSize: '16px',
                        fontWeight: 700,
                        color: 'var(--color-ink)'
                    }}>
                        {/* Localized Title */}
                        {section.title[language] || section.title['en']}
                    </span>
                    <span style={{
                        fontSize: '12px',
                        color: 'var(--color-text-subtle)',
                        fontWeight: 500,
                        backgroundColor: isOpen ? 'var(--bg-app)' : 'var(--bg-surface-secondary)',
                        padding: '2px 8px',
                        borderRadius: '100px',
                        border: '1px solid var(--border-color)'
                    }}>
                        {section.items.length}
                    </span>
                </div>

                <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    style={{ color: 'var(--color-text-subtle)' }}
                >
                    <ChevronDown size={20} />
                </motion.div>
            </button>

            {/* Content */}
            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                    >
                        {/* Filter Chips (Only if section has filters) */}
                        {section.filters && (
                            <div style={{
                                padding: '12px 20px 4px 20px',
                                display: 'flex',
                                gap: '8px',
                                overflowX: 'auto',
                                scrollbarWidth: 'none', // Hide scrollbar
                                msOverflowStyle: 'none'
                            }}>
                                {section.filters.map(filter => {
                                    const isActive = activeFilter === filter.id;
                                    return (
                                        <button
                                            key={filter.id}
                                            onClick={() => setActiveFilter(filter.id)}
                                            style={{
                                                padding: '6px 14px',
                                                borderRadius: '100px',
                                                border: isActive ? 'none' : '1px solid var(--border-color)',
                                                backgroundColor: isActive ? 'var(--color-primary)' : 'var(--bg-app)',
                                                color: isActive ? 'var(--color-on-primary)' : 'var(--color-text-subtle)',
                                                fontSize: '13px',
                                                fontWeight: 600,
                                                cursor: 'pointer',
                                                whiteSpace: 'nowrap',
                                                transition: 'all 0.2s'
                                            }}
                                        >
                                            {filter.label[language] || filter.label['en']}
                                        </button>
                                    );
                                })}
                            </div>
                        )}

                        <div style={{ padding: '0 20px 8px 20px' }}>
                            {visibleItems.map((item, index) => (
                                <MenuItem
                                    key={item.id}
                                    item={item}
                                    index={index}
                                    onAdd={() => onAddToCart(item)}
                                    // Logic for 'isLast' is slightly imperfect with filtering, but good enough visually
                                    isLast={index === visibleItems.length - 1}
                                    language={language}
                                />
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default MenuAccordion;
