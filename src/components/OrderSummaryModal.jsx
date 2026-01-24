import React from 'react';
import { motion, AnimatePresence, useDragControls } from 'framer-motion';
import { X, Minus, Plus, Trash2, CheckCircle, Bell, Flame } from 'lucide-react';
import { useOrder } from '../contexts/OrderContext';
import { formatPrice } from '../utils/currencyHelper';
import AnimatedPrice from './AnimatedPrice';

import { CLIENT_TRANSLATIONS } from '../utils/clientTranslations';

const OrderSummaryModal = ({ isOpen, onClose, language = 'en' }) => {
    const { cart, updateQuantity, removeFromCart, totalPrice, placeOrder, clearCart, orderStatus, activeOrder, resetOrder, cancelOrder, editOrder, isEditing, tableId } = useOrder();
    const currency = language === 'mk' ? 'MKD' : 'EUR';
    const t = CLIENT_TRANSLATIONS[language] || CLIENT_TRANSLATIONS['en'];
    const dragControls = useDragControls();

    // If order is confirmed, we keep the modal open but show success state
    // If order is waiting, we show loading

    const [orderNote, setOrderNote] = React.useState('');

    // Safety lock for Confirm Button to prevent accidental clicks when switching from Edit -> Idle
    const [isSafetyLocked, setIsSafetyLocked] = React.useState(false);

    // Sync Note when entering Edit Mode
    React.useEffect(() => {
        if (orderStatus === 'idle' && activeOrder?.note) {
            setOrderNote(activeOrder.note);
        }
    }, [orderStatus, activeOrder?.id]);

    React.useEffect(() => {
        if (orderStatus === 'idle') {
            setIsSafetyLocked(true);
            const timer = setTimeout(() => setIsSafetyLocked(false), 800); // 800ms Safety Delay
            return () => clearTimeout(timer);
        }
    }, [orderStatus]);

    // Scroll Lock
    React.useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    const handlePlaceOrder = () => {
        if (isSafetyLocked) return;
        placeOrder(orderNote);
        // Do NOT close immediately. Let the status change drive UI.
    };

    // Helper to determine what to show based on REAL database status
    const dbStatus = activeOrder?.status || 'placed'; // Default to placed if undefined

    const getStatusContent = () => {
        // 1. SENT / WAITING
        if (orderStatus === 'waiting' || (dbStatus === 'placed' && orderStatus !== 'idle')) {
            return {
                title: t.orderSent,
                icon: (
                    <motion.div
                        animate={{ scale: [1, 1.1, 1], opacity: [0.7, 1, 0.7] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--color-item-price)15', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                        <CheckCircle size={32} color="var(--color-item-price)" />
                    </motion.div>
                ),
                desc: t.orderSentDesc,
                color: 'var(--color-item-price)',
                canCancel: true,
                stepIndex: 0
            };
        }
        // 2. COOKING / ACCEPTED
        if (dbStatus === 'accepted' || dbStatus === 'cooking') {
            return {
                title: t.preparing,
                icon: (
                    <motion.div
                        animate={{ rotate: [-5, 5, -5], scale: [1, 1.1, 1] }}
                        transition={{ repeat: Infinity, duration: 1 }}
                        style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--color-item-price)15', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                        <Flame size={32} color="var(--color-item-price)" />
                    </motion.div>
                ),
                desc: t.preparingDesc,
                color: 'var(--color-item-price)',
                showLikeInteract: true,
                stepIndex: 1
            };
        }
        // 3. READY / COMPLETED
        if (dbStatus === 'ready' || dbStatus === 'completed') {
            return {
                title: dbStatus === 'completed' ? (t.orderCompleted || "Order Completed") : t.orderReady,
                icon: (
                    <motion.div
                        animate={{ rotate: [-15, 15, -15, 15, 0] }}
                        transition={{ repeat: Infinity, duration: 1.5, repeatDelay: 1 }}
                        style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--color-item-price)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}
                    >
                        <Bell size={32} fill="white" />
                    </motion.div>
                ),
                desc: dbStatus === 'completed' ? (t.completedDesc || "Enjoy your meal!") : t.readyDesc,
                color: 'var(--color-item-price)',
                stepIndex: 2
            };
        }
        // 4. DECLINED
        if (dbStatus === 'cancelled') {
            return {
                title: language === 'mk' ? 'Нарачката е одбиена' : (language === 'sq' ? 'Porosia u refuzua' : 'Order Declined'),
                icon: <X size={48} strokeWidth={3} color="var(--color-ink)" />,
                desc: activeOrder?.declineReason
                    ? `Reason: ${activeOrder.declineReason}`
                    : (language === 'mk' ? 'Ресторанот не може да ја прифати вашата нарачка.' : (language === 'sq' ? 'Restoranti nuk mund ta pranojë porosinë tuaj.' : 'The restaurant could not accept your order.')),
                color: 'var(--color-ink)', // Match background/ink, no red
                isError: true,
                stepIndex: -1,
                canCancel: false // Hides "Edit Order" button, we use "Try Again" instead
            };
        }
        return { title: 'Order Placed', icon: null, desc: '', stepIndex: 0 };
    };

    const statusContent = getStatusContent();

    const handleClose = () => {
        // Do NOT reset order when closing. Let user check status via Floating Pill.
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
                        onClick={onClose}
                        style={{
                            position: 'fixed',
                            inset: 0,
                            backgroundColor: 'rgba(0,0,0,0.85)', // Increased opacity
                            zIndex: 200,
                            overscrollBehavior: 'contain' // Prevent body scroll
                        }}
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        transition={{ type: 'spring', damping: 28, stiffness: 350 }}
                        drag="y"
                        dragControls={dragControls}
                        dragListener={false} // Only drag via handle
                        dragConstraints={{ top: 0, bottom: 0 }}
                        dragElastic={{ top: 0, bottom: 0.2 }}
                        onDragEnd={(e, { offset, velocity }) => {
                            if (offset.y > 100 || velocity.y > 500) handleClose();
                        }}
                        style={{
                            position: 'fixed',
                            inset: 0,
                            top: 'auto',
                            maxHeight: '85vh',
                            display: 'flex',
                            flexDirection: 'column',
                            backgroundColor: 'var(--bg-modal-card, var(--bg-app))',
                            color: 'var(--color-ink)',
                            borderTopLeftRadius: '32px',
                            borderTopRightRadius: '32px',
                            zIndex: 201,
                            border: '1px solid var(--border-color)', // Added border for separation
                            boxShadow: '0 -10px 40px rgba(0,0,0,0.3)' // Added shadow for depth
                        }}
                    >
                        {/* Drag Handle for Swipe Down */}
                        <div
                            onPointerDown={(e) => dragControls.start(e)}
                            style={{
                                width: '100%',
                                display: 'flex',
                                justifyContent: 'center',
                                paddingTop: '20px', // Larger touch target
                                paddingBottom: '12px',
                                cursor: 'grab',
                                touchAction: 'none',
                                flexShrink: 0
                            }}
                        >
                            <div style={{
                                width: '48px',
                                height: '5px',
                                borderRadius: '100px',
                                backgroundColor: 'var(--color-text-subtle)', // Visible in both modes
                                opacity: 0.3
                            }}></div>
                        </div>

                        {/* Content Switcher */}
                        <div style={{ flex: 1, overflowY: 'auto', padding: '0 0 24px 0', display: 'flex', flexDirection: 'column' }}>
                            {/* Show status view if orderStatus is not idle OR if there's an active order that's not 'placed' AND we are not editing */}
                            {((orderStatus !== 'idle' || (activeOrder && activeOrder.status !== 'placed')) && !isEditing) ? (
                                <div style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '8px'
                                }}>
                                    {/* Table Number Header */}
                                    {orderStatus === 'idle' && (
                                        <div style={{
                                            textAlign: 'center',
                                            padding: '16px 0 8px 0',
                                            color: 'var(--color-ink)',
                                            fontWeight: 700,
                                            fontSize: '15px'
                                        }}>
                                            {tableId && tableId !== 'walk-in' ? (
                                                <span style={{
                                                    background: 'var(--bg-surface-secondary)',
                                                    padding: '6px 12px',
                                                    borderRadius: '100px',
                                                    border: '1px solid var(--border-color)',
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    gap: '6px'
                                                }}>
                                                    📍 {language === 'mk' ? 'Маса' : (language === 'sq' ? 'Tavolina' : 'Table')} {tableId}
                                                </span>
                                            ) : (
                                                <span style={{ color: 'var(--color-text-subtle)', fontSize: '13px' }}>
                                                    {language === 'mk' ? 'Нарачка за носење' : (language === 'sq' ? 'Porosi për të marrë' : 'Takeaway / Walk-in')}
                                                </span>
                                            )}
                                        </div>
                                    )}
                                    {/* Header with Gradient */}
                                    {/* CINEMATIC STATUS HERO */}
                                    <div style={{
                                        padding: '40px 24px 32px 24px',
                                        backgroundColor: 'transparent',
                                        borderBottom: '1px solid var(--border-color)',
                                        textAlign: 'center',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        gap: '16px',
                                        position: 'relative',
                                        overflow: 'hidden'
                                    }}>
                                        {/* Status Icon Center with Modern Float Animation */}
                                        <motion.div
                                            animate={{ y: [0, -8, 0] }}
                                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                            style={{ marginBottom: '8px' }}
                                        >
                                            {statusContent.icon}
                                        </motion.div>

                                        <div style={{ zIndex: 1, position: 'relative' }}>
                                            <h3 style={{
                                                margin: '0 0 4px 0',
                                                fontSize: '24px',
                                                fontWeight: 800,
                                                fontWeight: 800,
                                                color: 'var(--color-ink)',
                                                letterSpacing: '-0.5px'
                                            }}>
                                                {statusContent.title}
                                            </h3>
                                            <p style={{
                                                margin: 0,
                                                color: 'var(--color-text-subtle)',
                                                fontSize: '15px',
                                                fontWeight: 500,
                                                lineHeight: 1.4,
                                                maxWidth: '280px',
                                                marginLeft: 'auto',
                                                marginRight: 'auto'
                                            }}>
                                                {statusContent.desc}
                                            </p>
                                        </div>
                                    </div>

                                    {/* MODERN STEPPER */}
                                    {!statusContent.isError && (
                                        <div style={{ padding: '0 16px', marginTop: '-12px', zIndex: 2 }}>
                                            <div style={{
                                                backgroundColor: 'var(--bg-modal-card)',
                                                borderRadius: '20px',
                                                padding: '20px 12px',
                                                boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                gap: '16px'
                                            }}>
                                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
                                                    {/* Progress Track (Base + Active) */}
                                                    <div style={{
                                                        position: 'absolute',
                                                        top: '16px',
                                                        left: '16px',
                                                        right: '16px',
                                                        height: '4px',
                                                        zIndex: 1
                                                    }}>
                                                        {/* Base Line */}
                                                        <div style={{
                                                            position: 'absolute',
                                                            inset: 0,
                                                            backgroundColor: 'var(--bg-surface-secondary)',
                                                            borderRadius: '2px'
                                                        }} />

                                                        {/* Active Progress Line */}
                                                        <motion.div
                                                            initial={{ width: 0 }}
                                                            animate={{ width: `${(statusContent.stepIndex / 2) * 100}%` }}
                                                            transition={{ duration: 1, ease: "circOut" }}
                                                            style={{
                                                                position: 'absolute',
                                                                top: 0,
                                                                left: 0,
                                                                bottom: 0,
                                                                backgroundColor: 'var(--color-item-price)',
                                                                borderRadius: '2px'
                                                            }}
                                                        />
                                                    </div>

                                                    {/* Steps */}
                                                    {[0, 1, 2].map((step) => {
                                                        const isActive = step <= statusContent.stepIndex;
                                                        const isCurrent = step === statusContent.stepIndex;
                                                        return (
                                                            <div key={step} style={{ zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                                                                <motion.div
                                                                    animate={{
                                                                        scale: isCurrent ? 1.2 : 1,
                                                                        backgroundColor: isActive ? 'var(--color-item-price)' : 'var(--bg-surface-secondary)',
                                                                        borderColor: isCurrent ? 'var(--bg-modal-card)' : 'transparent'
                                                                    }}
                                                                    style={{
                                                                        width: '32px',
                                                                        height: '32px',
                                                                        borderRadius: '50%',
                                                                        display: 'flex',
                                                                        alignItems: 'center',
                                                                        justifyContent: 'center',
                                                                        color: isActive ? 'white' : 'var(--color-text-subtle)',
                                                                        border: '3px solid transparent',
                                                                        transition: 'background-color 0.3s'
                                                                    }}
                                                                >
                                                                    {step === 0 && <CheckCircle size={16} />}
                                                                    {step === 1 && <Flame size={16} />}
                                                                    {step === 2 && <Bell size={16} />}
                                                                </motion.div>
                                                                <span style={{
                                                                    fontSize: '12px',
                                                                    fontWeight: 700,
                                                                    color: isActive ? 'var(--color-ink)' : 'var(--color-text-subtle)',
                                                                    opacity: isActive ? 1 : 0.6
                                                                }}>
                                                                    {step === 0 ? 'Sent' : (step === 1 ? 'Prep' : 'Ready')}
                                                                </span>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Order Items List for Confirmation */}
                                    <div style={{
                                        width: '100%',
                                        padding: '0 24px',
                                        background: 'transparent',
                                        borderRadius: '0',
                                        textAlign: 'left',
                                        margin: '0'
                                    }}>
                                        {/* Removed "Your Order" Header as requested */}
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                            {((activeOrder?.items && activeOrder.items.length > 0) ? activeOrder.items : cart).map((item, i) => (
                                                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '15px', color: 'var(--color-ink)' }}>
                                                    <span style={{ flex: 1, paddingRight: '12px', display: 'flex', gap: '12px', alignItems: 'center' }}>
                                                        <span style={{
                                                            fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                            background: 'var(--bg-surface-secondary)', width: '28px', height: '28px', borderRadius: '8px', fontSize: '13px'
                                                        }}>
                                                            {item.quantity}
                                                        </span>
                                                        <span style={{ fontWeight: 500 }}>
                                                            {typeof item.name === 'object' ? (item.name?.[language] || item.name?.en || '...') : (item.name || '...')}
                                                        </span>
                                                    </span>
                                                    <span style={{ fontWeight: 600, whiteSpace: 'nowrap' }}>
                                                        <AnimatedPrice value={(Number(item.price || 0) + (item.selectedOptions?.reduce((s, o) => s + Number(o.price || 0), 0) || 0)) * Number(item.quantity || 1)} currency={currency} />
                                                    </span>
                                                </div>
                                            ))}

                                            {/* Divider */}
                                            <div style={{ height: '1px', background: 'var(--border-color)', margin: '8px 0' }} />

                                            {/* Total */}
                                            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '18px', color: 'var(--color-ink)' }}>
                                                <span>Total</span>
                                                <span><AnimatedPrice value={Number(activeOrder?.total || totalPrice || 0)} currency={currency} /></span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : cart.length === 0 ? (
                                <div style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flex: 1,
                                    color: 'var(--color-text-subtle)',
                                    gap: '16px',
                                    padding: '40px 24px'
                                }}>
                                    <div style={{ fontSize: '48px', opacity: 0.5 }}>🛒</div>
                                    <p style={{ margin: 0, fontSize: '16px', fontWeight: 500 }}>{t.emptyCart}</p>
                                </div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', padding: '0 24px', paddingTop: '32px' }}>
                                    {cart.map((item, idx) => {
                                        // Calculate item total including options
                                        const optionTotal = (item.selectedOptions || []).reduce((acc, opt) => acc + opt.price, 0);
                                        const unitPrice = item.price + optionTotal;
                                        const itemTotal = unitPrice * item.quantity;

                                        return (
                                            <div key={`${item.id}-${idx}`} style={{
                                                display: 'flex',
                                                alignItems: 'flex-start',
                                                gap: '16px'
                                            }}>
                                                {/* Left: Info & Options */}
                                                <div style={{ flex: 1 }}>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                                        <span style={{ fontWeight: 700, fontSize: '16px', lineHeight: 1.4 }}>
                                                            {item.name?.[language] || item.name?.['en'] || item.name}
                                                        </span>
                                                        <span style={{ fontWeight: 700, fontSize: '16px', color: 'var(--color-item-price)' }}>
                                                            <AnimatedPrice value={itemTotal} currency={currency} />
                                                        </span>
                                                    </div>

                                                    {item.selectedOptions && item.selectedOptions.length > 0 && (
                                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '12px' }}>
                                                            {item.selectedOptions.map(opt => (
                                                                <span key={opt.id} style={{
                                                                    fontSize: '12px',
                                                                    fontWeight: 500,
                                                                    color: 'var(--color-text-subtle)',
                                                                    background: 'var(--bg-surface-secondary)',
                                                                    padding: '4px 8px',
                                                                    borderRadius: '6px'
                                                                }}>
                                                                    {opt.label?.[language] || opt.label?.['en']}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    )}

                                                    {/* Controls Row */}
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                        {/* Horizontal Quantity Pill */}
                                                        <div style={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            backgroundColor: 'var(--bg-control-secondary)',
                                                            borderRadius: '22px', // Matches Search Bar style but for smaller pill
                                                            padding: '0 4px',
                                                            height: '44px', // 44px Minimum Tap Size
                                                            gap: '16px',
                                                            border: '1px solid var(--border-color)'
                                                        }}>
                                                            <motion.button
                                                                whileTap={{ scale: 0.85 }}
                                                                onClick={() => {
                                                                    const itemKey = item.cartItemKey || item.id;
                                                                    item.quantity > 1 ? updateQuantity(itemKey, -1) : removeFromCart(itemKey);
                                                                }}
                                                                style={{
                                                                    width: '40px',
                                                                    height: '40px',
                                                                    borderRadius: '50%',
                                                                    background: 'var(--bg-app)',
                                                                    border: '1px solid var(--border-color)',
                                                                    cursor: 'pointer',
                                                                    color: item.quantity === 1 ? 'var(--color-getError, #ef4444)' : 'var(--color-item-price)',
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    justifyContent: 'center',
                                                                    boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                                                                }}
                                                            >
                                                                {item.quantity === 1 ? <Trash2 size={18} /> : <Minus size={18} />}
                                                            </motion.button>

                                                            <span style={{ fontSize: '14px', fontWeight: 800, minWidth: '14px', textAlign: 'center', color: 'var(--color-ink)' }}>
                                                                {item.quantity}
                                                            </span>

                                                            <motion.button
                                                                whileTap={{ scale: 0.85 }}
                                                                onClick={() => {
                                                                    const itemKey = item.cartItemKey || item.id;
                                                                    updateQuantity(itemKey, 1);
                                                                }}
                                                                style={{
                                                                    width: '40px',
                                                                    height: '40px',
                                                                    borderRadius: '50%',
                                                                    background: 'var(--bg-app)',
                                                                    border: '1px solid var(--border-color)',
                                                                    cursor: 'pointer',
                                                                    color: 'var(--color-item-price)',
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    justifyContent: 'center',
                                                                    boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                                                                }}
                                                            >
                                                                <Plus size={18} />
                                                            </motion.button>
                                                        </div>

                                                        {/* Unit Price Helper */}
                                                        {item.quantity > 1 && (
                                                            <span style={{ fontSize: '13px', color: 'var(--color-text-subtle)' }}>
                                                                {formatPrice(unitPrice, currency)}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}

                                    <div style={{ padding: '4px 0' }}>
                                        <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '8px', color: 'var(--color-ink)' }}>
                                            {language === 'mk' ? 'Забелешка за кујна' : 'Note to Kitchen'}
                                        </label>
                                        <textarea
                                            value={orderNote}
                                            onChange={(e) => setOrderNote(e.target.value)}
                                            placeholder={language === 'mk' ? 'Пример: Без кромид...' : 'e.g. No onions, extra sauce...'}
                                            style={{
                                                width: '100%',
                                                padding: '12px 16px',
                                                borderRadius: '16px',
                                                border: '1px solid var(--border-color)',
                                                backgroundColor: 'var(--bg-input)',
                                                color: 'var(--color-ink)',
                                                fontSize: '15px',
                                                minHeight: '100px',
                                                resize: 'none',
                                                fontFamily: 'inherit',
                                                outline: 'none',
                                                boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)'
                                            }}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        {(cart.length > 0 || orderStatus !== 'idle') && (
                            <div style={{
                                padding: '24px 24px 34px 24px', // Extra bottom padding for iOS home indicator
                                backgroundColor: 'var(--bg-modal-card)',
                                borderTop: '1px solid var(--border-color)',
                                boxShadow: 'none'
                            }}>
                                {orderStatus === 'idle' && (
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '20px' }}>
                                        <span style={{ fontSize: '16px', fontWeight: 500, color: 'var(--color-text-subtle)' }}>{t.total}</span>
                                        <span style={{ fontSize: '28px', fontWeight: 800, color: 'var(--color-ink)', lineHeight: 1 }}>
                                            <AnimatedPrice value={totalPrice} currency={currency} />
                                        </span>
                                    </div>
                                )}

                                {/* Hide Confirm Button entirely if Order is NOT idle OR if order is already accepted/ready/completed */}
                                {orderStatus === 'idle' && (!activeOrder || dbStatus === 'placed' || dbStatus === 'cancelled') && (
                                    <motion.button
                                        whileTap={{ scale: isSafetyLocked ? 1 : 0.98 }}
                                        onClick={() => !isSafetyLocked && handlePlaceOrder()}
                                        style={{
                                            width: '100%',
                                            height: '56px',
                                            borderRadius: '100px', // Fully Rounded Pill
                                            backgroundColor: isSafetyLocked ? 'var(--bg-control-secondary)' : 'var(--color-item-price)',
                                            color: isSafetyLocked ? 'var(--color-text-subtle)' : '#fff',
                                            border: 'none',
                                            fontSize: '18px',
                                            fontWeight: 700,
                                            cursor: isSafetyLocked ? 'default' : 'pointer',
                                            boxShadow: 'none',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '12px',
                                            opacity: isSafetyLocked ? 0.6 : 1,
                                            transition: 'all 0.2s'
                                        }}
                                        disabled={isSafetyLocked}
                                    >
                                        {t.confirmOrder || 'Confirm Order'}
                                    </motion.button>
                                )}

                                {/* Show "Start New Order" if Status is Ready or Completed */}
                                {orderStatus === 'confirmed' && (dbStatus === 'ready' || dbStatus === 'completed') && (
                                    <motion.button
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => {
                                            resetOrder();
                                            clearCart(); // Explicitly clear items
                                            onClose();
                                        }}
                                        style={{
                                            width: '100%',
                                            height: '56px',
                                            borderRadius: '100px',
                                            backgroundColor: 'var(--bg-surface-secondary)',
                                            color: 'var(--color-ink)',
                                            border: 'none',
                                            fontSize: '18px',
                                            fontWeight: 700,
                                            cursor: 'pointer',
                                            boxShadow: 'none',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '12px',
                                            marginTop: '16px'
                                        }}
                                    >
                                        <span>Start New Order</span>
                                    </motion.button>
                                )}

                                {/* Show "Declined" State */}
                                {orderStatus === 'confirmed' && dbStatus === 'cancelled' && (
                                    <motion.button
                                        initial={{ scale: 0.9, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => {
                                            // Maybe allow them to edit and retry?
                                            // "Try Again" -> Edit Mode
                                            editOrder();
                                        }}
                                        style={{
                                            width: '100%',
                                            height: '56px',
                                            borderRadius: '100px',
                                            backgroundColor: 'var(--color-item-price)',
                                            color: '#fff',
                                            border: 'none',
                                            fontSize: '18px',
                                            fontWeight: 700,
                                            cursor: 'pointer',
                                            boxShadow: 'none',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '12px',
                                            marginTop: '16px'
                                        }}
                                    >
                                        <span>{t.tryAgain || 'Try Again'}</span>
                                    </motion.button>
                                )}
                                {/* Show "Edit Order" if Status is Sent/Waiting */}
                                {(statusContent.canCancel) && (
                                    <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                                        {/* Edit Order Button */}
                                        <motion.button
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => {
                                                editOrder(); // effectively "Edit" keeping ID
                                                // Modal stays open, but status becomes idle -> shows cart again
                                            }}
                                            style={{
                                                flex: 1,
                                                height: '48px',
                                                borderRadius: '100px', // Round
                                                backgroundColor: 'var(--bg-surface-secondary)',
                                                color: 'var(--color-ink)',
                                                border: '1px solid var(--border-color)',
                                                fontSize: '15px',
                                                fontWeight: 600,
                                                cursor: 'pointer',
                                                boxShadow: 'none',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                gap: '8px'
                                            }}
                                        >
                                            <span>{t.editOrder}</span>
                                        </motion.button>

                                        {/* Cancel Order Button */}
                                        <motion.button
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => {
                                                if (window.confirm('Are you sure you want to cancel this order?')) {
                                                    cancelOrder();
                                                    onClose();
                                                }
                                            }}
                                            style={{
                                                flex: 1,
                                                height: '48px',
                                                borderRadius: '100px', // Round
                                                backgroundColor: 'rgba(239, 68, 68, 0.1)', // Red tint
                                                color: '#ef4444',
                                                border: '1px solid rgba(239, 68, 68, 0.2)',
                                                fontSize: '15px',
                                                fontWeight: 600,
                                                cursor: 'pointer',
                                                boxShadow: 'none',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                gap: '8px'
                                            }}
                                        >
                                            <span>{t.cancelOrder}</span>
                                        </motion.button>
                                    </div>
                                )}
                            </div>
                        )}
                    </motion.div>
                </>
            )
            }
        </AnimatePresence >
    );
};

export default OrderSummaryModal;
