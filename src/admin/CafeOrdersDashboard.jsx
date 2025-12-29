import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePlatform } from '../contexts/MenuContext';
import { motion } from 'framer-motion';
import { ArrowLeft, Check, X, Clock, Package } from 'lucide-react';

const CafeOrdersDashboard = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const { getRestaurantBySlug } = usePlatform();
    const restaurant = getRestaurantBySlug(slug);

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    // State for managing acceptance flow
    const [acceptingOrderId, setAcceptingOrderId] = useState(null);
    const [customTime, setCustomTime] = useState('');

    // Check authentication
    useEffect(() => {
        const auth = localStorage.getItem(`cafe_${slug}_auth`);
        setIsAuthenticated(auth === 'true');
    }, [slug]);

    // Fetch orders
    useEffect(() => {
        if (!isAuthenticated) return;

        const fetchOrders = async () => {
            try {
                const response = await fetch('/api/orders');
                const data = await response.json();
                // Filter orders for this restaurant
                const cafeOrders = data.filter(order => order.restaurantSlug === slug);
                setOrders(cafeOrders.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)));
                setLoading(false);
            } catch (err) {
                console.error('Error fetching orders:', err);
                setLoading(false);
            }
        };

        fetchOrders();
        const interval = setInterval(fetchOrders, 3000); // Poll every 3 seconds
        return () => clearInterval(interval);
    }, [isAuthenticated, slug]);

    const handleLogin = (e) => {
        e.preventDefault();
        // Simple password check - in production, use proper authentication
        if (password === 'orders123') {
            localStorage.setItem(`cafe_${slug}_auth`, 'true');
            setIsAuthenticated(true);
            setError('');
        } else {
            setError('Invalid password');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem(`cafe_${slug}_auth`);
        setIsAuthenticated(false);
        setPassword('');
    };

    const updateOrderStatus = async (orderId, status, estimatedMinutes = null) => {
        try {
            await fetch('/api/orders', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: orderId, status, estimatedMinutes })
            });
            // Refresh orders
            const response = await fetch('/api/orders');
            const data = await response.json();
            const cafeOrders = data.filter(order => order.restaurantSlug === slug);
            setOrders(cafeOrders.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)));
        } catch (err) {
            console.error('Error updating order:', err);
        }
    };

    if (!restaurant) {
        return (
            <div style={{ padding: '64px 24px', textAlign: 'center' }}>
                <h1>Restaurant Not Found</h1>
                <p>The restaurant "{slug}" doesn't exist.</p>
            </div>
        );
    }

    if (!isAuthenticated) {
        return (
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'var(--bg-app)',
                padding: '24px'
            }}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                        background: 'var(--bg-surface)',
                        padding: '48px',
                        borderRadius: '24px',
                        boxShadow: 'var(--shadow-lg)',
                        maxWidth: '400px',
                        width: '100%'
                    }}
                >
                    <h1 style={{ margin: '0 0 8px 0', fontSize: '28px' }}>{restaurant.name}</h1>
                    <p style={{ margin: '0 0 32px 0', color: 'var(--color-text-subtle)' }}>Orders Dashboard</p>

                    <form onSubmit={handleLogin}>
                        <div style={{ marginBottom: '24px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter orders password"
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    borderRadius: '8px',
                                    border: '1px solid var(--border-color)',
                                    fontSize: '16px'
                                }}
                            />
                            {error && (
                                <p style={{ margin: '8px 0 0 0', color: '#ef4444', fontSize: '14px' }}>{error}</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            style={{
                                width: '100%',
                                padding: '12px',
                                borderRadius: '8px',
                                border: 'none',
                                background: 'var(--color-primary)',
                                color: 'var(--color-on-primary)',
                                fontSize: '16px',
                                fontWeight: 600,
                                cursor: 'pointer'
                            }}
                        >
                            Login
                        </button>
                    </form>
                </motion.div>
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-app)', padding: '24px' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                {/* Header */}
                <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h1 style={{ margin: '0 0 8px 0', fontSize: '32px' }}>{restaurant.name} - Orders</h1>
                        <p style={{ margin: 0, color: 'var(--color-text-subtle)' }}>
                            {orders.length} total orders
                        </p>
                    </div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <button
                            onClick={() => navigate(`/${slug}`)}
                            style={{
                                padding: '8px 16px',
                                borderRadius: '8px',
                                border: '1px solid var(--border-color)',
                                background: 'transparent',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}
                        >
                            <ArrowLeft size={16} />
                            Back to Menu
                        </button>
                        <button
                            onClick={handleLogout}
                            style={{
                                padding: '8px 16px',
                                borderRadius: '8px',
                                border: '1px solid #ef4444',
                                background: 'transparent',
                                color: '#ef4444',
                                cursor: 'pointer'
                            }}
                        >
                            Logout
                        </button>
                    </div>
                </div>

                {/* Orders List */}
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '64px' }}>Loading orders...</div>
                ) : orders.length === 0 ? (
                    <div style={{
                        background: 'var(--bg-surface)',
                        padding: '64px',
                        borderRadius: '16px',
                        textAlign: 'center'
                    }}>
                        <Package size={48} style={{ margin: '0 auto 16px', opacity: 0.3 }} />
                        <h3 style={{ margin: '0 0 8px 0' }}>No Orders Yet</h3>
                        <p style={{ margin: 0, color: 'var(--color-text-subtle)' }}>
                            Orders will appear here when customers place them.
                        </p>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gap: '16px' }}>
                        {orders.map(order => (
                            <div
                                key={order.id}
                                style={{
                                    background: 'var(--bg-surface)',
                                    padding: '24px',
                                    borderRadius: '16px',
                                    border: '1px solid var(--border-color)'
                                }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                                    <div>
                                        <h3 style={{ margin: '0 0 4px 0' }}>Order #{order.id.slice(0, 8)}</h3>
                                        <p style={{ margin: 0, fontSize: '14px', color: 'var(--color-text-subtle)' }}>
                                            {new Date(order.timestamp).toLocaleString()}
                                        </p>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{
                                            fontSize: '20px',
                                            fontWeight: 700,
                                            marginBottom: '4px'
                                        }}>
                                            ${order.total.toFixed(2)}
                                        </div>
                                        <div style={{
                                            padding: '4px 12px',
                                            borderRadius: '100px',
                                            fontSize: '12px',
                                            fontWeight: 600,
                                            background: order.status === 'accepted' ? '#10b981' :
                                                order.status === 'rejected' ? '#ef4444' : '#f59e0b',
                                            color: 'white'
                                        }}>
                                            {order.status || 'pending'}
                                            {order.status === 'accepted' && order.estimatedMinutes && ` (${order.estimatedMinutes}m)`}
                                        </div>
                                    </div>
                                </div>

                                {/* Items */}
                                <div style={{ marginBottom: '16px' }}>
                                    {order.items.map((item, idx) => (
                                        <div key={idx} style={{
                                            padding: '8px 0',
                                            borderBottom: idx < order.items.length - 1 ? '1px solid var(--border-color)' : 'none',
                                            display: 'flex',
                                            justifyContent: 'space-between'
                                        }}>
                                            <span>{item.quantity}x {item.name?.en || item.name}</span>
                                            <span>${(item.price * item.quantity).toFixed(2)}</span>
                                        </div>
                                    ))}
                                </div>

                                {/* Actions */}
                                {/* Actions */}
                                {order.status !== 'accepted' && order.status !== 'rejected' && (
                                    <div style={{ marginTop: '16px' }}>
                                        {acceptingOrderId === order.id ? (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                exit={{ opacity: 0, height: 0 }}
                                                style={{ overflow: 'hidden' }}
                                            >
                                                <div style={{ marginBottom: '8px', fontWeight: 600, fontSize: '14px' }}>Select Preparation Time:</div>
                                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginBottom: '8px' }}>
                                                    {[10, 15, 20, 30].map(mins => (
                                                        <button
                                                            key={mins}
                                                            onClick={() => updateOrderStatus(order.id, 'accepted', mins)}
                                                            style={{
                                                                padding: '8px',
                                                                borderRadius: '8px',
                                                                border: '1px solid var(--color-primary)',
                                                                background: 'rgba(255, 95, 31, 0.1)',
                                                                color: 'var(--color-primary)',
                                                                cursor: 'pointer',
                                                                fontWeight: 600
                                                            }}
                                                        >
                                                            {mins} m
                                                        </button>
                                                    ))}
                                                </div>
                                                <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                                                    <input
                                                        type="number"
                                                        placeholder="Custom min"
                                                        value={customTime}
                                                        onChange={(e) => setCustomTime(e.target.value)}
                                                        style={{
                                                            flex: 1,
                                                            padding: '8px',
                                                            borderRadius: '8px',
                                                            border: '1px solid var(--border-color)',
                                                            width: '100%'
                                                        }}
                                                    />
                                                    <button
                                                        onClick={() => {
                                                            if (customTime) updateOrderStatus(order.id, 'accepted', parseInt(customTime));
                                                        }}
                                                        disabled={!customTime}
                                                        style={{
                                                            padding: '8px 16px',
                                                            borderRadius: '8px',
                                                            border: 'none',
                                                            background: 'var(--color-ink)',
                                                            color: 'var(--bg-app)',
                                                            cursor: customTime ? 'pointer' : 'not-allowed',
                                                            fontWeight: 600,
                                                            opacity: customTime ? 1 : 0.5
                                                        }}
                                                    >
                                                        Set
                                                    </button>
                                                </div>
                                                <button
                                                    onClick={() => {
                                                        setAcceptingOrderId(null);
                                                        setCustomTime('');
                                                    }}
                                                    style={{
                                                        width: '100%',
                                                        padding: '8px',
                                                        borderRadius: '8px',
                                                        border: 'navajowhite',
                                                        background: 'var(--bg-surface-secondary)',
                                                        color: 'var(--color-text-subtle)',
                                                        cursor: 'pointer',
                                                        fontSize: '13px'
                                                    }}
                                                >
                                                    Cancel
                                                </button>
                                            </motion.div>
                                        ) : (
                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                <button
                                                    onClick={() => setAcceptingOrderId(order.id)}
                                                    style={{
                                                        flex: 1,
                                                        padding: '12px',
                                                        borderRadius: '8px',
                                                        border: 'none',
                                                        background: '#10b981',
                                                        color: 'white',
                                                        cursor: 'pointer',
                                                        fontWeight: 600,
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        gap: '8px'
                                                    }}
                                                >
                                                    <Check size={16} />
                                                    Accept
                                                </button>
                                                <button
                                                    onClick={() => updateOrderStatus(order.id, 'rejected')}
                                                    style={{
                                                        flex: 1,
                                                        padding: '12px',
                                                        borderRadius: '8px',
                                                        border: 'none',
                                                        background: '#ef4444',
                                                        color: 'white',
                                                        cursor: 'pointer',
                                                        fontWeight: 600,
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        gap: '8px'
                                                    }}
                                                >
                                                    <X size={16} />
                                                    Reject
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CafeOrdersDashboard;
