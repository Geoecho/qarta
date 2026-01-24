import React, { createContext, useContext, useState, useEffect } from 'react';
import { MENU_DATA as INITIAL_MENU } from '../data';
import { doc, setDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

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
    deals: {
        enabled: false,
        items: []
    },
    menu: INITIAL_MENU
};

const NETAVILLE_RESTAURANT = {
    id: 'netaville',
    slug: 'netaville',
    name: 'Netaville',
    type: 'Bistro',
    status: 'Active',
    logo: 'https://res.cloudinary.com/dczgkqqqr/image/upload/v1766511537/Logo1_z8tf5n.png',
    theme: {
        primary: '#000000',
        background: '#ffffff',
        surface: '#f4f4f5'
    },
    promotion: {
        active: true,
        title: 'Netaville Special',
        message: 'Experience our exclusive menu.',
        image: ''
    },
    deals: {
        enabled: false,
        items: []
    },
    menu: INITIAL_MENU
};

export const MenuProvider = ({ children }) => {
    // Start with EMPTY state - Admin must create restaurants
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [lastSaveTime, setLastSaveTime] = useState(0);
    const [saveStatus, setSaveStatus] = useState('idle'); // 'idle', 'saving', 'success', 'error'
    const [serverError, setServerError] = useState(null);

    // REAL-TIME MENU SYNC (Replaces Polling)
    useEffect(() => {
        // Subscribe to the global menu document
        const unsub = onSnapshot(doc(db, 'system', 'menuData'), (docSnap) => {
            if (docSnap.exists()) {
                const data = docSnap.data();
                if (data.restaurants && Array.isArray(data.restaurants)) {
                    // Update state instantly
                    setRestaurants(data.restaurants);
                    // Backup to local storage
                    localStorage.setItem('qarta_restaurants', JSON.stringify(data.restaurants));
                    setLoading(false);
                }
            } else {
                // Document doesn't exist yet - Use Local/Defaults
                console.warn("Menu system/menuData doc missing. Using Local/Defaults.");
                initializeDefaults();
            }
        }, (err) => {
            console.warn("Menu Sync Error:", err);
            // Fallback to local
            initializeDefaults();
        });

        return () => unsub();
    }, []);

    const initializeDefaults = () => {
        // Fallback Logic extracted
        const local = localStorage.getItem('qarta_restaurants');
        if (local) {
            try {
                setRestaurants(JSON.parse(local));
            } catch (e) {
                const seed = [DEFAULT_RESTAURANT, NETAVILLE_RESTAURANT];
                setRestaurants(seed);
            }
        } else {
            const seed = [DEFAULT_RESTAURANT, NETAVILLE_RESTAURANT];
            setRestaurants(seed);
        }
        setLoading(false);
    }

    // --- SAVE HELPER ---
    // --- SAVE HELPER ---
    // --- SAVE HELPER ---
    const saveToCloud = async (updatedRestaurants) => {
        try {
            setSaveStatus('saving');
            setServerError(null);

            // Optimistic Update
            setRestaurants(updatedRestaurants);

            // FIREBASE DIRECT WRITE (System Menu)
            // Clean undefined values (Firestore doesn't allow them)
            const cleanedData = JSON.parse(JSON.stringify({
                restaurants: updatedRestaurants,
                updatedAt: new Date().toISOString()
            }));

            await setDoc(doc(db, 'system', 'menuData'), cleanedData);

            console.log("✅ Menu synced to Firebase successfully.");
            setSaveStatus('success');
            setTimeout(() => setSaveStatus('idle'), 2000);

            // Sync successfully saved data to local storage too
            localStorage.setItem('qarta_restaurants', JSON.stringify(updatedRestaurants));

        } catch (e) {
            console.error("🚨 Cloud Save Failed (likely size or network):", e);
            setServerError(`${e.message} (Size: ${JSON.stringify(updatedRestaurants).length} bytes)`);
            setSaveStatus('error');

            // Fallback: Save to Local Storage so work isn't lost
            localStorage.setItem('qarta_restaurants', JSON.stringify(updatedRestaurants));
        }
    };

    // Auto-Sync Local Data to Cloud if Cloud is Empty (One-Time Fix)
    useEffect(() => {
        if (!loading && restaurants.length > 0) {
            // We can check if we are the admin and 'connected'
            // A simple check: If we have data, but snapshot returns empty, we should push!
            // (This logic is handled slightly by the onSnapshot fallback, but let's be explicit)
        }
    }, [loading, restaurants]);

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
                primary: '#0ea5e9',
                background: '#ffffff',
                surface: '#f8f8f8'
            },
            promotion: {
                active: false,
                title: 'Grand Opening',
                message: 'Welcome to ' + newRestaurant.name,
                image: ''
            },
            credentials: {
                username: newRestaurant.username || '',
                password: newRestaurant.password || ''
            },
            menu: [] // Start with EMPTY menu - Admin builds from scratch
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

    const addCategory = async (restaurantId, categoryData) => {
        const newCategory = {
            id: categoryData.id || `cat-${Date.now()}`,
            label: categoryData.label || { en: 'New Category', mk: 'Нова Категорија', sq: 'Kategori e Re' },
            sections: []
        };
        const updated = restaurants.map(r => {
            if (r.id !== restaurantId) return r;
            return { ...r, menu: [...r.menu, newCategory] };
        });
        await saveToCloud(updated);
    };

    const deleteCategory = async (restaurantId, categoryId) => {
        const updated = restaurants.map(r => {
            if (r.id !== restaurantId) return r;
            return { ...r, menu: r.menu.filter(c => c.id !== categoryId) };
        });
        await saveToCloud(updated);
    };

    const addSection = async (restaurantId, categoryId, sectionData) => {
        const newSection = {
            id: sectionData.id || `sec-${Date.now()}`,
            title: sectionData.title || { en: 'New Section', mk: 'Нов Дел', sq: 'Seksion i Ri' },
            items: []
        };
        const updated = restaurants.map(r => {
            if (r.id !== restaurantId) return r;
            return {
                ...r,
                menu: r.menu.map(cat => {
                    if (cat.id !== categoryId) return cat;
                    return { ...cat, sections: [...cat.sections, newSection] };
                })
            };
        });
        await saveToCloud(updated);
    };

    const deleteSection = async (restaurantId, categoryId, sectionId) => {
        const updated = restaurants.map(r => {
            if (r.id !== restaurantId) return r;
            return {
                ...r,
                menu: r.menu.map(cat => {
                    if (cat.id !== categoryId) return cat;
                    return { ...cat, sections: cat.sections.filter(s => s.id !== sectionId) };
                })
            };
        });
        await saveToCloud(updated);
    };

    const updateCategory = async (restaurantId, categoryId, categoryData) => {
        const updated = restaurants.map(r => {
            if (r.id !== restaurantId) return r;
            return {
                ...r,
                menu: r.menu.map(cat => {
                    if (cat.id !== categoryId) return cat;
                    return { ...cat, ...categoryData };
                })
            };
        });
        await saveToCloud(updated);
    };

    const updateSection = async (restaurantId, categoryId, sectionId, sectionData) => {
        const updated = restaurants.map(r => {
            if (r.id !== restaurantId) return r;
            return {
                ...r,
                menu: r.menu.map(cat => {
                    if (cat.id !== categoryId) return cat;
                    return {
                        ...cat,
                        sections: cat.sections.map(sec => {
                            if (sec.id !== sectionId) return sec;
                            return { ...sec, ...sectionData };
                        })
                    };
                })
            };
        });
        await saveToCloud(updated);
    };

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
                                    // Strip out legacy 'description' if it exists to keep doc clean
                                    const { description, ...rest } = item;
                                    return { ...rest, ...updates };
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
            desc: { en: '', mk: '', sq: '', ...(newItemData.description || newItemData.desc) },
            image: newItemData.image || 'https://via.placeholder.com/150',
            options: [],
            tag: newItemData.tag || null, // Fix: Save the subcategory tag
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
        // If no slug provided, return first restaurant or null
        if (!slug || slug === 'default') {
            return restaurants[0] || null;
        }
        // Find by slug, return null if not found (no fallback)
        return restaurants.find(r => r.slug === slug || r.id === slug) || null;
    };

    return (
        <PlatformContext.Provider value={{
            restaurants,
            loading,
            addRestaurant,
            removeRestaurant,
            updateRestaurantDetails,
            addCategory,
            updateCategory,
            deleteCategory,
            addSection,
            updateSection,
            deleteSection,
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
