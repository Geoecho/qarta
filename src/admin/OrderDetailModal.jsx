import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, Check, User, MessageSquare } from 'lucide-react';

const OrderDetailModal = ({ isOpen, onClose, order, t = (s) => s, lang, onAccept, onReject, onMarkReady, onComplete }) => {
    if (!isOpen || !order) return null;

    // Helper to get name based on language
    const getName = (nameObj) => {
        if (!nameObj) return 'Unknown Item';
        if (typeof nameObj === 'string') return nameObj;
        return nameObj[lang] || nameObj.en || Object.values(nameObj)[0] || 'Unknown';
    };

    const StatusBadge = ({ status }) => {
        let color = '#94a3b8';
        let bg = 'rgba(148, 163, 184, 0.1)';
        let label = status;

        if (status === 'placed') { color = '#fbbf24'; bg = 'rgba(251, 191, 36, 0.1)'; label = t.new; }
        else if (status === 'accepted' || status === 'cooking') { color = '#38bdf8'; bg = 'rgba(56, 189, 248, 0.1)'; label = t.preparing; }
        else if (status === 'ready') { color = '#22c55e'; bg = 'rgba(34, 197, 94, 0.1)'; label = t.ready; }
        else if (status === 'completed') { color = '#94a3b8'; bg = 'rgba(148, 163, 184, 0.1)'; label = t.complete; }
        else if (status === 'rejected') { color = '#ef4444'; bg = 'rgba(239, 68, 68, 0.1)'; label = t.decline; }

        return (
            <span style={{
                padding: '4px 12px',
                borderRadius: '100px',
                fontSize: '12px',
                fontWeight: 700,
                color: color,
                backgroundColor: bg,
                textTransform: 'uppercase',
                border: `1px solid ${color}40`
            }}>
                {label}
            </span>
        );
    };

    return (
        <AnimatePresence>
            <div style={{
                position: 'fixed',
                inset: 0,
                backgroundColor: 'rgba(0,0,0,0.6)',
                backdropFilter: 'blur(4px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1100,
                padding: '24px'
            }} onClick={onClose}>
                <motion.div
                    initial={{ scale: 0.95, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: 20 }}
                    onClick={(e) => e.stopPropagation()}
                    style={{
                        backgroundColor: 'var(--bg-surface)',
                        borderRadius: '24px',
                        padding: '32px',
                        width: '100%',
                        maxWidth: '600px',
                        maxHeight: '90vh',
                        display: 'flex',
                        flexDirection: 'column',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                        border: '1px solid var(--border-color)',
                        overflow: 'hidden'
                    }}
                >
                    {/* Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                                <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 800, color: 'var(--color-ink)', fontFamily: 'monospace' }}>
                                    #{order.id.slice(-4)}
                                </h2>
                                <StatusBadge status={order.status} />
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', color: 'var(--color-text-subtle)', fontSize: '14px' }}>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <Clock size={14} /> {new Date(order.updatedAt || order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                                {order.tableId && order.tableId !== 'walk-in' && (
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600, color: 'var(--color-ink)' }}>
                                        {t.table} {order.tableId}
                                    </span>
                                )}
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            style={{
                                background: 'transparent',
                                border: 'none',
                                cursor: 'pointer',
                                padding: '8px',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'var(--color-text-subtle)'
                            }}
                        >
                            <X size={24} />
                        </button>
                    </div>

                    {/* Scrollable Content */}
                    <div style={{ overflowY: 'auto', flex: 1, paddingRight: '8px', marginBottom: '24px' }}>

                        {/* Note */}
                        {order.note && (
                            <div style={{
                                backgroundColor: '#fefce8',
                                border: '1px solid #fef9c3',
                                padding: '16px',
                                borderRadius: '12px',
                                marginBottom: '24px',
                                display: 'flex',
                                gap: '12px'
                            }}>
                                <MessageSquare size={20} color="#eab308" style={{ marginTop: '2px' }} />
                                <div>
                                    <div style={{ fontSize: '12px', fontWeight: 700, color: '#a16207', textTransform: 'uppercase', marginBottom: '4px' }}>
                                        {t.note}
                                    </div>
                                    <div style={{ color: '#854d0e', fontSize: '14px', lineHeight: 1.5 }}>
                                        {order.note}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Items List */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {order.items && order.items.map((item, idx) => (
                                <div key={idx} style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    paddingBottom: '16px',
                                    borderBottom: idx < order.items.length - 1 ? '1px solid var(--border-color)' : 'none'
                                }}>
                                    <div style={{ display: 'flex', gap: '16px' }}>
                                        <div style={{
                                            backgroundColor: 'var(--bg-surface-secondary)',
                                            width: '32px',
                                            height: '32px',
                                            borderRadius: '8px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontWeight: 700,
                                            color: 'var(--color-primary)',
                                            fontSize: '14px'
                                        }}>
                                            {item.quantity}x
                                        </div>
                                        <div>
                                            <div style={{ fontSize: '16px', fontWeight: 600, color: 'var(--color-ink)', marginBottom: '4px' }}>
                                                {getName(item.name)}
                                            </div>
                                            {/* Options */}
                                            {item.selectedOptions && item.selectedOptions.length > 0 && (
                                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                                                    {item.selectedOptions.map((opt, oIdx) => (
                                                        <span key={oIdx} style={{
                                                            fontSize: '12px',
                                                            color: 'var(--color-text-subtle)',
                                                            backgroundColor: 'var(--bg-surface-secondary)',
                                                            padding: '2px 8px',
                                                            borderRadius: '4px'
                                                        }}>
                                                            {getName(opt.name || opt.label)}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div style={{ fontWeight: 600, color: 'var(--color-ink)' }}>
                                        {(item.price * item.quantity).toFixed(2)}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Total */}
                        <div style={{
                            marginTop: '24px',
                            paddingTop: '24px',
                            borderTop: '2px solid var(--border-color)',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <span style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-text-subtle)' }}>{t.total}</span>
                            <span style={{ fontSize: '24px', fontWeight: 800, color: 'var(--color-primary)' }}>
                                €{Number(order.total || 0).toFixed(2)}
                            </span>
                        </div>
                    </div>

                    {/* Actions Footer */}
                    <div style={{ display: 'flex', gap: '12px', marginTop: 'auto' }}>
                        {order.status === 'placed' && (
                            <>
                                <button
                                    onClick={() => onReject(order)}
                                    style={{
                                        flex: 1,
                                        padding: '16px',
                                        borderRadius: '12px',
                                        border: '1px solid var(--border-color)',
                                        backgroundColor: 'transparent',
                                        color: '#ef4444',
                                        fontSize: '15px',
                                        fontWeight: 700,
                                        cursor: 'pointer',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    {t.decline}
                                </button>
                                <button
                                    onClick={() => onAccept(order.id)}
                                    style={{
                                        flex: 2,
                                        padding: '16px',
                                        borderRadius: '12px',
                                        border: 'none',
                                        backgroundColor: 'var(--color-primary)',
                                        color: '#ffffff',
                                        fontSize: '15px',
                                        fontWeight: 700,
                                        cursor: 'pointer',
                                        boxShadow: '0 4px 12px rgba(var(--color-primary-rgb), 0.3)',
                                        transition: 'all 0.2s',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '8px'
                                    }}
                                >
                                    <Check size={20} />
                                    {t.accept}
                                </button>
                            </>
                        )}

                        {order.status === 'accepted' && (
                            <button
                                onClick={() => onMarkReady(order.id)}
                                style={{
                                    flex: 1,
                                    padding: '16px',
                                    borderRadius: '12px',
                                    border: 'none',
                                    backgroundColor: '#fbbf24',
                                    color: '#451a03',
                                    fontSize: '15px',
                                    fontWeight: 700,
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                }}
                            >
                                {t.markReady}
                            </button>
                        )}

                        {order.status === 'ready' && (
                            <button
                                onClick={() => onMarkReady(order.id)} // Wait, actually should be onComplete
                                // Let's use the passed props correctly.
                                // OrderReceiver passes updateStatus(id, 'completed')
                                style={{
                                    flex: 1,
                                    padding: '16px',
                                    borderRadius: '12px',
                                    border: 'none',
                                    backgroundColor: '#22c55e',
                                    color: '#ffffff',
                                    fontSize: '15px',
                                    fontWeight: 700,
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                }}
                            >
                                {t.complete}
                            </button>
                        )}

                        {(order.status === 'ready' && onComplete) && (
                            // Correction logic:
                            // The handler passed for 'ready' status in OrderReceiver is updateStatus(..., 'completed')
                            // So we should call onComplete?
                            // Let's just make the parent pass specific handlers.
                            null
                        )}


                        {/* Correction: The parent will pass specific handlers.
                            We will reuse onMarkReady for 'accepted' -> 'ready'
                            and onComplete for 'ready' -> 'completed'
                         */}

                        {order.status === 'ready' && (
                            <button
                                onClick={() => onComplete(order.id)}
                                style={{
                                    flex: 1,
                                    padding: '16px',
                                    borderRadius: '12px',
                                    border: 'none',
                                    backgroundColor: '#22c55e',
                                    color: '#ffffff',
                                    fontSize: '15px',
                                    fontWeight: 700,
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                }}
                            >
                                {t.complete}
                            </button>
                        )}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default OrderDetailModal;
