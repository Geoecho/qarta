import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, addDoc, serverTimestamp, getDocs } from 'firebase/firestore';
import { Clock, Check, X, AlertCircle, ShoppingBag, RefreshCw } from 'lucide-react';

export const OrdersDashboard = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const [error, setError] = useState(null);

    // Fetch loop for Admin (Vercel API)
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await fetch('/api/orders');
                if (!res.ok) throw new Error("Could not fetch orders (API offline?)");
                const data = await res.json();

                // Sort by ID/Date desc
                if (Array.isArray(data)) {
                    const validData = data.filter(x => x && x.id);
                    validData.sort((a, b) => {
                        const timeA = a.id.split('-')[1] || 0;
                        const timeB = b.id.split('-')[1] || 0;
                        return timeB - timeA;
                    });
                    setOrders(validData);
                    setLoading(false);
                }
            } catch (e) {
                console.error("Fetch error", e);
                // Don't show error immediately to avoid flicker on first load
                // setLoading(false);
            }
        };

        fetchOrders();
        const interval = setInterval(fetchOrders, 4000);
        return () => clearInterval(interval);
    }, []);

    // No legacy useEffect for realtime necessary
    /* 
    Legacy Firestore code removed
    */

    // Foolproof Backup: Polling every 15s to force sync if socket fails
    useEffect(() => {
        const interval = setInterval(async () => {
            try {
                const snapshot = await getDocs(collection(db, 'orders'));
                const ordersData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                ordersData.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));

                // Only update if we found orders (simple merge strategy)
                if (ordersData.length > 0) {
                    setOrders(ordersData);
                    if (loading) setLoading(false);
                }
            } catch (e) {
                console.log("Polling failed", e);
            }
        }, 15000);
        return () => clearInterval(interval);
    }, []);

    const manualRefresh = async () => {
        setLoading(true);
        try {
            const snapshot = await getDocs(collection(db, 'orders'));
            const ordersData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            ordersData.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
            setOrders(ordersData);
            setLoading(false);
        } catch (e) {
            setError(e.message);
            setLoading(false);
        }
    };

    const updateOrderStatus = async (orderId, status, minutes = null) => {
        try {
            await fetch('/api/orders', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: orderId, status, estimatedMinutes: minutes })
            });
            // Optimistic update
            setOrders(prev => prev.map(o => {
                if (o.id === orderId) {
                    return { ...o, status, estimatedMinutes: minutes };
                }
                return o;
            }));
        } catch (error) {
            console.error("Error updating order:", error);
            alert("Failed to update status. Server offline?");
        }
    };

    if (loading) return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '400px' }}>
            <div>Loading orders...</div>
        </div>
    );

    const activeOrders = orders.filter(o => ['placed', 'accepted', 'waiting'].includes(o.status));
    const completedOrders = orders.filter(o => ['completed', 'rejected'].includes(o.status));

    const sendTestOrder = async () => {
        // ... removed test order logic as it's complex to replicate with API easily without auth context issues
        // Simplified: use real flow.
        alert("Please test by making an order on the home page.");
    };

    /* TICKET MODE REMOVED - FULL DB ACTIVE */
    if (error === 'TICKET_MODE') return null;

    return (
        <div className="orders-dashboard">
            <div style={{ padding: '16px', background: '#eff6ff', borderRadius: '12px', marginBottom: '24px', border: '1px dashed #3b82f6' }}>
                <h4 style={{ margin: '0 0 8px 0', color: '#1e40af' }}>⚠️ Troubleshooting</h4>
                <p style={{ margin: '0 0 12px 0', fontSize: '13px', color: '#1e3a8a' }}>
                    If orders don't show, ensure Firebase Rules are public.
                </p>
                <button onClick={sendTestOrder} style={{ background: '#2563eb', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}>
                    Send Test Order
                </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                <h2 style={{ fontSize: '24px', fontWeight: 700 }}>Incoming Orders</h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <button
                        onClick={manualRefresh}
                        style={{ border: 'none', background: 'white', border: '1px solid #e2e8f0', padding: '8px 12px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 600 }}
                    >
                        <RefreshCw size={14} /> Refresh
                    </button>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '10px', height: '10px', background: '#22c55e', borderRadius: '50%', boxShadow: '0 0 10px #22c55e' }}></div>
                        <span style={{ fontSize: '14px', fontWeight: 600 }}>Live Feed</span>
                    </div>
                </div>
            </div>

            <div className="orders-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
                {activeOrders.map(order => (
                    <OrderCard
                        key={order.id}
                        order={order}
                        onUpdate={updateOrderStatus}
                    />
                ))}
            </div>

            {activeOrders.length === 0 && (
                <div style={{ padding: '40px', textAlign: 'center', background: 'var(--bg-surface)', borderRadius: '16px', border: '1px dashed var(--border-color)' }}>
                    <ShoppingBag size={48} style={{ opacity: 0.2, margin: '0 auto 16px' }} />
                    <p style={{ opacity: 0.6 }}>No active orders right now.</p>
                </div>
            )}

            <h2 style={{ marginTop: '60px', fontSize: '20px', fontWeight: 700, marginBottom: '20px' }}>Past Orders</h2>
            <div className="orders-list">
                {completedOrders.length === 0 && <p style={{ opacity: 0.5 }}>No past orders.</p>}
                {completedOrders.map(order => (
                    <div key={order.id} className="admin-card" style={{ padding: '16px', opacity: 0.7, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                            <span style={{ fontFamily: 'monospace', background: 'var(--bg-app)', padding: '4px 8px', borderRadius: '4px' }}>#{order.id.slice(-4)}</span>
                            <span>{new Date(order.createdAt?.seconds * 1000).toLocaleTimeString()}</span>
                            <span>{order.items?.length} items</span>
                        </div>
                        <span style={{
                            textTransform: 'capitalize',
                            fontWeight: 600,
                            color: order.status === 'completed' ? 'var(--color-primary)' : '#ef4444'
                        }}>
                            {order.status}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

const OrderCard = ({ order, onUpdate }) => {
    const [minutes, setMinutes] = useState(15);
    const [isAccepting, setIsAccepting] = useState(false);

    const handleAccept = () => {
        onUpdate(order.id, 'accepted', minutes);
        setIsAccepting(false);
    };

    // Calculate time elapsed since placed
    const [elapsed, setElapsed] = useState(0);
    useEffect(() => {
        if (!order.createdAt) return;
        const interval = setInterval(() => {
            const now = new Date();
            const created = new Date(order.createdAt.seconds * 1000);
            setElapsed(Math.floor((now - created) / 60000)); // minutes
        }, 1000);
        return () => clearInterval(interval);
    }, [order.createdAt]);

    return (
        <div className="admin-card" style={{
            borderLeft: order.status === 'placed' ? '6px solid #f59e0b' : '6px solid #10b981',
            animation: order.status === 'placed' ? 'pulse-border 2s infinite' : 'none'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', alignItems: 'flex-start' }}>
                <div>
                    <div style={{ fontWeight: 800, fontSize: '18px' }}>Order #{order.id.slice(-4)}</div>
                    <div style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                        {elapsed} mins ago
                    </div>
                </div>
                <span style={{
                    padding: '6px 12px',
                    borderRadius: '100px',
                    background: order.status === 'placed' ? '#fef3c7' : '#d1fae5',
                    color: order.status === 'placed' ? '#b45309' : '#065f46',
                    fontSize: '12px',
                    fontWeight: 700
                }}>
                    {order.status.toUpperCase()}
                </span>
            </div>

            <div style={{ marginBottom: '20px', maxHeight: '200px', overflowY: 'auto' }}>
                {order.items && order.items.map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '15px' }}>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <span style={{ fontWeight: 700 }}>{item.quantity}x</span>
                            <span>{item.name}</span>
                        </div>
                        <span style={{ opacity: 0.7 }}>${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                ))}
                <div style={{ borderTop: '1px solid var(--border-color)', marginTop: '12px', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '16px' }}>
                    <span>Total</span>
                    <span>${order.total?.toFixed(2)}</span>
                </div>
            </div>

            {order.status === 'placed' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {!isAccepting ? (
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button
                                onClick={() => setIsAccepting(true)}
                                style={{
                                    flex: 1,
                                    padding: '12px',
                                    background: 'var(--color-primary)',
                                    color: 'white',
                                    borderRadius: '12px',
                                    border: 'none',
                                    fontWeight: 600,
                                    cursor: 'pointer'
                                }}
                            >
                                Accept Order
                            </button>
                            <button
                                onClick={() => onUpdate(order.id, 'rejected')}
                                style={{
                                    padding: '12px 16px',
                                    background: '#fee2e2',
                                    color: '#991b1b',
                                    borderRadius: '12px',
                                    border: 'none',
                                    fontWeight: 600,
                                    cursor: 'pointer'
                                }}
                            >
                                Reject
                            </button>
                        </div>
                    ) : (
                        <div style={{ background: 'var(--bg-app)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '8px' }}>Estimated Time (minutes)</label>
                            <div style={{ display: 'flex', gap: '12px' }}>
                                <input
                                    type="number"
                                    value={minutes}
                                    onChange={(e) => setMinutes(Number(e.target.value))}
                                    className="admin-input"
                                    style={{ width: '80px', textAlign: 'center', fontSize: '16px', fontWeight: 700 }}
                                />
                                <button
                                    onClick={handleAccept}
                                    style={{
                                        flex: 1,
                                        background: '#10b981',
                                        color: 'white',
                                        borderRadius: '8px',
                                        border: 'none',
                                        fontWeight: 600,
                                        cursor: 'pointer'
                                    }}
                                >
                                    Confirm
                                </button>
                                <button onClick={() => setIsAccepting(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0 8px' }}>
                                    <X size={20} />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {order.status === 'accepted' && (
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', fontSize: '15px', color: '#64748b', background: '#f1f5f9', padding: '12px', borderRadius: '8px' }}>
                        <Clock size={18} />
                        <span style={{ fontWeight: 500 }}>Ready in <strong>~{order.estimatedMinutes} mins</strong></span>
                    </div>
                    <button
                        onClick={() => onUpdate(order.id, 'completed')}
                        style={{
                            width: '100%',
                            padding: '12px',
                            background: 'white',
                            border: '2px solid #e2e8f0',
                            borderRadius: '12px',
                            fontWeight: 600,
                            color: '#475569',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px'
                        }}
                    >
                        <Check size={18} />
                        Mark as Ready / Delivered
                    </button>
                </div>
            )}
        </div>
    );
};
