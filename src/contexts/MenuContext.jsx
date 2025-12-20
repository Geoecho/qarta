import React, { createContext, useContext, useState, useEffect } from 'react';
import { MENU_DATA as INITIAL_MENU } from '../data';
import { db } from '../firebase'; // Keep imports to avoid breaking legacy refs if any

const PlatformContext = createContext();

export const usePlatform = () => useContext(PlatformContext);

// Initial Seed Data (Only used if DB is empty or offline)
const DEFAULT_RESTAURANT = {
    id: 'default',
    slug: 'default',
    name: 'Default Restaurant',
    type: 'Fine Dining',
    status: 'Active',
    logo: '/logo.png',
    theme: {
        primary: '#ff5f1f',
        background: '#ffffff',
        surface: '#f8f8f8'
    },
    promotion: {
        active: false,
        title: 'Welcome!',
        message: 'Check out our new specials.',
        image: ''
    },
    menu: INITIAL_MENU
};

export const MenuProvider = ({ children }) => {
    // START OPTIMISTIC: Initialize with default data
    const [restaurants, setRestaurants] = useState([DEFAULT_RESTAURANT]);
    const [loading, setLoading] = useState(false);

    // Sync with Vercel KV API (Polling for updates, saving on change)
    useEffect(() => {
        const fetchRestaurants = async () => {
            try {
                const res = await fetch('/api/menu');
                if (res.ok) {
                    const data = await res.json();
                    if (Array.isArray(data) && data.length > 0) {
                        setRestaurants(data);
                    }
                }
            } catch (e) {
                console.warn("Menu sync failed (offline mode):", e);
            }
        };

        fetchRestaurants();
        // Poll infrequently just to keep fresh if multiple admins exist
        const interval = setInterval(fetchRestaurants, 15000);
        return () => clearInterval(interval);
    }, []);

    // --- SAVE HELPER ---
    const saveToCloud = async (updatedRestaurants) => {
        try {
            // Optimistic Update First
            setRestaurants(updatedRestaurants);

            // Send to KV
            await fetch('/api/menu', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ restaurants: updatedRestaurants })
            });
        } catch (e) {
            console.error("Failed to save menu:", e);
            alert("Warning: Changes saved locally but failed to sync to server.");
        }
    };

    // --- Admin Actions ---

    const addRestaurant = async (newRestaurant) => {
        const id = Date.now().toString();
        const payload = {
            ...newRestaurant,
            id,
            status: 'Active',
            logo: '/logo.png',
            theme: {
                primary: '#ff5f1f',
                background: '#ffffff',
                surface: '#f8f8f8'
            },
            promotion: {
                active: false,
                title: 'Grand Opening',
                message: 'Welcome to ' + newRestaurant.name,
                image: ''
            },
            menu: INITIAL_MENU
        };
        const updated = [...restaurants, payload];
        await saveToCloud(updated);
    };

    const removeRestaurant = async (id) => {
        const updated = restaurants.filter(r => r.id !== id);
        await saveToCloud(updated);
    };

    const updateRestaurantDetails = async (id, details) => {
        const updated = restaurants.map(r => r.id === id ? { ...r, ...details } : r);
        await saveToCloud(updated);
    };

    // --- Menu Editing ---

    const updateMenuItem = async (restaurantId, categoryId, sectionId, itemId, updates) => {
        const updated = restaurants.map(restaurant => {
            if (restaurant.id !== restaurantId) return restaurant;
            return {
                ...restaurant,
                menu: restaurant.menu.map(category => {
                    if (category.id !== categoryId) return category;
                    return {
                        ...category,
                        sections: category.sections.map(section => {
                            if (section.id !== sectionId) return section;
                            return {
                                ...section,
                                items: section.items.map(item => {
                                    if (item.id !== itemId) return item;
                                    return { ...item, ...updates };
                                })
                            };
                        })
                    };
                })
            };
        });
        await saveToCloud(updated);
    };

    const addMenuItem = async (restaurantId, categoryId, sectionId, newItemData) => {
        const newItem = {
            id: `item-${Date.now()}`,
            name: { en: 'New Item', mk: 'Нова Ставка', sq: 'Artikull i Ri', ...newItemData.name },
            price: parseFloat(newItemData.price) || 0,
            description: { en: '', mk: '', sq: '', ...newItemData.description },
            image: newItemData.image || 'https://via.placeholder.com/150',
            options: [],
            tags: []
        };

        const updated = restaurants.map(restaurant => {
            if (restaurant.id !== restaurantId) return restaurant;
            return {
                ...restaurant,
                menu: restaurant.menu.map(category => {
                    if (category.id !== categoryId) return category;
                    return {
                        ...category,
                        sections: category.sections.map(section => {
                            if (section.id !== sectionId) return section;
                            return {
                                ...section,
                                items: [newItem, ...section.items]
                            };
                        })
                    };
                })
            };
        });
        await saveToCloud(updated);
    };

    const getRestaurantBySlug = (slug) => {
        if (!slug) return restaurants[0] || null;
        return restaurants.find(r => r.slug === slug || r.id === slug) || restaurants[0] || null;
    };

    return (
        <PlatformContext.Provider value={{
            restaurants,
            loading,
            addRestaurant,
            removeRestaurant,
            updateRestaurantDetails,
            updateMenuItem,
            addMenuItem,
            getRestaurantBySlug
        }}>
            {children}
        </PlatformContext.Provider>
    );
};
