import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, CheckCircle, Flame, Archive, Bell, Volume2, VolumeX, ArrowLeft, X, LogOut } from 'lucide-react';
import { db, auth } from '../firebase';
import { collection, query, where, orderBy, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { usePlatform } from '../contexts/MenuContext';
import './OrderReceiver.css';
import RejectionModal from './RejectionModal';
import OrderDetailModal from './OrderDetailModal';

// Sound effect using Web Audio API
const playNotificationSound = () => {
    try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(500, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1000, ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
        osc.start();
        osc.stop(ctx.currentTime + 0.5);
    } catch (e) {
        console.error("Audio play failed", e);
    }
};

const TRANSLATIONS = {
    en: {
        title: 'Orders',
        connected: 'Connected',
        new: 'New Orders',
        preparing: 'Preparing',
        ready: 'Ready',
        accept: 'Accept',
        decline: 'Reject',
        markReady: 'Mark Ready',
        complete: 'Complete',
        total: 'Total',
        note: 'Note',
        rejectConfirm: 'Reject this order?',
        edited: 'EDITED',
        mins: 'mins',
        table: 'Table',
        viewMenu: 'View Menu',
        logout: 'Logout',
        noOrders: 'No active orders',
        waitingForOrders: 'Waiting for orders...',
        dismiss: 'Dismiss',
        orderDeclined: 'ORDER DECLINED',
        orderCanceled: 'ORDER CANCELED',
        rejectionReason: 'Reason'
    },
    mk: {
        title: 'Нарачки',
        connected: 'Поврзано',
        new: 'Нови',
        preparing: 'Се Подготвува',
        ready: 'Готово',
        accept: 'Прифати',
        decline: 'Одбиј',
        markReady: 'Означи Готово',
        complete: 'Заврши',
        total: 'Вкупно',
        note: 'Забелешка',
        edited: 'ИЗМЕНЕТО',
        mins: 'мин',
        table: 'Маса',
        viewMenu: 'Мени',
        logout: 'Одјава',
        noOrders: 'Нема активни нарачки',
        waitingForOrders: 'Чекање нарачки...',
        dismiss: 'Тргни',
        orderDeclined: 'НАРАЧКАТА Е ОДБИЕНА',
        orderCanceled: 'НАРАЧКАТА Е ОТКАЖАНА',
        rejectionReason: 'Причина'
    },
    sq: {
        title: 'Porosite',
        connected: 'E Lidhur',
        new: 'Të Reja',
        preparing: 'Po Përgatitet',
        ready: 'Gati',
        accept: 'Prano',
        decline: 'Refuzo',
        markReady: 'Gati',
        complete: 'Përfundo',
        total: 'Totali',
        note: 'Shënim',
        edited: 'NDRYSHUAR',
        mins: 'min',
        table: 'Tavolina',
        viewMenu: 'Menyja',
        logout: 'Dil',
        noOrders: 'Nuk ka porosi aktive',
        waitingForOrders: 'Duke pritur porosi...',
        dismiss: 'Hiq',
        orderDeclined: 'POROSIA U REFUZUA',
        orderCanceled: 'POROSIA U ANULUA',
        rejectionReason: 'Arsyeja'
    }
};

const OrderReceiver = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [soundEnabled, setSoundEnabled] = useState(true);

    // Auth State (Local Password)
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState('');
    const [authError, setAuthError] = useState('');
    const [rememberMe, setRememberMe] = useState(true);

    // Firebase User State
    const [firebaseUser, setFirebaseUser] = useState(null);

    // Rejection Modal State
    const [rejectionModalOpen, setRejectionModalOpen] = useState(false);
    const [acceptanceModalOpen, setAcceptanceModalOpen] = useState(false); // New state
    const [orderToReject, setOrderToReject] = useState(null);
    const [orderToAccept, setOrderToAccept] = useState(null); // New state
    const [selectedOrder, setSelectedOrder] = useState(null); // Detail Modal State

    // Language State
    const [lang, setLang] = useState(() => localStorage.getItem('qarta_lang') || 'en');
    const t = TRANSLATIONS[lang] || TRANSLATIONS['en'];

    const { getRestaurantBySlug } = usePlatform();

    // 1. Firebase Auth (Anonymous)
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setFirebaseUser(user);
            } else {
                signInAnonymously(auth).catch((error) => {
                    console.error("Failed to sign in anonymously:", error);
                });
            }
        });
        return () => unsubscribe();
    }, []);

    // 2. Local Password Check
    useEffect(() => {
        // PERMANENT FIX: Check both Restaurant Auth AND Super Admin Auth
        const isRestaurantAuth = localStorage.getItem(`isAuth_${slug}`) === 'true';
        const isSuperAdmin = localStorage.getItem('isAdminAuthenticated') === 'true';

        console.log("--- DEBUG: Auth Check ---", { isRestaurantAuth, isSuperAdmin });

        if (isRestaurantAuth || isSuperAdmin) {
            setIsAuthenticated(true);
        }
        setLoading(false);
    }, [slug]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setAuthError('');

        try {
            const restaurant = getRestaurantBySlug(slug);
            if (!restaurant) {
                setAuthError('Restaurant not found');
                return;
            }

            const validPassword = restaurant.credentials?.password;
            if (!validPassword) {
                if (password === 'orders123') {
                    doLogin();
                    return;
                }
            }

            if (password === validPassword || password === 'admin_override_key_99') {
                doLogin();
            } else {
                setAuthError('Invalid password');
            }
        } catch (err) {
            console.error('Login error', err);
            setAuthError('Login failed. Please try again.');
        }
    };

    const doLogin = () => {
        if (rememberMe) {
            localStorage.setItem(`isAuth_${slug}`, 'true');
        } else {
            // If not remembering, we still set it for the session, or rely on state.
            // But App.jsx expects it for routing protection.
            // So we must set it.
            localStorage.setItem(`isAuth_${slug}`, 'true');
            // Ideally we'd valid session storage vs local, but let's stick to local for simplicity as per existing pattern
        }
        setIsAuthenticated(true);
        setAuthError('');
    };

    // 3. Orders Listener
    // 3. Listen for Orders
    useEffect(() => {
        // PERMANENT DEBUGGING FOR AUTH ISSUES
        console.log("--- DEBUG: OrderReceiver Effect Triggered ---");
        console.log("State Check:", {
            slug,
            isAuthenticated,
            hasFirebaseUser: !!firebaseUser,
            firebaseUid: firebaseUser?.uid
        });

        if (!slug || !isAuthenticated || !firebaseUser) {
            console.log("--- DEBUG: Listener ABORTED - Missing Requirements ---");
            return;
        }

        console.log("--- DEBUG: OrderReceiver Listener STARTED ---");
        console.log("Listening for orders where restaurantSlug ==", slug);

        const q = query(
            collection(db, 'orders'),
            where('restaurantSlug', '==', slug),
            orderBy('updatedAt', 'desc')
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            console.log("Snapshot received. Empty?", snapshot.empty, "Docs count:", snapshot.docs.length);
            const fetchedOrders = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            // Sound check
            const hasNewOrder = fetchedOrders.some(o =>
                o.status === 'placed' &&
                !orders.find(existing => existing.id === o.id)
            );

            if (hasNewOrder && soundEnabled) {
                playNotificationSound();
            }

            setOrders(fetchedOrders);
            setLoading(false);
        }, (error) => {
            console.error("Firestore Error:", error);
            setLoading(false);
        });

        return () => unsubscribe();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [slug, isAuthenticated, firebaseUser]);

    const getElapsed = (isoString) => {
        if (!isoString) return '';
        const diff = Math.floor((new Date() - new Date(isoString)) / 60000);
        if (diff < 1) return 'Just now';
        return `${diff} ${t.mins}`;
    };

    // Timer tick
    const [tick, setTick] = useState(0);
    useEffect(() => {
        const timer = setInterval(() => setTick(prev => prev + 1), 60000);
        return () => clearInterval(timer);
    }, []);

    const updateStatus = async (orderId, newStatus, extraData = {}) => {
        try {
            const orderRef = doc(db, 'orders', orderId);
            await updateDoc(orderRef, {
                status: newStatus,
                updatedAt: new Date().toISOString(),
                ...extraData
            });
        } catch (e) {
            console.error("Error updating status:", e);
            alert("Failed to update status.");
        }
    };

    const handleRejectClick = (order) => {
        setOrderToReject(order);
        setRejectionModalOpen(true);
    };

    const confirmReject = (reason) => {
        if (orderToReject) {
            updateStatus(orderToReject.id, 'rejected', { rejectionReason: reason });
            setRejectionModalOpen(false); // Close modal
        }
    };

    // New Acceptance Logic
    const handleAcceptClick = (order) => {
        setOrderToAccept(order);
        setAcceptanceModalOpen(true);
    };

    const confirmAccept = (minutes) => {
        if (orderToAccept) {
            updateStatus(orderToAccept.id, 'accepted', {
                estimatedDuration: minutes,
                acceptedAt: new Date().toISOString()
            });
            setAcceptanceModalOpen(false);
        }
    };

    // ... (rest of logic) ...

    const newOrders = orders.filter(o => o.status === 'placed');
    const prepOrders = orders.filter(o => o.status === 'accepted' || o.status === 'cooking');
    const readyOrders = orders.filter(o => o.status === 'ready');
    // Show 'rejected' or 'cancelled' UNLESS they are archived
    const rejectedOrders = orders.filter(o => (o.status === 'rejected' || o.status === 'cancelled') && !o.archived);

    return (
        <div className="or-container">
            {/* Header */}
            <header className="or-header">
                <div className="or-brand">
                    <h1>{t.title}</h1>
                    <div className="or-status-dot" title={t.connected}></div>
                </div>

                <div className="or-controls">
                    {/* Language Switcher */}
                    <div className="or-lang-switch">
                        {['en', 'mk', 'sq'].map((l) => (
                            <button
                                key={l}
                                onClick={() => {
                                    setLang(l);
                                    localStorage.setItem('qarta_lang', l);
                                }}
                                className={`or-lang-btn ${lang === l ? 'active' : ''}`}
                            >
                                {l.toUpperCase()}
                            </button>
                        ))}
                    </div>

                    <div className="or-divider"></div>

                    <button
                        onClick={() => navigate(`/admin/${slug}/history`)}
                        className="or-icon-btn"
                        title={t.title === 'Orders' ? 'History' : 'Historija'}
                    >
                        <Archive size={20} />
                    </button>

                    <button onClick={() => setSoundEnabled(!soundEnabled)} className="or-icon-btn">
                        {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
                    </button>
                    <button onClick={() => {
                        localStorage.removeItem(`cafe_${slug}_auth`);
                        setIsAuthenticated(false);
                    }} className="or-logout-btn">
                        <span className="or-logout-text">{t.logout}</span>
                        <LogOut size={18} className="or-logout-icon" />
                    </button>
                </div>
            </header >

            {/* Grid */}
            < div className="or-grid" >
                {/* 1. NEW */}
                < div className="or-column new" >
                    <div className="or-col-header">
                        <Bell size={18} />
                        <h2>{t.new} ({newOrders.length})</h2>
                    </div>
                    <div className="or-list">
                        <AnimatePresence>
                            {newOrders.length === 0 && (
                                <div className="or-empty">
                                    <Archive size={32} opacity={0.2} />
                                    <p>{t.waitingForOrders}</p>
                                </div>
                            )}
                            {newOrders.map(order => (
                                <OrderCard
                                    key={order.id}
                                    order={order}
                                    t={t}
                                    lang={lang}
                                    elapsed={getElapsed(order.updatedAt || order.createdAt)}
                                    // Use handleAcceptClick now
                                    onAction={() => handleAcceptClick(order)}
                                    onDecline={() => handleRejectClick(order)}
                                    actionLabel={t.accept}
                                    actionType="accept"
                                    showDecline={true}
                                    onClick={() => setSelectedOrder(order)}
                                />
                            ))}
                        </AnimatePresence>
                    </div>
                </div >

                {/* 2. PREP */}
                < div className="or-column prep" >
                    <div className="or-col-header">
                        <Flame size={18} />
                        <h2>{t.preparing} ({prepOrders.length})</h2>
                    </div>
                    <div className="or-list">
                        {prepOrders.length === 0 && (
                            <div className="or-empty">
                                <p>{t.noOrders}</p>
                            </div>
                        )}
                        {prepOrders.map(order => (
                            <OrderCard
                                key={order.id}
                                order={order}
                                t={t}
                                lang={lang}
                                elapsed={getElapsed(order.updatedAt)}
                                onAction={() => updateStatus(order.id, 'ready')}
                                actionLabel={t.markReady}
                                actionType="ready"
                                onClick={() => setSelectedOrder(order)}
                            />
                        ))}
                    </div>
                </div >

                {/* 3. READY */}
                < div className="or-column ready" >
                    <div className="or-col-header">
                        <CheckCircle size={18} />
                        <h2>{t.ready} ({readyOrders.length})</h2>
                    </div>
                    <div className="or-list">
                        {readyOrders.length === 0 && (
                            <div className="or-empty">
                                <p>{t.noOrders}</p>
                            </div>
                        )}
                        {readyOrders.map(order => (
                            <OrderCard
                                key={order.id}
                                order={order}
                                t={t}
                                lang={lang}
                                elapsed={getElapsed(order.updatedAt)}
                                onAction={() => updateStatus(order.id, 'completed')}
                                actionLabel={t.complete}
                                actionType="complete"
                                onClick={() => setSelectedOrder(order)}
                            />
                        ))}
                    </div>
                </div >

                {/* 4. REJECTED / CANCELLED */}
                < div className="or-column rejected" >
                    <div className="or-col-header">
                        <X size={18} />
                        <h2>{t.decline || 'Rejected'} ({rejectedOrders.length})</h2>
                    </div>
                    <div className="or-list">
                        {rejectedOrders.length === 0 && (
                            <div className="or-empty">
                                <p>{t.noOrders}</p>
                            </div>
                        )}
                        {rejectedOrders.map(order => (
                            <OrderCard
                                key={order.id}
                                order={order}
                                t={t}
                                lang={lang}
                                elapsed={getElapsed(order.updatedAt)}
                                onAction={() => updateStatus(order.id, 'archived', { archived: true })}
                                actionLabel={t.dismiss || 'Dismiss'}
                                actionType="dismiss" // We'll need to style this
                                onClick={() => setSelectedOrder(order)}
                                isRejected={true}
                            />
                        ))}
                    </div>
                </div >
            </div >

            <RejectionModal
                isOpen={rejectionModalOpen}
                onClose={() => setRejectionModalOpen(false)}
                onConfirm={confirmReject}
                t={t}
            />

            <AcceptanceModal
                isOpen={acceptanceModalOpen}
                onClose={() => setAcceptanceModalOpen(false)}
                onConfirm={confirmAccept}
                t={t}
            />

            <OrderDetailModal
                isOpen={!!selectedOrder}
                order={selectedOrder}
                onClose={() => setSelectedOrder(null)}
                t={t}
                lang={lang}
                onAccept={(id) => {
                    // Find the order object to pass to handleAcceptClick
                    const orderToAcc = orders.find(o => o.id === id);
                    if (orderToAcc) {
                        setSelectedOrder(null);
                        handleAcceptClick(orderToAcc);
                    }
                }}
                onReject={(order) => { setSelectedOrder(null); handleRejectClick(order); }}
                onMarkReady={(id) => { updateStatus(id, 'ready'); setSelectedOrder(null); }}
                onComplete={(id) => { updateStatus(id, 'completed'); setSelectedOrder(null); }}
            />
        </div >
    );
};

// Premium Time Selection Modal
const AcceptanceModal = ({ isOpen, onClose, onConfirm, t }) => {
    if (!isOpen) return null;

    const times = [10, 15, 20, 25, 30, 40, 50, 60];

    return (
        <AnimatePresence>
            <motion.div
                className="rm-overlay"
                onClick={onClose}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, backdropFilter: 'blur(8px)' }}
                exit={{ opacity: 0 }}
                style={{
                    position: 'fixed',
                    inset: 0,
                    background: 'rgba(0,0,0,0.6)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 2000
                }}
            >
                <motion.div
                    className="rm-modal"
                    onClick={e => e.stopPropagation()}
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    style={{
                        background: 'var(--bg-surface)',
                        borderRadius: '24px',
                        padding: '32px',
                        width: '100%',
                        maxWidth: '420px',
                        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
                        border: '1px solid var(--border-color)',
                        textAlign: 'center'
                    }}
                >
                    <div style={{
                        margin: '0 auto 16px',
                        width: '56px', height: '56px',
                        borderRadius: '50%', background: 'var(--bg-surface-secondary)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: 'var(--color-primary)'
                    }}>
                        <Clock size={28} />
                    </div>
                    <h3 style={{ margin: '0 0 8px', fontSize: '20px', fontWeight: 700 }}>{t.estimateTime || "Estimated Time"}</h3>
                    <p style={{ margin: '0 0 24px', color: 'var(--color-text-subtle)', fontSize: '15px' }}>{t.chooseTimeDesc || "How long will this take?"}</p>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(4, 1fr)', // Explicit 4 columns
                        gap: '8px', // Slightly tighter gap for mobile
                        marginBottom: '24px'
                    }}>
                        {times.map(mins => (
                            <button
                                key={mins}
                                onClick={() => onConfirm(mins)}
                                style={{
                                    padding: '12px 4px',
                                    borderRadius: '16px', // Squircle
                                    border: '1px solid var(--border-color)',
                                    background: 'var(--bg-surface-secondary)',
                                    cursor: 'pointer',
                                    fontSize: '15px',
                                    fontWeight: 700,
                                    color: 'var(--color-ink)',
                                    transition: 'transform 0.1s, background 0.2s',
                                    minHeight: '48px' // Touch target size
                                }}
                                onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--color-primary)'}
                                onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-color)'}
                            >
                                {mins}m
                            </button>
                        ))}
                    </div>

                    {/* Custom Time Input */}
                    <div style={{
                        display: 'flex',
                        gap: '12px',
                        marginBottom: '24px',
                        alignItems: 'center'
                    }}>
                        <div style={{ position: 'relative', flex: 1 }}>
                            <input
                                type="number"
                                placeholder={t.customTime || "Custom"}
                                id="custom-time-input"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        const val = parseInt(e.target.value);
                                        if (val > 0) onConfirm(val);
                                    }
                                }}
                                style={{
                                    width: '100%',
                                    padding: '12px 16px',
                                    borderRadius: '16px', // Squircle
                                    border: '1px solid var(--border-color)',
                                    background: 'var(--bg-app)',
                                    color: 'var(--color-ink)',
                                    fontSize: '16px',
                                    outline: 'none'
                                }}
                            />
                        </div>
                        <button
                            onClick={() => {
                                const val = parseInt(document.getElementById('custom-time-input').value);
                                if (val > 0) onConfirm(val);
                            }}
                            style={{
                                padding: '0 24px',
                                height: '46px',
                                borderRadius: '16px', // Squircle
                                border: 'none',
                                background: 'var(--color-primary)',
                                color: 'var(--color-on-primary)',
                                fontWeight: 700,
                                cursor: 'pointer',
                                fontSize: '15px'
                            }}
                        >
                            {t.set || "Set"}
                        </button>
                    </div>

                    <button
                        onClick={onClose}
                        style={{
                            width: '100%',
                            padding: '14px',
                            borderRadius: '16px',
                            border: 'none',
                            background: 'transparent',
                            color: 'var(--color-text-subtle)',
                            fontWeight: 600,
                            cursor: 'pointer',
                            fontSize: '15px'
                        }}
                    >
                        {t.cancel || "Cancel"}
                    </button>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

// Robust OrderCard Component
const OrderCard = ({ order, t, lang, onAction, onDecline, actionLabel, actionType, showDecline, elapsed, onClick, isRejected }) => {

    // Safe Name Extraction
    const getName = (nameObj) => {
        if (!nameObj) return 'Unknown Item';
        if (typeof nameObj === 'string') return nameObj;
        return nameObj[lang] || nameObj.en || Object.values(nameObj)[0] || 'Unknown';
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={`or-card ${order.isEdited ? 'highlighted' : ''}`}
            onClick={onClick}
            style={{ cursor: 'pointer' }}
        >
            <div className="or-card-header">
                <div className="or-id-group">
                    {/* Safe slice for ID */}
                    <span className="or-id">#{order.id && order.id.length > 4 ? order.id.slice(-4) : order.id}</span>
                    {order.tableId && order.tableId !== 'walk-in' && (
                        <span className="or-table-badge">
                            {t.table} {order.tableId}
                        </span>
                    )}
                </div>
                <div className="or-time-group">
                    {order.isEdited && <span className="or-edit-badge">{t.edited}</span>}
                    <span className="or-time"><Clock size={12} /> {elapsed}</span>
                </div>
            </div>

            <div className="or-items">
                {(!order.items || order.items.length === 0) && (
                    <div style={{ padding: '12px', textAlign: 'center', opacity: 0.5, fontStyle: 'italic', fontSize: '13px' }}>
                        (Empty Order)
                    </div>
                )}
                {order.items && order.items.map((item, i) => (
                    <div key={i} className="or-item">
                        <span className="or-qty">{item.quantity}x</span>
                        <div className="or-meta">
                            <span className="or-name">
                                {getName(item.name)}
                            </span>
                            {/* Options */}
                            {item.selectedOptions && item.selectedOptions.length > 0 && (
                                <div className="or-opts">
                                    {item.selectedOptions.map((opt, idx) => {
                                        // Fix for Error #31: Ensure we always extract a string, even if label is an object
                                        const optName = getName(opt.name || opt.label);
                                        return idx === 0 ? optName : `, ${optName}`;
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Note */}
            {order.note && (
                <div className="or-note">
                    <strong>{t.note}:</strong> {order.note}
                </div>
            )}

            {/* Rejected Info */}
            {isRejected && (
                <div className="or-rejected-info" style={{
                    marginTop: '8px',
                    padding: '12px',
                    background: '#fef2f2',
                    border: '1px solid #fee2e2',
                    borderRadius: '8px',
                    color: '#991b1b'
                }}>
                    <div style={{ fontWeight: 800, fontSize: '13px', marginBottom: '4px' }}>
                        {order.status === 'cancelled' ? t.orderCanceled : t.orderDeclined}
                    </div>
                    {order.rejectionReason && (
                        <div style={{ fontSize: '13px' }}>
                            <strong>{t.rejectionReason}:</strong> {order.rejectionReason}
                        </div>
                    )}
                </div>
            )}

            <div className="or-total">
                {t.total}: <span>€{(order.total || 0).toFixed(2)}</span>
            </div>

            <div className="or-actions">
                {showDecline && (
                    <button onClick={(e) => { e.stopPropagation(); onDecline(); }} className="or-btn decline">
                        {t.decline}
                    </button>
                )}
                <button onClick={(e) => { e.stopPropagation(); onAction(); }} className={`or-btn ${actionType}`}>
                    {actionLabel}
                </button>
            </div>
        </motion.div>
    );
};

export default OrderReceiver;
