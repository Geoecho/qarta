import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Cloud, Folder, Trash2, X } from 'lucide-react';

const Block = ({
    type = 'square',
    color = 'var(--color-primary-red)',
    size = 'md',
    widthVariant = 'full',
    text = '',
    style = {},
    isActive,
    isDimmed,
    onClick,
    onDelete
}) => {

    // Base styles for all blocks
    const baseStyle = {
        backgroundColor: color,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        position: 'relative',
        gap: '8px',
        padding: '0 12px',
        ...style
    };

    // Specific shape styles
    const getShapeStyle = () => {
        const isHalf = widthVariant === 'half';

        switch (type) {
            case 'circle':
                return {
                    borderRadius: '50%',
                    width: isHalf ? '100%' : getSize(size),
                    height: isHalf ? 'auto' : getSize(size),
                    aspectRatio: '1/1',
                    flexDirection: 'column',
                };
            case 'square':
                return {
                    borderRadius: 0,
                    width: '100%',
                    height: 'auto',
                    aspectRatio: '1/1',
                    flexDirection: 'column',
                };
            case 'rectangle':
                return {
                    borderRadius: 0,
                    width: '100%',
                    height: getSize(size),
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                };
            case 'line':
                return {
                    width: '100%',
                    height: '2px',
                    backgroundColor: 'var(--color-text-black)',
                    padding: 0,
                };
            default:
                return {};
        }
    };

    function getSize(s) {
        switch (s) {
            case 'sm': return 'var(--space-4)';
            case 'md': return 'var(--space-6)';
            case 'lg': return 'var(--space-8)';
            case 'xl': return 'var(--space-12)';
            default: return 'var(--space-6)';
        }
    }

    // Determine Icon based on type or context
    const getIcon = () => {
        if (type === 'line') return null;
        const sizeProps = { size: 18, strokeWidth: 2.5 };
        if (type === 'circle') return <Cloud {...sizeProps} />;
        if (type === 'rectangle') return <Folder {...sizeProps} />;
        return <Check {...sizeProps} />;
    };

    const isYellow = color.includes('yellow') || color.includes('#FFCC00');
    const textColor = isYellow ? 'var(--color-text-black)' : 'white';

    return (
        <motion.div
            layout
            onClick={onClick}
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{
                opacity: isDimmed ? 0.3 : 1,
                scale: isActive ? 1.02 : 1,
                y: isActive ? -4 : 0,
                filter: isDimmed ? 'blur(1px)' : 'none',
                boxShadow: isActive ? '0 12px 24px rgba(0,0,0,0.15)' : '0 2px 4px rgba(0,0,0,0.0)',
            }}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.96 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{
                type: "spring",
                stiffness: 400,
                damping: 25,
                layout: { duration: 0.3 }
            }}
            className={`block block-${type}`}
            style={{
                ...baseStyle,
                ...getShapeStyle(),
                zIndex: isActive ? 20 : 1,
                maxWidth: '100%',
            }}
            role="button"
            tabIndex={0}
            aria-label={`${text || type} block`}
        >
            {type !== 'line' && (
                <>
                    <span style={{ color: textColor, opacity: 0.8, display: 'flex' }}>
                        {getIcon()}
                    </span>
                    <span style={{
                        color: textColor,
                        fontFamily: 'var(--font-sans)',
                        fontSize: '14px',
                        fontWeight: 600,
                        letterSpacing: '-0.01em',
                        pointerEvents: 'none',
                        textAlign: type === 'rectangle' ? 'left' : 'center',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        maxWidth: '90%',
                    }}>
                        {text}
                    </span>
                </>
            )}

            {/* Delete/Close Action Overlay - Only visible when Active */}
            <AnimatePresence>
                {isActive && (
                    <motion.button
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0 }}
                        onClick={(e) => {
                            e.stopPropagation(); // Prevent unfocus
                            onDelete && onDelete();
                        }}
                        style={{
                            position: 'absolute',
                            top: '-12px',
                            right: '-12px',
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            backgroundColor: 'var(--color-text-black)',
                            color: 'white',
                            border: '2px solid white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
                        }}
                    >
                        <Trash2 size={16} />
                    </motion.button>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default Block;
