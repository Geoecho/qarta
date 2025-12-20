import React, { createContext, useContext, useState, useEffect } from 'react';
import { MENU_DATA as INITIAL_MENU } from '../data';
// import { db } from '../firebase'; 

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
    const [lastSaveTime, setLastSaveTime] = useState(0);
    const [saveStatus, setSaveStatus] = useState('idle'); // 'idle', 'saving', 'success', 'error'
    const [serverError, setServerError] = useState(null);

    // Sync with Vercel KV API (Polling for updates, saving on change)
    useEffect(() => {
        const fetchRestaurants = async () => {
            // Don't fetch if we just saved (prevent overwriting local optimistic state with stale server state)
            if (Date.now() - lastSaveTime < 5000) return;

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
        // Poll frequently (2s) for "Instant" feeling
        const interval = setInterval(fetchRestaurants, 2000);
        return () => clearInterval(interval);
    }, [lastSaveTime]); // Re-create interval if save time changes is fine

    // --- SAVE HELPER ---
    const saveToCloud = async (updatedRestaurants) => {
        try {
            setSaveStatus('saving');
            setServerError(null);

            // Optimistic Update First
            setRestaurants(updatedRestaurants);
            setLastSaveTime(Date.now()); // Block polling for 5s

            // Send to Redis
            const res = await fetch('/api/menu', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ restaurants: updatedRestaurants })
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || "Server rejected save");
            }

            setSaveStatus('success');
            setTimeout(() => setSaveStatus('idle'), 2000);

        } catch (e) {
            console.error("Failed to save menu:", e);
            setSaveStatus('error');
            setServerError(e.message);
        }
    };

    // --- Admin Actions ---

    const addRestaurant = async (newRestaurant) => {
        const id = Date.now().toString();
        const payload = {
            ...newRestaurant,
            id, // IMPORTANT: Ensure id is string
            slug: newRestaurant.slug || id, // Ensure slug exists
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

    const deleteMenuItem = async (restaurantId, categoryId, sectionId, itemId) => {
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
                                items: section.items.filter(item => item.id !== itemId)
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
            deleteMenuItem,
            getRestaurantBySlug,
            saveStatus,
            serverError
        }}>
            {children}
        </PlatformContext.Provider>
    );
};
