import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus, CreditCard, MessageSquare, ArrowRight } from 'lucide-react';
import { useOrder } from '../contexts/OrderContext';
import { formatPrice } from '../utils/currencyHelper';

import RemainingTime from './RemainingTime';

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

const OrderModal = ({ isOpen, onClose, language = 'en', restaurantSlug = 'default' }) => {
    const {
        cart,
        updateQuantity,
        totalPrice,
        orderStatus,
        placeOrder,
        activeOrder,
        cancelOrder,
        isLocalMode
    } = useOrder();

    const [note, setNote] = useState('');
    const t = translations;
    const currency = language === 'mk' ? 'MKD' : 'EUR';

    const handleCheckout = () => {
        placeOrder(restaurantSlug); // Pass the restaurant slug
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
                                                            <div style={{ color: 'var(--color-text-subtle)', fontSize: '14px' }}>{formatPrice(item.price, currency)}</div>
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
                                        <span>{formatPrice(totalPrice, currency)}</span>
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

                        {/* View: Active Order Status (Confirmed/Tracking) */}
                        {orderStatus === 'confirmed' && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '40px 24px', overflowY: 'auto' }}
                            >
                                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                                    <motion.h2
                                        initial={{ scale: 0.9, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        style={{ fontSize: '28px', fontWeight: 800, margin: '0 0 8px 0' }}
                                    >
                                        {isLocalMode ? (
                                            language === 'mk' ? 'Покажи на келнер' : 'Show to Waiter'
                                        ) : activeOrder?.status === 'accepted' ? (
                                            language === 'mk' ? 'Нарачката е прифатена!' : 'Order Accepted!'
                                        ) : activeOrder?.status === 'rejected' ? (
                                            language === 'mk' ? 'Нарачката е одбиена' : 'Order Declined'
                                        ) : (
                                            t.kitchenHasIt[language]
                                        )}
                                    </motion.h2>

                                    {isLocalMode ? (
                                        <div style={{ margin: '24px 0', padding: '24px', background: '#fef3c7', borderRadius: '16px', color: '#b45309', border: '2px dashed #b45309' }}>
                                            <div style={{ fontWeight: 700, fontSize: '18px', marginBottom: '8px' }}>ORDER #{activeOrder?.id?.slice(-4) || 'OPEN'}</div>
                                            <div style={{ fontSize: '14px' }}>Please show this screen to a staff member to place your order.</div>
                                        </div>
                                    ) : activeOrder?.status === 'accepted' ? (
                                        <div style={{ margin: '24px 0' }}>
                                            <div style={{ fontSize: '56px', fontWeight: 700, lineHeight: 1, fontFamily: 'monospace' }}>
                                                <RemainingTime activeOrder={activeOrder} t={t} language={language} showLabel={false} />
                                            </div>
                                            <div style={{ fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600, color: 'var(--color-text-subtle)', marginTop: '8px' }}>
                                                {t.minsRemaining[language]}
                                            </div>
                                        </div>
                                    ) : activeOrder?.status === 'rejected' ? (
                                        <div style={{ color: '#ef4444', marginTop: '16px' }}>
                                            {language === 'mk' ? 'Ве молиме обидете се повторно.' : 'Please try again.'}
                                        </div>
                                    ) : (
                                        <div style={{ color: 'var(--color-text-subtle)' }}>
                                            {t.sent[language]}...
                                        </div>
                                    )}
                                </div>

                                {/* Order Summary / Receipt */}
                                <div style={{ background: 'var(--bg-surface-secondary)', padding: '24px', borderRadius: '24px' }}>
                                    <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: 700, opacity: 0.8 }}>
                                        {language === 'mk' ? 'Вашата нарачка' : 'Receipt'}
                                    </h3>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                        {activeOrder?.items?.map((item, idx) => (
                                            <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '15px' }}>
                                                <div style={{ display: 'flex', gap: '8px' }}>
                                                    <span style={{ fontWeight: 600 }}>{item.quantity}x</span>
                                                    <span>{item.name[language] || item.name.en}</span>
                                                </div>
                                                <span>{formatPrice(item.price * item.quantity, currency)}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <div style={{ borderTop: '1px dashed var(--border-color)', marginTop: '16px', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '18px' }}>
                                        <span>Total</span>
                                        <span>{formatPrice(activeOrder?.total || 0, currency)}</span>
                                    </div>
                                </div>

                                <button
                                    onClick={handleCloseFinal}
                                    style={{
                                        marginTop: 'auto',
                                        background: 'transparent',
                                        border: '1px solid var(--border-color)',
                                        padding: '16px',
                                        borderRadius: '100px',
                                        color: 'var(--color-ink)',
                                        fontSize: '14px',
                                        fontWeight: 600,
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '8px'
                                    }}
                                >
                                    {t.close[language]}
                                </button>
                            </motion.div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default OrderModal;
