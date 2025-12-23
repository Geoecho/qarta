import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, CreditCard, Clock } from 'lucide-react';

const PromoPopup = ({ promotion }) => {
    // promotion = { active, title, message, image }
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Show if active AND not already seen used in this session
        if (promotion && promotion.active) {
            const hasSeen = sessionStorage.getItem(`seen_promo_${promotion.title}`);
            if (!hasSeen) {
                // Small delay for better UX
                const timer = setTimeout(() => setIsVisible(true), 1000);
                return () => clearTimeout(timer);
            }
        }
    }, [promotion]);

    const handleClose = () => {
        setIsVisible(false);
        sessionStorage.setItem(`seen_promo_${promotion.title}`, 'true');
    };

    if (!promotion || !promotion.active) return null;

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={handleClose}
                    style={{
                        position: 'fixed',
                        inset: 0,
                        backgroundColor: 'rgba(0,0,0,0.6)',
                        backdropFilter: 'blur(4px)',
                        zIndex: 9998,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '24px'
                    }}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            width: '100%',
                            maxWidth: '420px',
                            backgroundColor: 'var(--bg-surface)',
                            borderRadius: '24px',
                            overflow: 'hidden',
                            position: 'relative',
                            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
                        }}
                    >
                        {/* Close Button */}
                        <button
                            onClick={handleClose}
                            style={{
                                position: 'absolute',
                                top: '16px',
                                right: '16px',
                                background: 'rgba(0,0,0,0.1)',
                                border: 'none',
                                borderRadius: '50%',
                                width: '32px',
                                height: '32px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                color: 'var(--color-ink)',
                                zIndex: 2
                            }}
                        >
                            <X size={18} />
                        </button>

                        {/* Image Header */}
                        {promotion.image ? (
                            <div style={{ height: '240px', width: '100%', position: 'relative' }}>
                                <img
                                    src={promotion.image}
                                    alt="Promotion"
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, transparent 40%)' }} />
                            </div>
                        ) : (
                            <div style={{
                                height: '140px',
                                background: 'linear-gradient(135deg, var(--color-primary), #a855f7)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white'
                            }}>
                                <Star size={48} fill="white" style={{ opacity: 0.9 }} />
                            </div>
                        )}

                        {/* Content */}
                        <div style={{
                            padding: '28px 20px 24px 20px',
                            textAlign: 'center',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center'
                        }}>
                            <h2 style={{ margin: '0 0 12px 0', fontSize: '22px', fontFamily: 'var(--font-sans)', color: 'var(--color-ink)', lineHeight: 1.3 }}>
                                {promotion.title}
                            </h2>
                            <p style={{ margin: '0 0 24px 0', color: 'var(--color-text-subtle)', lineHeight: 1.6, fontSize: '15px' }}>
                                {promotion.message}
                            </p>

                            <button
                                onClick={handleClose}
                                style={{
                                    width: '100%',
                                    padding: '14px',
                                    borderRadius: '100px',
                                    border: 'none',
                                    background: 'var(--color-ink)',
                                    color: 'var(--bg-app)',
                                    fontSize: '16px',
                                    fontWeight: 700,
                                    cursor: 'pointer'
                                }}
                            >
                                Got it!
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );

};

export default PromoPopup;
