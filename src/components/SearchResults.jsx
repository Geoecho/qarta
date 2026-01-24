import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MenuItem from './MenuItem'; // Reusing existing item component
import { X } from 'lucide-react';

const SearchResults = ({ results, onAdd, language, bottomOffset = 24 }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.98 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            style={{
                position: 'absolute', // Changed from fixed to absolute so it scrolls with page
                // Top offset: Header (~60px) + SearchContainer (~80px) = ~140px
                // Adjusting for padding logic in App.jsx
                top: '72px',
                left: '24px',
                right: '24px',
                margin: '0',
                width: 'auto',
                maxWidth: '100%',
                maxHeight: '400px', // Larger display area
                backgroundColor: 'var(--bg-surface)',
                borderRadius: '24px',
                boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                zIndex: 99,
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                border: '1px solid var(--border-color)',
                transition: 'top 0.3s ease'
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
