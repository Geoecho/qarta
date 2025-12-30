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
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '400px', color: 'var(--text-muted)' }}>
            <div>Loading orders...</div>
        </div>
    );

    const activeOrders = orders.filter(o => ['placed', 'accepted', 'waiting'].includes(o.status));
    const completedOrders = orders.filter(o => ['completed', 'rejected'].includes(o.status));

    const sendTestOrder = async () => {
        alert("Please test by making an order on the home page.");
    };

    if (error === 'TICKET_MODE') return null;

    return (
        <div className="orders-dashboard">
            <div style={{ padding: '16px', background: 'rgba(56, 189, 248, 0.1)', borderRadius: '12px', marginBottom: '24px', border: '1px solid rgba(56, 189, 248, 0.2)' }}>
                <h4 style={{ margin: '0 0 8px 0', color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <AlertCircle size={16} /> Troubleshooting
                </h4>
                <p style={{ margin: '0 0 12px 0', fontSize: '13px', color: '#bae6fd' }}>
                    If orders don't show, ensure Firebase Rules are public.
                </p>
                <button onClick={sendTestOrder} className="admin-btn admin-btn-primary" style={{ padding: '8px 16px', fontSize: '13px' }}>
                    Send Test Order
                </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                <h2 style={{ fontSize: '24px', fontWeight: 700, margin: 0 }}>Incoming Orders</h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <button
                        onClick={manualRefresh}
                        className="admin-btn admin-btn-ghost"
                        style={{ padding: '8px 12px', fontSize: '12px' }}
                    >
                        <RefreshCw size={14} /> Refresh
                    </button>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '8px', height: '8px', background: '#4ade80', borderRadius: '50%', boxShadow: '0 0 10px #4ade80' }}></div>
                        <span style={{ fontSize: '14px', fontWeight: 600, color: '#4ade80' }}>Live Feed</span>
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
                <div className="admin-card" style={{ padding: '40px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <ShoppingBag size={48} style={{ opacity: 0.2, margin: '0 auto 16px', color: 'white' }} />
                    <p style={{ opacity: 0.6, color: 'var(--text-muted)' }}>No active orders right now.</p>
                </div>
            )}

            <h2 style={{ marginTop: '60px', fontSize: '20px', fontWeight: 700, marginBottom: '20px' }}>Past Orders</h2>

            <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
                <table className="order-table">
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Time</th>
                            <th>Items</th>
                            <th>Total</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {completedOrders.length === 0 && (
                            <tr>
                                <td colSpan="5" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No past orders found.</td>
                            </tr>
                        )}
                        {completedOrders.map(order => (
                            <tr key={order.id}>
                                <td style={{ fontFamily: 'monospace', color: '#38bdf8' }}>#{order.id.slice(-4)}</td>
                                <td>{new Date(order.createdAt?.seconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                                <td>{order.items?.length} items</td>
                                <td style={{ fontWeight: 600 }}>${order.total?.toFixed(2)}</td>
                                <td>
                                    <span style={{
                                        textTransform: 'capitalize',
                                        fontWeight: 600,
                                        fontSize: '13px',
                                        padding: '4px 8px',
                                        borderRadius: '4px',
                                        background: order.status === 'completed' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                        color: order.status === 'completed' ? '#4ade80' : '#f87171'
                                    }}>
                                        {order.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
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
            borderLeft: order.status === 'placed' ? '4px solid #f59e0b' : '4px solid #10b981',
            background: 'var(--glass-surface)',
            animation: order.status === 'placed' ? 'pulse-border 2s infinite' : 'none'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', alignItems: 'flex-start' }}>
                <div>
                    <div style={{ fontWeight: 800, fontSize: '18px', color: 'white' }}>Order #{order.id.slice(-4)}</div>
                    <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
                        {elapsed} mins ago
                    </div>
                </div>
                <span style={{
                    padding: '6px 12px',
                    borderRadius: '100px',
                    background: order.status === 'placed' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                    color: order.status === 'placed' ? '#fbbf24' : '#34d399',
                    fontSize: '12px',
                    fontWeight: 700,
                    border: '1px solid currentColor'
                }}>
                    {order.status.toUpperCase()}
                </span>
            </div>

            <div style={{ marginBottom: '20px', maxHeight: '200px', overflowY: 'auto' }}>
                {order.items && order.items.map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '15px' }}>
                        <div style={{ display: 'flex', gap: '8px', color: 'var(--text-muted)' }}>
                            <span style={{ fontWeight: 700, color: 'white' }}>{item.quantity}x</span>
                            <span>{item.name}</span>
                        </div>
                        <span style={{ opacity: 0.7 }}>${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                ))}
                <div style={{ borderTop: '1px solid var(--glass-border)', marginTop: '12px', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '16px' }}>
                    <span>Total</span>
                    <span style={{ color: '#38bdf8' }}>${order.total?.toFixed(2)}</span>
                </div>
            </div>

            {order.status === 'placed' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {!isAccepting ? (
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button
                                onClick={() => setIsAccepting(true)}
                                className="admin-btn admin-btn-primary"
                                style={{ flex: 1, justifyContent: 'center' }}
                            >
                                Accept Order
                            </button>
                            <button
                                onClick={() => onUpdate(order.id, 'rejected')}
                                className="admin-btn admin-btn-danger"
                                style={{ padding: '12px 16px' }}
                            >
                                Reject
                            </button>
                        </div>
                    ) : (
                        <div style={{ background: 'rgba(0,0,0,0.3)', padding: '16px', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
                            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '8px', color: 'var(--text-muted)' }}>Estimated Time (minutes)</label>
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
                                    className="admin-btn"
                                    style={{
                                        flex: 1,
                                        background: '#10b981',
                                        color: 'white',
                                        justifyContent: 'center'
                                    }}
                                >
                                    Confirm
                                </button>
                                <button onClick={() => setIsAccepting(false)} className="admin-btn admin-btn-ghost" style={{ padding: '0 8px' }}>
                                    <X size={20} />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {order.status === 'accepted' && (
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', fontSize: '15px', color: '#94a3b8', background: 'rgba(255,255,255,0.05)', padding: '12px', borderRadius: '8px' }}>
                        <Clock size={18} />
                        <span style={{ fontWeight: 500 }}>Ready in <strong style={{ color: 'white' }}>~{order.estimatedMinutes} mins</strong></span>
                    </div>
                    <button
                        onClick={() => onUpdate(order.id, 'completed')}
                        className="admin-btn admin-btn-ghost"
                        style={{
                            width: '100%',
                            justifyContent: 'center',
                            borderColor: '#38bdf8',
                            color: '#38bdf8'
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
