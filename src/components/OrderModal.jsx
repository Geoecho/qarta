import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus, CreditCard, MessageSquare, ArrowRight } from 'lucide-react';
import { useOrder } from '../contexts/OrderContext';

const translations = {
    orderTitle: { en: 'Your Order', mk: 'Твоја нарачка', sq: 'Porosia Juaj' },
    emptyCart: { en: 'Your cart is empty.', mk: 'Кошничката е празна.', sq: 'Shporta juaj është e zbrazët.' },
    notesTitle: { en: 'Notes for kitchen', mk: 'Забелешка за кујна', sq: 'Shënime për kuzhinën' },
    notesPlaceholder: { en: 'Allergies, etc...', mk: 'Алергии, и сл...', sq: 'Alergji, etj...' },
    total: { en: 'Total', mk: 'Вкупно', sq: 'Totale' },
    confirm: { en: 'Place Order', mk: 'Нарачај', sq: 'Porosit' },
    sending: { en: 'Sending...', mk: 'Се испраќа...', sq: 'Duke dërguar...' },
    confirmedTitle: { en: 'Confirmed.', mk: 'Потврдено.', sq: 'E Konfirmuar.' },
    kitchenHasIt: { en: 'The kitchen has it.', mk: 'Кујната ја прими нарачката.', sq: 'Kuzhina e ka marrë porosinë.' },
    sent: { en: 'Sent', mk: 'Испратено', sq: 'Dërguar' },
    prep: { en: 'Prep', mk: 'Подготовка', sq: 'Përgatitje' },
    ready: { en: 'Ready', mk: 'Готово', sq: 'Gati' },
    minsRemaining: { en: 'Minutes remaining', mk: 'Минути преостанато', sq: 'Minuta të mbetura' },
    close: { en: 'Close', mk: 'Затвори', sq: 'Mbyll' },
};

const OrderModal = ({ isOpen, onClose, language = 'en' }) => {
    const {
        cart,
        updateQuantity,
        totalPrice,
        orderStatus,
        placeOrder
    } = useOrder();

    const [note, setNote] = useState('');
    const t = translations;

    const handleCheckout = () => {
        placeOrder();
    };

    const handleCloseFinal = () => {
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={orderStatus === 'confirmed' ? handleCloseFinal : onClose}
                        style={{
                            position: 'fixed',
                            inset: 0,
                            backgroundColor: 'rgba(0,0,0,0.6)',
                            backdropFilter: 'blur(8px)',
                            zIndex: 200
                        }}
                    />

                    {/* Sheet */}
                    <motion.div
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        style={{
                            position: 'fixed',
                            bottom: 0,
                            left: 0,
                            width: '100%',
                            height: orderStatus === 'idle' ? '92vh' : 'auto',
                            minHeight: orderStatus === 'idle' ? '92vh' : '50vh',
                            backgroundColor: 'var(--bg-surface)',
                            color: 'var(--color-ink)',
                            borderTopLeftRadius: '32px',
                            borderTopRightRadius: '32px',
                            zIndex: 201,
                            display: 'flex',
                            flexDirection: 'column',
                            overflow: 'hidden',
                            maxWidth: '480px',
                            margin: '0 auto',
                            right: 0
                        }}
                    >
                        {/* View: Standard Cart (Idle) */}
                        {orderStatus === 'idle' && (
                            <>
                                <div style={{
                                    padding: '24px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    borderBottom: '1px solid var(--border-color)'
                                }}>
                                    <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 600 }}>
                                        {t.orderTitle[language]}
                                    </h2>
                                    <button onClick={onClose} style={{ border: 'none', background: 'transparent', color: 'var(--color-ink)', cursor: 'pointer' }}>
                                        <X />
                                    </button>
                                </div>

                                <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
                                    {cart.length === 0 ? (
                                        <div style={{ padding: '40px 0', textAlign: 'center', color: 'var(--color-text-subtle)' }}>
                                            <p style={{ fontSize: '18px' }}>{t.emptyCart[language]}</p>
                                        </div>
                                    ) : (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                                            {cart.map((item) => (
                                                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                                                        <div style={{
                                                            width: '56px', height: '56px', borderRadius: '12px',
                                                            backgroundImage: `url(${item.image})`, backgroundSize: 'cover',
                                                            backgroundColor: 'var(--bg-surface-secondary)',
                                                        }} />
                                                        <div>
                                                            {/* Handle Localized Name in Cart */}
                                                            <div style={{ fontWeight: 600 }}>
                                                                {item.name[language] || item.name['en']}
                                                            </div>
                                                            <div style={{ color: 'var(--color-text-subtle)', fontSize: '14px' }}>${item.price.toFixed(2)}</div>
                                                        </div>
                                                    </div>

                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'var(--bg-surface-secondary)', padding: '4px', borderRadius: '100px' }}>
                                                        <button
                                                            onClick={() => updateQuantity(item.id, -1)}
                                                            style={{ width: '32px', height: '32px', borderRadius: '50%', border: 'none', background: 'var(--bg-surface)', color: 'var(--color-ink)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-sm)', cursor: 'pointer' }}
                                                        >
                                                            <Minus size={16} />
                                                        </button>
                                                        <span style={{ fontSize: '14px', fontWeight: 600, width: '20px', textAlign: 'center' }}>{item.quantity}</span>
                                                        <button
                                                            onClick={() => updateQuantity(item.id, 1)}
                                                            style={{ width: '32px', height: '32px', borderRadius: '50%', border: 'none', background: 'var(--bg-surface)', color: 'var(--color-ink)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-sm)', cursor: 'pointer' }}
                                                        >
                                                            <Plus size={16} />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}

                                            {/* Notes Area */}
                                            <div style={{ marginTop: '24px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: 'var(--color-ink)', fontWeight: 600 }}>
                                                    <MessageSquare size={16} />
                                                    <span>{t.notesTitle[language]}</span>
                                                </div>
                                                <textarea
                                                    value={note}
                                                    onChange={(e) => setNote(e.target.value)}
                                                    placeholder={t.notesPlaceholder[language]}
                                                    style={{
                                                        width: '100%',
                                                        height: '80px',
                                                        borderRadius: '16px',
                                                        border: 'none',
                                                        padding: '16px',
                                                        fontFamily: 'var(--font-sans)',
                                                        fontSize: '14px',
                                                        resize: 'none',
                                                        outline: 'none',
                                                        backgroundColor: 'var(--bg-surface-secondary)',
                                                        color: 'var(--color-ink)'
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div style={{ padding: '24px', paddingBottom: '40px', background: 'var(--bg-surface)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', fontSize: '18px', fontWeight: 600 }}>
                                        <span>{t.total[language]}</span>
                                        <span>${totalPrice.toFixed(2)}</span>
                                    </div>
                                    <button
                                        onClick={handleCheckout}
                                        disabled={cart.length === 0}
                                        style={{
                                            width: '100%',
                                            padding: '18px',
                                            borderRadius: '20px',
                                            background: cart.length > 0 ? 'var(--color-primary)' : 'var(--bg-surface-secondary)',
                                            color: cart.length > 0 ? 'var(--color-on-primary)' : 'var(--color-text-subtle)',
                                            border: 'none',
                                            fontSize: '16px',
                                            fontWeight: 600,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '12px',
                                            cursor: 'pointer',
                                            transition: 'transform 0.1s'
                                        }}
                                    >
                                        <CreditCard size={20} />
                                        {t.confirm[language]}
                                    </button>
                                </div>
                            </>
                        )}

                        {/* View: Minimal Waiting */}
                        {orderStatus === 'waiting' && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 40px' }}
                            >
                                <div style={{ position: 'relative', width: '80px', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <motion.div
                                        animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                        style={{ position: 'absolute', width: '100%', height: '100%', borderRadius: '50%', border: '2px solid var(--color-primary)' }}
                                    />
                                    <motion.div
                                        animate={{ scale: [1, 1.2, 1], opacity: [0.8, 0.4, 0.8] }}
                                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                                        style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: 'var(--color-primary)' }}
                                    />
                                </div>
                                <h3 style={{ marginTop: '32px', fontWeight: 500, letterSpacing: '0.02em' }}>{t.sending[language]}</h3>
                            </motion.div>
                        )}

                        {/* View: Minimal Accepted */}
                        {orderStatus === 'confirmed' && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 40px' }}
                            >
                                <motion.div
                                    initial={{ scale: 0.8, opacity: 0, y: 20 }}
                                    animate={{ scale: 1, opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, ease: 'backOut' }}
                                    style={{ textAlign: 'center' }}
                                >
                                    <h2 style={{ fontSize: '32px', fontWeight: 800, margin: '0 0 8px 0', letterSpacing: '-0.03em' }}>
                                        {t.confirmedTitle[language]}
                                    </h2>
                                    <p style={{ color: 'var(--color-text-subtle)', margin: 0 }}>{t.kitchenHasIt[language]}</p>
                                </motion.div>

                                {/* Responsive Tracker */}
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.3 }}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        marginTop: '32px',
                                        width: '100%',
                                        maxWidth: '320px', // Wider container
                                        justifyContent: 'center'
                                    }}
                                >
                                    <div style={{ flexShrink: 0, width: '8px', height: '8px', borderRadius: '50%', background: 'var(--color-ink)' }} />
                                    <div style={{ flex: 1, height: '1px', background: 'var(--color-ink)' }} />
                                    <div style={{ flexShrink: 0, width: '8px', height: '8px', borderRadius: '50%', border: '1px solid var(--color-ink)' }} />
                                    <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }} />
                                    <div style={{ flexShrink: 0, width: '8px', height: '8px', borderRadius: '50%', border: '1px solid var(--border-color)' }} />
                                </motion.div>

                                {/* Responsive Labels */}
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    width: '100%',
                                    maxWidth: '340px', // Matches dot width approx +/- margins
                                    marginTop: '8px',
                                    fontSize: '11px', // Slightly smaller for safety
                                    color: 'var(--color-text-subtle)',
                                    fontWeight: 600,
                                    letterSpacing: '0.05em',
                                    textTransform: 'uppercase'
                                }}>
                                    <span>{t.sent[language]}</span>
                                    <span style={{ color: 'var(--color-ink)' }}>{t.prep[language]}</span>
                                    <span>{t.ready[language]}</span>
                                </div>

                                <div style={{ margin: '40px 0', textAlign: 'center' }}>
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.4 }}
                                        style={{ fontSize: '64px', fontWeight: 200, fontFamily: 'monospace', letterSpacing: '-0.05em', lineHeight: 1 }}
                                    >
                                        08:00
                                    </motion.div>
                                    <div style={{ color: 'var(--color-text-subtle)', fontSize: '12px', fontWeight: 600, marginTop: '8px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{t.minsRemaining[language]}</div>
                                </div>

                                <motion.button
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.8 }}
                                    onClick={handleCloseFinal}
                                    style={{
                                        background: 'transparent',
                                        border: '1px solid var(--border-color)',
                                        padding: '12px 32px',
                                        borderRadius: '100px',
                                        color: 'var(--color-ink)',
                                        fontSize: '14px',
                                        fontWeight: 600,
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px'
                                    }}
                                >
                                    {t.close[language]} <ArrowRight size={14} />
                                </motion.button>
                            </motion.div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default OrderModal;
