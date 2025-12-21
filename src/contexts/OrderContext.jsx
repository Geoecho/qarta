import React, { createContext, useContext, useState, useEffect } from 'react';
import { db, auth } from '../firebase'; // Kept imports for safety, but unused
// import { collection, addDoc, onSnapshot, doc, serverTimestamp } from 'firebase/firestore'; // Commented out
// import { signInAnonymously } from 'firebase/auth'; // Commented out

const OrderContext = createContext();

export const useOrder = () => useContext(OrderContext);

export const OrderProvider = ({ children }) => {
    const [cart, setCart] = useState([]);

    // 'idle' | 'waiting' | 'confirmed'
    const [orderStatus, setOrderStatus] = useState('idle');
    const [currentOrderId, setCurrentOrderId] = useState(null);
    const [activeOrder, setActiveOrder] = useState(null);
    const [isLocalMode, setIsLocalMode] = useState(!db);
    const [currentSlug, setCurrentSlug] = useState(null);

    // Load order for specific restaurant
    const loadOrderForRestaurant = (slug) => {
        const scopedSlug = slug || 'default';
        setCurrentSlug(scopedSlug);
        const savedId = localStorage.getItem(`activeOrderId_${scopedSlug}`);
        setCurrentOrderId(savedId);

        if (savedId) {
            setOrderStatus('waiting'); // Assume waiting initially if ID exists
        } else {
            setOrderStatus('idle');
            setActiveOrder(null);
        }
    };

    // --- EFFECT: LIVE ORDER LISTEN (POLLING VERCEL API) ---
    useEffect(() => {
        // If we are on localhost, the /api route might not exist (unless vercel dev).
        // So we just stick to local mode or try fetching once.
        const hostname = window.location.hostname;
        const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1';

        // Polling function
        const fetchOrders = async () => {
            if (!currentOrderId) return;

            try {
                const res = await fetch('/api/orders');
                if (!res.ok) throw new Error("API Error");
                const orders = await res.json();

                // Find my active order
                if (currentOrderId) {
                    const myOrder = orders.find(o => o.id === currentOrderId);
                    if (myOrder) {
                        setActiveOrder(myOrder);
                        setOrderStatus('confirmed');
                        setIsLocalMode(false); // API worked!
                    }
                }
            } catch (e) {
                if (!isLocalhost) console.warn("Sync failed:", e);
                setIsLocalMode(true);
            }
        };

        if (currentOrderId && !isLocalMode) {
            // Poll every 5 seconds if we think we have server access
            const interval = setInterval(fetchOrders, 5000);
            fetchOrders(); // Initial check
            return () => clearInterval(interval);
        }
    }, [currentOrderId, isLocalMode]);

    // Local Fallback checker
    useEffect(() => {
        if (isLocalMode && currentOrderId) {
            try {
                const raw = localStorage.getItem('local_orders');
                if (raw) {
                    const all = JSON.parse(raw);
                    const mine = all.find(o => o.id === currentOrderId);
                    if (mine) {
                        setActiveOrder(mine);
                        setOrderStatus('confirmed');
                    }
                }
            } catch (e) { }
        }
    }, [isLocalMode, currentOrderId]);

    // Cancel current order
    const cancelOrder = () => {
        setOrderStatus('idle');
        setCurrentOrderId(null);
        setActiveOrder(null);
        if (currentSlug) {
            localStorage.removeItem(`activeOrderId_${currentSlug}`);
        }
        setCart([]);
    };

    const addToCart = (item) => {
        setCart(prev => {
            const existing = prev.find(i => i.id === item.id);
            if (existing) {
                return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
            }
            return [...prev, { ...item, quantity: 1 }];
        });
    };

    const removeFromCart = (itemId) => {
        setCart(prev => prev.filter(i => i.id !== itemId));
    };

    const updateQuantity = (itemId, delta) => {
        setCart(prev => {
            return prev.map(item => {
                if (item.id === itemId) {
                    return { ...item, quantity: Math.max(0, item.quantity + delta) };
                }
                return item;
            }).filter(item => item.quantity > 0);
        });
    };

    const clearCart = () => setCart([]);

    // Logic to handle order placement
    const placeOrder = async (restaurantSlug = 'default') => {
        setOrderStatus('waiting');

        try {
            const orderDoc = {
                items: cart.map(item => ({
                    id: item.id,
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity
                })),
                total: totalPrice,
                status: 'placed',
                restaurantSlug: restaurantSlug, // Add restaurant slug
                timestamp: new Date().toISOString(),
                // createdAt: serverTimestamp(), // Removed Firebase specific timestamp
                estimatedMinutes: null
            };

            let newId = 'ord-' + Date.now();
            const payload = { ...orderDoc, id: newId };

            try {
                // Try sending to Vercel API
                const res = await fetch('/api/orders', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                if (res.ok) {
                    setIsLocalMode(false);
                } else {
                    throw new Error("API Offline");
                }
            } catch (apiError) {
                console.warn("API Offline, using LocalStorage Demo Mode.");
                setIsLocalMode(true);

                // Fallback: Save to LocalStorage "orders" array
                const localOrder = payload;
                const existingRaw = localStorage.getItem('local_orders');
                const existing = existingRaw ? JSON.parse(existingRaw) : [];
                existing.push(localOrder);
                localStorage.setItem('local_orders', JSON.stringify(existing));

                setActiveOrder(localOrder);
                setOrderStatus('confirmed');
            }

            setCurrentOrderId(newId);
            localStorage.setItem('activeOrderId', newId);

        } catch (error) {
            console.error("Critical Error placing order:", error);
            alert("Could not place order. Please try again.");
            setOrderStatus('idle');
        }
    };

    // Reset to start a new order
    const resetOrder = () => {
        setOrderStatus('idle');
        setCurrentOrderId(null);
        setActiveOrder(null);
        localStorage.removeItem('activeOrderId');
        clearCart();
    };

    const totalCount = cart.reduce((acc, item) => acc + item.quantity, 0);
    const totalPrice = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    return (
        <OrderContext.Provider value={{
            cart,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            totalCount,
            totalPrice,
            orderStatus,
            placeOrder,
            resetOrder,
            cancelOrder,
            activeOrder,
            isLocalMode,
            loadOrderForRestaurant
        }}>
            {children}
        </OrderContext.Provider>
    );
};
