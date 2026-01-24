// Table QR Code Generator Modal Component
// This component generates QR codes for table numbers with optional secure tokens
// Usage: Add this to AdminDashboard.jsx after the QRCodeModal component

import React, { useState } from 'react';
import { QRCode } from 'react-qrcode-logo';
import { Download, Lock, Shuffle, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const TableQRModal = ({ isOpen, onClose, restaurant, t = s => s }) => {
    const [tableInput, setTableInput] = useState('');
    const [tables, setTables] = useState([]);
    const [isSecureMode, setIsSecureMode] = useState(false);
    const [secureTokens, setSecureTokens] = useState({}); // Map table -> token

    const [qrConfig, setQrConfig] = useState({
        size: 300,
        fgColor: restaurant?.theme?.primary || '#0ea5e9',
        bgColor: '#ffffff',
        qrStyle: 'squares',
        logoImage: restaurant?.logo || '',
        logoWidth: 60,
        logoHeight: 60
    });

    const generateRandomToken = () => {
        return Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 6);
    };

    // Parse table input (e.g., "1,2,3,4,5" or "1-10")
    const generateTables = () => {
        const input = tableInput.trim();
        if (!input) return;

        let tableNumbers = [];

        // Handle range format (e.g., "1-10")
        if (input.includes('-')) {
            const [start, end] = input.split('-').map(n => parseInt(n.trim()));
            if (!isNaN(start) && !isNaN(end) && start <= end) {
                for (let i = start; i <= end; i++) {
                    tableNumbers.push(i.toString());
                }
            }
        }
        // Handle comma-separated format (e.g., "1,2,3,4,5")
        else if (input.includes(',')) {
            tableNumbers = input.split(',')
                .map(n => n.trim())
                .filter(n => n !== '');
        }
        // Handle single number
        else {
            tableNumbers = [input];
        }

        // Generate tokens if secure mode is on
        const newTokens = {};
        tableNumbers.forEach(num => {
            if (isSecureMode) {
                newTokens[num] = generateRandomToken();
            }
        });

        setSecureTokens(newTokens);
        setTables(tableNumbers);
    };

    const downloadQR = (tableNumber) => {
        const canvas = document.getElementById(`qr-table-${tableNumber}`);
        if (canvas) {
            canvas.toBlob((blob) => {
                const url = URL.createObjectURL(blob);
                const downloadLink = document.createElement('a');
                downloadLink.href = url;
                downloadLink.download = `table-${tableNumber}-qr-${restaurant.slug}.png`;
                document.body.appendChild(downloadLink);
                downloadLink.click();
                document.body.removeChild(downloadLink);
                URL.revokeObjectURL(url);
            }, 'image/png');
        }
    };

    const downloadAllQRs = () => {
        tables.forEach((table, index) => {
            setTimeout(() => downloadQR(table), index * 500); // Stagger downloads
        });
    };

    const getTableURL = (tableNumber) => {
        let url = `${window.location.origin}/${restaurant.slug}?table=${tableNumber}`;
        if (isSecureMode && secureTokens[tableNumber]) {
            url += `&token=${secureTokens[tableNumber]}`;
        }
        return url;
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div style={{
                position: 'fixed',
                inset: 0,
                backgroundColor: 'rgba(0,0,0,0.7)',
                backdropFilter: 'blur(4px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000,
                padding: '24px'
            }}>
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    style={{
                        backgroundColor: 'var(--bg-surface)',
                        borderRadius: '24px',
                        maxWidth: '900px',
                        width: '100%',
                        maxHeight: '85vh',
                        overflowY: 'auto',
                        padding: '40px',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                        border: '1px solid var(--border-color)'
                    }}
                >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                        <h2 style={{ margin: 0, fontSize: '28px', fontWeight: 700, letterSpacing: '-0.5px' }}>
                            {t('tableQRGenerator') || 'Table QR Code Generator'}
                        </h2>
                        <button onClick={onClose} style={{
                            background: 'var(--bg-surface-secondary)',
                            border: 'none',
                            borderRadius: '50%',
                            width: '36px',
                            height: '36px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            cursor: 'pointer'
                        }}>
                            <span style={{ fontSize: '20px' }}>×</span>
                        </button>
                    </div>

                    {/* Input Section */}
                    <div style={{ marginBottom: '40px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                            <label style={{ fontSize: '15px', fontWeight: 600, color: 'var(--color-ink)' }}>
                                {t('enterTableNumbers') || 'Enter Table Numbers'}
                            </label>
                            <input
                                className="admin-input"
                                value={tableInput}
                                onChange={(e) => setTableInput(e.target.value)}
                                placeholder="e.g., 1-20 or 1,2,3,4,5"
                                style={{
                                    width: '100%',
                                    padding: '16px',
                                    borderRadius: '12px',
                                    border: '1px solid var(--border-color)',
                                    fontSize: '16px',
                                    backgroundColor: 'var(--bg-app)'
                                }}
                            />
                            <p style={{ margin: 0, fontSize: '13px', color: 'var(--color-text-subtle)' }}>
                                Examples: "1,2,3,4,5" or "1-10" for range
                            </p>
                        </div>

                        {/* Secure Mode Toggle */}
                        <div style={{
                            marginBottom: '24px',
                            padding: '16px',
                            borderRadius: '12px',
                            backgroundColor: isSecureMode ? 'rgba(16, 185, 129, 0.1)' : 'var(--bg-surface-secondary)',
                            border: isSecureMode ? '1px solid #10b981' : '1px solid transparent',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            transition: 'all 0.2s'
                        }}
                            onClick={() => setIsSecureMode(!isSecureMode)}
                        >
                            <div style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                backgroundColor: isSecureMode ? '#10b981' : 'var(--color-text-subtle)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white'
                            }}>
                                <Lock size={20} />
                            </div>
                            <div style={{ flex: 1 }}>
                                <h4 style={{ margin: '0 0 4px 0', fontSize: '15px', fontWeight: 600 }}>Enable Secure Mode</h4>
                                <p style={{ margin: 0, fontSize: '13px', color: 'var(--color-text-subtle)' }}>
                                    Appends a unique, random token to each URL to prevent guessing table numbers from home.
                                </p>
                            </div>
                            {isSecureMode && <Check size={20} color="#10b981" />}
                        </div>


                        <button
                            onClick={generateTables}
                            className="admin-btn-primary"
                            style={{
                                width: '100%',
                                padding: '16px',
                                borderRadius: '100px',
                                border: 'none',
                                background: 'var(--color-primary)',
                                color: 'white',
                                fontSize: '16px',
                                fontWeight: 700,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px'
                            }}
                        >
                            <Shuffle size={18} />
                            Generate QRs
                        </button>
                    </div>

                    {/* QR Codes Grid */}
                    {tables.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: '24px',
                                paddingBottom: '16px',
                                borderBottom: '1px solid var(--border-color)'
                            }}>
                                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700 }}>
                                    {tables.length} QR Code{tables.length > 1 ? 's' : ''} Ready
                                </h3>
                                <button
                                    onClick={downloadAllQRs}
                                    style={{
                                        padding: '8px 16px',
                                        borderRadius: '100px',
                                        border: '1px solid var(--border-color)',
                                        background: 'white',
                                        color: 'black',
                                        fontWeight: 600,
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px'
                                    }}
                                >
                                    <Download size={16} />
                                    Download All
                                </button>
                            </div>

                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                                gap: '24px',
                                marginBottom: '24px'
                            }}>
                                {tables.map((tableNumber) => (
                                    <div key={tableNumber} style={{
                                        border: '1px solid var(--border-color)',
                                        borderRadius: '16px',
                                        padding: '24px',
                                        textAlign: 'center',
                                        backgroundColor: 'var(--bg-surface)',
                                        boxShadow: 'var(--shadow-sm)'
                                    }}>
                                        <div style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            marginBottom: '16px',
                                            alignItems: 'center'
                                        }}>
                                            <h4 style={{ margin: '0', fontSize: '18px', fontWeight: 800 }}>
                                                Table {tableNumber}
                                            </h4>
                                            {isSecureMode && (
                                                <span style={{ fontSize: '10px', background: '#dcfce7', color: '#166534', padding: '2px 6px', borderRadius: '4px', fontWeight: 700 }}>SECURE</span>
                                            )}
                                        </div>

                                        <div style={{
                                            padding: '24px',
                                            background: 'white',
                                            borderRadius: '16px',
                                            marginBottom: '16px',
                                            display: 'flex',
                                            justifyContent: 'center'
                                        }}>
                                            <QRCode
                                                value={getTableURL(tableNumber)}
                                                size={qrConfig.size}
                                                fgColor={qrConfig.fgColor}
                                                bgColor={qrConfig.bgColor}
                                                qrStyle={qrConfig.qrStyle}
                                                logoImage={qrConfig.logoImage}
                                                logoWidth={qrConfig.logoWidth}
                                                logoHeight={qrConfig.logoHeight}
                                                removeQrCodeBehindLogo={true}
                                                eyeRadius={8}
                                                id={`qr-table-${tableNumber}`}
                                            />
                                        </div>
                                        <button
                                            onClick={() => downloadQR(tableNumber)}
                                            style={{
                                                width: '100%',
                                                fontSize: '14px',
                                                padding: '12px',
                                                borderRadius: '12px',
                                                border: '1px solid var(--border-color)',
                                                background: 'transparent',
                                                cursor: 'pointer',
                                                fontWeight: 600,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                gap: '8px'
                                            }}
                                        >
                                            <Download size={16} />
                                            Download
                                        </button>

                                        {isSecureMode && (
                                            <div style={{ marginTop: '8px', fontSize: '10px', color: '#999', fontFamily: 'monospace', wordBreak: 'break-all' }}>
                                                Token: {secureTokens[tableNumber]}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* Close Button */}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px', borderTop: '1px solid var(--border-color)', paddingTop: '24px' }}>
                        <button onClick={onClose} style={{
                            padding: '12px 24px',
                            borderRadius: '100px',
                            border: 'none',
                            background: 'var(--bg-surface-secondary)',
                            fontWeight: 600,
                            cursor: 'pointer'
                        }}>
                            Done
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default TableQRModal;
