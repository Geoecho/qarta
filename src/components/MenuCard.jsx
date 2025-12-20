import React from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';

const MenuCard = ({ item, index, onAdd }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: index * 0.05, duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
            whileTap={{ scale: 0.98 }}
            style={{
                backgroundColor: 'white',
                borderRadius: '20px',
                overflow: 'hidden',
                boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative'
            }}
        >
            {/* Image Area */}
            <div style={{
                width: '100%',
                aspectRatio: '4/3', // Friendly rectangular shape
                backgroundColor: 'var(--color-structure)',
                backgroundImage: `url(${item.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                position: 'relative'
            }}>
                {!item.image && (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#999', fontSize: '12px' }}>
                        IMG
                    </div>
                )}

                {/* Price Tag Overlay */}
                <div style={{
                    position: 'absolute',
                    bottom: '8px',
                    left: '8px',
                    backgroundColor: 'rgba(255,255,255,0.9)',
                    backdropFilter: 'blur(8px)',
                    padding: '4px 10px',
                    borderRadius: '10px',
                    fontSize: '13px',
                    fontWeight: 700,
                    color: 'var(--color-ink)',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}>
                    ${item.price.toFixed(2)}
                </div>
            </div>

            {/* Content Area */}
            <div style={{ padding: '12px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                <h3 style={{
                    margin: '0 0 4px 0',
                    fontSize: '15px',
                    fontWeight: 700,
                    color: 'var(--color-ink)',
                    lineHeight: 1.2
                }}>
                    {item.name}
                </h3>
                <p style={{
                    margin: 0,
                    fontSize: '12px',
                    color: 'var(--color-text-subtle)',
                    lineHeight: 1.4,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    flex: 1
                }}>
                    {item.desc}
                </p>

                {/* Add Button */}
                <motion.button
                    onClick={onAdd}
                    whileTap={{ scale: 0.95 }}
                    style={{
                        marginTop: '12px',
                        width: '100%',
                        padding: '8px',
                        borderRadius: '12px',
                        border: 'none',
                        backgroundColor: 'var(--color-vapor)',
                        color: 'var(--color-ink)',
                        fontSize: '13px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '4px',
                        transition: 'background 0.2s'
                    }}
                >
                    <Plus size={14} strokeWidth={3} />
                    Add
                </motion.button>
            </div>
        </motion.div>
    );
};

export default MenuCard;
