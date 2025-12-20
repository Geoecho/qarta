import React, { createContext, useContext, useState } from 'react';

const OrderContext = createContext();

export const useOrder = () => useContext(OrderContext);

export const OrderProvider = ({ children }) => {
    const [cart, setCart] = useState([]);

    // 'idle' | 'waiting' | 'confirmed'
    const [orderStatus, setOrderStatus] = useState('idle');

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
    const placeOrder = () => {
        setOrderStatus('waiting');
        // Simulate network/kitchen delay
        setTimeout(() => {
            setOrderStatus('confirmed');
        }, 4000); // 4 seconds of waiting
    };

    // Reset to start a new order
    const resetOrder = () => {
        setOrderStatus('idle');
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
            resetOrder
        }}>
            {children}
        </OrderContext.Provider>
    );
};
