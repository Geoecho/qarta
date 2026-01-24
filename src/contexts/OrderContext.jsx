import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { collection, query, where, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { httpsCallable } from 'firebase/functions';
import { db, auth, functions } from '../firebase';

const OrderContext = createContext();

export const useOrder = () => useContext(OrderContext);

export const OrderProvider = ({ children }) => {
    // START: CART PERSISTENCE
    const [cart, setCart] = useState(() => {
        if (typeof window === 'undefined') return [];
        try {
            const saved = localStorage.getItem('qarta_cart');
            return saved ? JSON.parse(saved) : [];
        } catch (e) { return []; }
    });

    // Save cart whenever it changes
    useEffect(() => {
        localStorage.setItem('qarta_cart', JSON.stringify(cart));
    }, [cart]);
    // END: CART PERSISTENCE

    // AUTH: Ensure User is Signed In (Anonymous for Customers)
    const [user, setUser] = useState(null);
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
            } else {
                // If not logged in (and we are in Client Mode), sign in anonymously
                console.log("Client: Signing in anonymously...");
                signInAnonymously(auth).catch(e => console.error("Auth Failed", e));
            }
        });
        return () => unsubscribe();
    }, []);

    // 'idle' | 'waiting' | 'confirmed'
    const [orderStatus, setOrderStatus] = useState('idle');
    const [currentOrderId, setCurrentOrderId] = useState(null);
    const [activeOrder, setActiveOrder] = useState(null);
    const [currentSlug, setCurrentSlug] = useState(null);
    // Track if we are editing an existing order vs creating new
    const [isEditing, setIsEditing] = useState(false);

    // Table ID for table-based ordering
    const [tableId, setTableId] = useState(() => {
        try {
            return sessionStorage.getItem('qarta_table') || null;
        } catch (e) { return null; }
    });

    // Track order creation time independent of state for robust grace period
    const lastOrderTimeRef = useRef(0);

    // Initial Load for specific restaurant
    const loadOrderForRestaurant = (slug) => {
        const scopedSlug = slug || 'default';
        setCurrentSlug(scopedSlug);

        const savedId = localStorage.getItem(`activeOrderId_${scopedSlug}`);
        setCurrentOrderId(savedId);

        const savedStatus = localStorage.getItem(`orderStatus_${scopedSlug}`);

        if (savedId) {
            // FIX: Restore status or default to 'waiting' ONLY if we really don't know
            // If we have a saved status (e.g. 'confirmed'), use it.
            // If not, assume 'waiting' (legacy fallback).
            // If not found, default to 'idle' to avoid stuck "Sending..." state
            // The polling effect will fix it to 'confirmed'/'waiting' if the order actually exists.
            setOrderStatus(savedStatus || 'idle');
        } else {
            setOrderStatus('idle');
            setActiveOrder(null);
        }
    };

    // REAL-TIME LISTENER (Replaces Polling)
    useEffect(() => {
        if (!currentOrderId || isEditing) return; // Stop listening if editing

        // Create query for the specific order ID
        const q = query(collection(db, 'orders'), where('id', '==', currentOrderId));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            if (!snapshot.empty) {
                const myOrder = snapshot.docs[0].data();

                // Prevent overwriting with stale data (Race Condition Fix)
                if (activeOrder && activeOrder.updatedAt && myOrder.updatedAt && myOrder.updatedAt < activeOrder.updatedAt) {
                    return;
                }

                setActiveOrder({ id: snapshot.docs[0].id, ...myOrder });

                // Map status and persist to localStorage
                if (myOrder.status === 'placed') {
                    setOrderStatus('waiting');
                    if (currentSlug) localStorage.setItem(`orderStatus_${currentSlug}`, 'waiting');
                } else if (myOrder.status === 'cancelled') {
                    setOrderStatus('confirmed'); // Show declined
                    if (currentSlug) localStorage.setItem(`orderStatus_${currentSlug}`, 'confirmed');
                } else {
                    // Accepted/Ready/Cooking/Completed
                    setOrderStatus('confirmed');
                    if (currentSlug) localStorage.setItem(`orderStatus_${currentSlug}`, 'confirmed');
                }
            } else {
                // Order not found in snapshot
                // Grace period check logic remains useful here in case of propagation delay
                const now = Date.now();
                const isFresh = (now - lastOrderTimeRef.current) < 5000;

                if (!isFresh) {
                    console.warn(`Order ${currentOrderId} not found in snapshot.`);
                    // As per previous fix, do NOT cancel automatically
                }
            }
        }, (error) => {
            console.warn("Firestore listener error:", error);
        });

        return () => unsubscribe();
    }, [currentOrderId, isEditing, currentSlug]); // Removed activeOrder?.updatedAt to avoid re-subscription loop


    // Cancel/Reset
    const cancelOrder = () => {
        setOrderStatus('idle');
        setCurrentOrderId(null);
        setActiveOrder(null);
        setIsEditing(false); // Reset edit flag
        if (currentSlug) {
            localStorage.removeItem(`activeOrderId_${currentSlug}`);
            localStorage.removeItem(`orderStatus_${currentSlug}`);
        }
        // Keep cart for editing/re-ordering
        // localStorage.removeItem('qarta_cart'); 
    };

    const resetOrder = () => {
        // Fully reset for a new order
        cancelOrder();
        clearCart();
    };

    // Cart Logic - Enhanced to handle options
    const addToCart = (item) => {
        setCart(prev => {
            // Create a unique key for items with options
            const itemKey = item.selectedOptions && item.selectedOptions.length > 0
                ? `${item.id}_${item.selectedOptions.map(o => o.id).sort().join('_')}`
                : item.id;

            // Calculate total price including options
            const optionsPrice = (item.selectedOptions || []).reduce((sum, opt) => sum + (opt.price || 0), 0);
            const itemPrice = (item.price || 0) + optionsPrice;

            const existing = prev.find(i => {
                const existingKey = i.selectedOptions && i.selectedOptions.length > 0
                    ? `${i.id}_${i.selectedOptions.map(o => o.id).sort().join('_')}`
                    : i.id;
                return existingKey === itemKey;
            });

            if (existing) {
                return prev.map(i => {
                    const existingKey = i.selectedOptions && i.selectedOptions.length > 0
                        ? `${i.id}_${i.selectedOptions.map(o => o.id).sort().join('_')}`
                        : i.id;
                    return existingKey === itemKey
                        ? { ...i, quantity: i.quantity + 1 }
                        : i;
                });
            }

            return [...prev, {
                ...item,
                quantity: 1,
                cartItemPrice: itemPrice, // Store calculated price for this cart entry
                cartItemKey: itemKey // Store unique key for identification
            }];
        });
    };

    const removeFromCart = (itemId) => {
        setCart(prev => prev.filter(i => (i.cartItemKey || i.id) !== itemId));
    };

    const updateQuantity = (itemId, delta) => {
        setCart(prev => {
            return prev.map(item => {
                const key = item.cartItemKey || item.id;
                if (key === itemId) {
                    return { ...item, quantity: Math.max(0, item.quantity + delta) };
                }
                return item;
            }).filter(item => item.quantity > 0);
        });
    };

    const clearCart = () => setCart([]);

    // Edit Order - keeps the ID to allow updating
    const editOrder = () => {
        setOrderStatus('idle');
        setIsEditing(true); // Flag update mode

        // Robustness: Ensure cart matches the order we are editing
        if (activeOrder?.items && activeOrder.items.length > 0) {
            setCart(activeOrder.items);
        }
    };

    // PLACE (or UPDATE) ORDER
    // PLACE (or UPDATE) ORDER
    const placeOrder = async (note, restaurantSlugProp) => {
        setOrderStatus('waiting'); // UI Feedback immediately
        const targetSlug = restaurantSlugProp || currentSlug || 'default';

        try {
            // HANDLE EDIT MODE (Update existing doc)
            if (isEditing && activeOrder && currentOrderId) {
                const orderRef = doc(db, 'orders', currentOrderId);
                await updateDoc(orderRef, {
                    items: cart,
                    note: note || '',
                    total: totalPrice,
                    status: 'placed', // Reset status so admin sees it as 'New'
                    updatedAt: new Date().toISOString(),
                    isEdited: true // Flag for admin
                });

                // Manual State Update (optimistic / fail-safe)
                setActiveOrder(prev => ({
                    ...prev,
                    items: [...cart],
                    note: note || '',
                    total: totalPrice,
                    status: 'placed',
                    updatedAt: new Date().toISOString(),
                    isEdited: true
                }));

                console.log("Order updated successfully:", currentOrderId);
                setIsEditing(false);
                localStorage.setItem(`orderStatus_${targetSlug}`, 'waiting');
                return;
            }

            // NEW ORDER: CALLABLE FUNCTION (Secure Server-Side Submission)
            const submitOrder = httpsCallable(functions, 'submitOrder');

            // Prepare Payload
            const payload = {
                items: cart,
                note: note || '',
                restaurantSlug: targetSlug,
                tableId: tableId || 'walk-in'
            };

            let result;
            try {
                result = await submitOrder(payload);
            } catch (firstError) {
                console.warn("First order attempt failed, retrying once...", firstError);
                // Simple 1-second delay before retry to let server recover
                await new Promise(resolve => setTimeout(resolve, 1000));
                result = await submitOrder(payload);
            }

            const { orderId } = result.data;
            // ... rest of success logic
            console.log("Order submitted successfully:", orderId);
            setCurrentOrderId(orderId);
            localStorage.setItem(`activeOrderId_${targetSlug}`, orderId);
            setOrderStatus('waiting');
            localStorage.setItem(`orderStatus_${targetSlug}`, 'waiting');

            setActiveOrder({
                id: orderId,
                status: 'placed',
                items: [...cart],
                total: totalPrice,
                updatedAt: new Date().toISOString()
            });
            setIsEditing(false);

        } catch (error) {
            console.error("Order submission failed after retry:", error);
            alert(`Order Failed: ${error.message}. Please try again.`);
            setOrderStatus('idle');
        }
    };

    const totalCount = cart.reduce((acc, item) => acc + item.quantity, 0);
    const totalPrice = cart.reduce((acc, item) => {
        const price = item.cartItemPrice || item.price || 0;
        return acc + (price * item.quantity);
    }, 0);

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
            editOrder,
            activeOrder,
            isEditing, // Exposed for UI logic
            isLocalMode: false, // Always try to be online now
            loadOrderForRestaurant,
            tableId,
            setTableId
        }
        }>
            {children}
        </OrderContext.Provider >
    );
};
