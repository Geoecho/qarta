import React, { createContext, useContext, useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { collection, addDoc, onSnapshot, doc, serverTimestamp } from 'firebase/firestore';
import { signInAnonymously } from 'firebase/auth';

const OrderContext = createContext();

export const useOrder = () => useContext(OrderContext);

export const OrderProvider = ({ children }) => {
    const [cart, setCart] = useState([]);

    // 'idle' | 'waiting' | 'confirmed'
    const [orderStatus, setOrderStatus] = useState('idle');
    // Initialize from LocalStorage to survive refreshes
    const [currentOrderId, setCurrentOrderId] = useState(() => localStorage.getItem('activeOrderId'));
    const [activeOrder, setActiveOrder] = useState(null);

    // --- EFFECT: AUTH ---
    useEffect(() => {
        if (!auth) return;
        try {
            signInAnonymously(auth).catch(err => console.warn("Anon Auth failed:", err));
        } catch (e) {
            console.warn("Auth initialization error:", e);
        }
    }, []);

    // --- EFFECT: LIVE ORDER LISTEN ---
    useEffect(() => {
        if (!currentOrderId) return;

        let unsubscribe = () => { };

        // 1. Try Firebase
        if (db) {
            try {
                unsubscribe = onSnapshot(doc(db, 'orders', currentOrderId), (snapshot) => {
                    if (snapshot.exists()) {
                        const data = snapshot.data();
                        setActiveOrder({ id: snapshot.id, ...data });
                        setOrderStatus('confirmed');
                    }
                }, (error) => {
                    console.error("Firestore listen error, falling back to local:", error);
                    fallbackToLocal(currentOrderId);
                });
            } catch (e) {
                console.error("Firestore setup error:", e);
                fallbackToLocal(currentOrderId);
            }
        } else {
            fallbackToLocal(currentOrderId);
        }

        return () => unsubscribe();
    }, [currentOrderId]);

    const fallbackToLocal = (id) => {
        // Simple fallback: Retrieve from local storage if exists
        try {
            const raw = localStorage.getItem('local_orders');
            if (raw) {
                const all = JSON.parse(raw);
                const mine = all.find(o => o.id === id);
                if (mine) {
                    setActiveOrder(mine);
                    setOrderStatus('confirmed');
                }
            }
        } catch (e) { }
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
    const placeOrder = async () => {
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
                createdAt: serverTimestamp(),
                estimatedMinutes: null
            };

            let newId;
            try {
                if (db) {
                    const docRef = await addDoc(collection(db, 'orders'), orderDoc);
                    newId = docRef.id;
                } else {
                    throw new Error("No Database");
                }
            } catch (dbError) {
                console.warn("Database offline/blocked, using LocalStorage Demo Mode.");
                // Fallback: Save to LocalStorage "orders" array
                newId = 'local-' + Date.now();
                const localOrder = { id: newId, ...orderDoc };

                const existingRaw = localStorage.getItem('local_orders');
                const existing = existingRaw ? JSON.parse(existingRaw) : [];
                existing.push(localOrder);
                localStorage.setItem('local_orders', JSON.stringify(existing));

                // Trigger local update manually since we aren't using a listener for local
                setActiveOrder(localOrder);
                setOrderStatus('confirmed'); // Skip 'waiting' in local mode for instant feedback
            }

            setCurrentOrderId(newId);
            localStorage.setItem('activeOrderId', newId);

            // status will update via snapshot listener if using Firebase
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
            activeOrder
        }}>
            {children}
        </OrderContext.Provider>
    );
};
