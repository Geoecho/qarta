import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MenuItem from './MenuItem'; // Reusing existing item component
import { X } from 'lucide-react';

const SearchResults = ({ results, onAdd, language, bottomOffset = 24 }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            style={{
                position: 'fixed',
                // 64px = estimated height of search bar with new padding + margin
                // We add safe-area here too so it moves up in sync with the search bar
                bottom: `calc(${bottomOffset}px + 72px + env(safe-area-inset-bottom, 0px))`,
                left: 0,
                right: 0,
                margin: '0 auto',
                width: 'calc(100% - 48px)',
                maxWidth: '432px',
                maxHeight: '300px', // Max height for ~3-4 items
                backgroundColor: 'var(--bg-surface)',
                borderRadius: '24px',
                boxShadow: '0 -10px 40px rgba(0,0,0,0.1)',
                zIndex: 96, // Above backdrop (93) and search results (97)
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                border: '1px solid var(--border-color)',
                transition: 'bottom 0.3s ease'
            }}
        >
            {/* Header */}
            <div style={{
                padding: '16px 20px',
                borderBottom: '1px solid var(--border-color)',
                backgroundColor: 'var(--bg-surface-secondary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
            }}>
                <span style={{
                    fontWeight: 600,
                    fontSize: '14px',
                    color: 'var(--color-text-subtle)'
                }}>
                    {results.length} {results.length === 1 ? 'Result' : 'Results'}
                </span>
            </div>

            {/* List */}
            <div style={{
                overflowY: 'auto',
                padding: '0 16px',
                WebkitOverflowScrolling: 'touch'
            }}>
                {results.length > 0 ? (
                    results.map((item, index) => (
                        <MenuItem
                            key={item.id || index}
                            item={item}
                            index={index}
                            onAdd={onAdd}
                            language={language}
                            isLast={index === results.length - 1}
                        />
                    ))
                ) : (
                    <div style={{
                        padding: '40px 20px',
                        textAlign: 'center',
                        color: 'var(--color-text-subtle)'
                    }}>
                        <p style={{ margin: 0 }}>No matching items found</p>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default SearchResults;
