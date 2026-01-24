import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertTriangle, MessageSquare, Clock } from 'lucide-react';

const RejectionModal = ({ isOpen, onClose, onConfirm, t = (s) => s }) => {
    const [selectedReason, setSelectedReason] = useState(null);
    const [customReason, setCustomReason] = useState('');

    if (!isOpen) return null;

    const reasons = [
        { id: 'kitchen_busy', icon: Clock, label: t.kitchenBusy || "Kitchen is too busy" },
        { id: 'out_of_stock', icon: AlertTriangle, label: t.outOfStock || "Items out of stock" },
        { id: 'closing_soon', icon: Clock, label: t.closingSoon || "Closing soon" },
        { id: 'custom', icon: MessageSquare, label: t.otherReason || "Other reason" }
    ];

    const handleConfirm = () => {
        const finalReason = selectedReason === 'custom' ? customReason : reasons.find(r => r.id === selectedReason)?.label;
        if (finalReason) {
            onConfirm(finalReason);
            onClose();
            // Reset state
            setSelectedReason(null);
            setCustomReason('');
        }
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
            }}>
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
                        maxWidth: '480px',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                        border: '1px solid var(--border-color)'
                    }}
                >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                        <div>
                            <h2 style={{ margin: '0 0 8px 0', fontSize: '24px', fontWeight: 700, color: 'var(--color-ink)' }}>
                                {t.rejectOrder || "Reject Order"}
                            </h2>
                            <p style={{ margin: 0, color: 'var(--color-text-subtle)' }}>
                                {t.selectReason || "Please select a reason for rejection"}
                            </p>
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

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' }}>
                        {reasons.slice(0, 3).map((reason) => (
                            <button
                                key={reason.id}
                                onClick={() => setSelectedReason(reason.id)}
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    padding: '16px',
                                    borderRadius: '16px',
                                    border: selectedReason === reason.id ? '2px solid var(--color-primary)' : '1px solid var(--border-color)',
                                    backgroundColor: selectedReason === reason.id ? 'var(--bg-surface-secondary)' : 'transparent',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    color: selectedReason === reason.id ? 'var(--color-primary)' : 'var(--color-ink)'
                                }}
                            >
                                <reason.icon size={24} style={{ marginBottom: '8px' }} />
                                <span style={{ fontSize: '13px', fontWeight: 600, textAlign: 'center' }}>{reason.label}</span>
                            </button>
                        ))}
                        <button
                            onClick={() => setSelectedReason('custom')}
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                padding: '16px',
                                borderRadius: '16px',
                                border: selectedReason === 'custom' ? '2px solid var(--color-primary)' : '1px solid var(--border-color)',
                                backgroundColor: selectedReason === 'custom' ? 'var(--bg-surface-secondary)' : 'transparent',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                color: selectedReason === 'custom' ? 'var(--color-primary)' : 'var(--color-ink)'
                            }}
                        >
                            <MessageSquare size={24} style={{ marginBottom: '8px' }} />
                            <span style={{ fontSize: '13px', fontWeight: 600, textAlign: 'center' }}>{t.other || "Other"}</span>
                        </button>
                    </div>

                    <AnimatePresence>
                        {selectedReason === 'custom' && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                style={{ overflow: 'hidden', marginBottom: '24px' }}
                            >
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '8px', color: 'var(--color-ink)' }}>
                                    {t.customReasonLabel || "Reason explanation (visible to customer)"}
                                </label>
                                <textarea
                                    value={customReason}
                                    onChange={(e) => setCustomReason(e.target.value)}
                                    placeholder={t.customReasonPlaceholder || "e.g., We are out of fresh salmon..."}
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        borderRadius: '12px',
                                        border: '1px solid var(--border-color)',
                                        minHeight: '80px',
                                        fontSize: '14px',
                                        resize: 'none',
                                        fontFamily: 'inherit',
                                        backgroundColor: 'var(--bg-app)'
                                    }}
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                        <button
                            onClick={onClose}
                            style={{
                                padding: '12px 24px',
                                borderRadius: '100px',
                                border: 'none',
                                backgroundColor: 'var(--bg-surface-secondary)',
                                color: 'var(--color-ink)',
                                fontWeight: 600,
                                cursor: 'pointer',
                                fontSize: '15px'
                            }}
                        >
                            {t.cancel || "Cancel"}
                        </button>
                        <button
                            onClick={handleConfirm}
                            disabled={!selectedReason || (selectedReason === 'custom' && !customReason.trim())}
                            style={{
                                padding: '12px 24px',
                                borderRadius: '100px',
                                border: 'none',
                                backgroundColor: '#ef4444', // Red for rejection
                                color: 'white',
                                fontWeight: 600,
                                cursor: selectedReason ? 'pointer' : 'not-allowed',
                                opacity: selectedReason ? 1 : 0.5,
                                fontSize: '15px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}
                        >
                            {t.confirmReject || "Reject Order"}
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default RejectionModal;
