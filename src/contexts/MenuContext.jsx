import React, { createContext, useContext, useState, useEffect } from 'react';
import { MENU_DATA as INITIAL_MENU } from '../data';
import { db } from '../firebase';
import { collection, onSnapshot, doc, setDoc, deleteDoc, updateDoc, getDoc } from 'firebase/firestore';

const PlatformContext = createContext();

export const usePlatform = () => useContext(PlatformContext);

// Initial Seed Data (Only used if DB is empty)
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
    // START OPTIMISTIC: Initialize with default data so UI shows immediately
    const [restaurants, setRestaurants] = useState([DEFAULT_RESTAURANT]);
    const [loading, setLoading] = useState(false); // No global blocking loading state

    // Sync with Firestore Realtime
    useEffect(() => {
        const unsubscribe = onSnapshot(
            collection(db, 'restaurants'),
            (snapshot) => {
                const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

                if (data.length > 0) {
                    setRestaurants(data);
                } else {
                    // Only seed if empty and we have connection, 
                    // otherwise we keep using our local default default
                    seedDatabase().catch(e => console.error("Auto-seed failed", e));
                }
            },
            (error) => {
                console.warn("Firestore sync error (offline?):", error);
                // We just keep the current (optimistic) state
            }
        );

        return () => unsubscribe();
    }, []);



    const seedDatabase = async () => {
        try {
            await setDoc(doc(db, 'restaurants', 'default'), DEFAULT_RESTAURANT);
        } catch (e) {
            console.error("Failed to seed database:", e);
            throw e;
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
        await setDoc(doc(db, 'restaurants', id), payload);
    };

    const removeRestaurant = async (id) => {
        await deleteDoc(doc(db, 'restaurants', id));
    };

    const updateRestaurantDetails = async (id, details) => {
        const ref = doc(db, 'restaurants', id);
        await updateDoc(ref, details);
    };

    // --- Menu Editing ---
    // Firestore doesn't support deep array updates easily.
    // We strictly read -> modify -> write back the whole menu array.

    const updateMenuItem = async (restaurantId, categoryId, sectionId, itemId, updates) => {
        const restaurant = restaurants.find(r => r.id === restaurantId);
        if (!restaurant) return;

        const newMenu = restaurant.menu.map(category => {
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
        });

        await updateDoc(doc(db, 'restaurants', restaurantId), { menu: newMenu });
    };

    const addMenuItem = async (restaurantId, categoryId, sectionId, newItemData) => {
        const restaurant = restaurants.find(r => r.id === restaurantId);
        if (!restaurant) return;

        const newItem = {
            id: `item-${Date.now()}`,
            name: { en: 'New Item', mk: 'Нова Ставка', sq: 'Artikull i Ri', ...newItemData.name },
            price: parseFloat(newItemData.price) || 0,
            description: { en: '', mk: '', sq: '', ...newItemData.description },
            image: newItemData.image || 'https://via.placeholder.com/150',
            options: [],
            tags: []
        };

        const newMenu = restaurant.menu.map(category => {
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
        });

        await updateDoc(doc(db, 'restaurants', restaurantId), { menu: newMenu });
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
