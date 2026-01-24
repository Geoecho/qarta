import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
    Coffee, Pizza, Cake, IceCream, Wine, Beer, Martini, Popcorn,
    Sandwich, Cookie, Soup, Salad, Beef, Fish, Apple, Cherry,
    Grape, Banana, Croissant, Donut, Egg, Milk, ChefHat,
    UtensilsCrossed, Utensils, Drumstick, Candy, CupSoda, GlassWater,
    Wheat, Carrot, Sprout, Leaf, Flame, Snowflake, Sun, Moon,
    Star, Heart, ThumbsUp, Smile, Lightbulb, Gift, Trophy, Crown,
    Diamond, Music, Headphones, Book, Palette, Camera, Rocket,
    Zap, CloudRain, MapPin, Home, Store, ShoppingBag, Package,
    Clock, Calendar, Tag, Percent, DollarSign, Euro,
    Menu, Grid, List, Search, Filter, Settings,
    Plus, Minus, Check, X, AlertCircle, Info,
    ChevronRight, ChevronLeft, ChevronUp, ChevronDown
} from 'lucide-react';

const ICON_SET = [
    // Food & Beverages
    { id: 'Coffee', icon: Coffee, label: 'Coffee', category: 'beverage' },
    { id: 'Pizza', icon: Pizza, label: 'Pizza', category: 'food' },
    { id: 'Cake', icon: Cake, label: 'Cake', category: 'dessert' },
    { id: 'IceCream', icon: IceCream, label: 'Ice Cream', category: 'dessert' },
    { id: 'Wine', icon: Wine, label: 'Wine', category: 'beverage' },
    { id: 'Beer', icon: Beer, label: 'Beer', category: 'beverage' },
    { id: 'Martini', icon: Martini, label: 'Cocktail', category: 'beverage' },
    { id: 'Popcorn', icon: Popcorn, label: 'Popcorn', category: 'food' },
    { id: 'Sandwich', icon: Sandwich, label: 'Sandwich', category: 'food' },
    { id: 'Cookie', icon: Cookie, label: 'Cookie', category: 'dessert' },
    { id: 'Soup', icon: Soup, label: 'Soup', category: 'food' },
    { id: 'Salad', icon: Salad, label: 'Salad', category: 'food' },
    { id: 'Beef', icon: Beef, label: 'Beef', category: 'food' },
    { id: 'Fish', icon: Fish, label: 'Fish', category: 'food' },
    { id: 'Apple', icon: Apple, label: 'Apple', category: 'fruit' },
    { id: 'Cherry', icon: Cherry, label: 'Cherry', category: 'fruit' },
    { id: 'Grape', icon: Grape, label: 'Grape', category: 'fruit' },
    { id: 'Banana', icon: Banana, label: 'Banana', category: 'fruit' },
    { id: 'Croissant', icon: Croissant, label: 'Croissant', category: 'food' },
    { id: 'Donut', icon: Donut, label: 'Donut', category: 'dessert' },
    { id: 'Egg', icon: Egg, label: 'Egg', category: 'food' },
    { id: 'Milk', icon: Milk, label: 'Milk', category: 'beverage' },
    { id: 'ChefHat', icon: ChefHat, label: 'Chef', category: 'food' },
    { id: 'UtensilsCrossed', icon: UtensilsCrossed, label: 'Dining', category: 'food' },
    { id: 'Utensils', icon: Utensils, label: 'Utensils', category: 'food' },
    { id: 'Drumstick', icon: Drumstick, label: 'Drumstick', category: 'food' },
    { id: 'Candy', icon: Candy, label: 'Candy', category: 'dessert' },
    { id: 'CupSoda', icon: CupSoda, label: 'Soda', category: 'beverage' },
    { id: 'GlassWater', icon: GlassWater, label: 'Water', category: 'beverage' },
    { id: 'Wheat', icon: Wheat, label: 'Wheat', category: 'food' },
    { id: 'Carrot', icon: Carrot, label: 'Carrot', category: 'food' },
    { id: 'Sprout', icon: Sprout, label: 'Sprout', category: 'food' },
    { id: 'Leaf', icon: Leaf, label: 'Leaf', category: 'food' },

    // Atmosphere & Features
    { id: 'Flame', icon: Flame, label: 'Hot', category: 'feature' },
    { id: 'Snowflake', icon: Snowflake, label: 'Cold', category: 'feature' },
    { id: 'Sun', icon: Sun, label: 'Sun', category: 'feature' },
    { id: 'Moon', icon: Moon, label: 'Moon', category: 'feature' },
    { id: 'Star', icon: Star, label: 'Star', category: 'feature' },
    { id: 'Heart', icon: Heart, label: 'Heart', category: 'feature' },
    { id: 'ThumbsUp', icon: ThumbsUp, label: 'Popular', category: 'feature' },
    { id: 'Smile', icon: Smile, label: 'Happy', category: 'feature' },
    { id: 'Lightbulb', icon: Lightbulb, label: 'New', category: 'feature' },
    { id: 'Gift', icon: Gift, label: 'Gift', category: 'feature' },
    { id: 'Trophy', icon: Trophy, label: 'Trophy', category: 'feature' },
    { id: 'Crown', icon: Crown, label: 'Premium', category: 'feature' },
    { id: 'Diamond', icon: Diamond, label: 'Diamond', category: 'feature' },

    // Entertainment & Lifestyle
    { id: 'Music', icon: Music, label: 'Music', category: 'lifestyle' },
    { id: 'Headphones', icon: Headphones, label: 'Audio', category: 'lifestyle' },
    { id: 'Book', icon: Book, label: 'Book', category: 'lifestyle' },
    { id: 'Palette', icon: Palette, label: 'Art', category: 'lifestyle' },
    { id: 'Camera', icon: Camera, label: 'Camera', category: 'lifestyle' },
    { id: 'Rocket', icon: Rocket, label: 'Rocket', category: 'feature' },
    { id: 'Zap', icon: Zap, label: 'Fast', category: 'feature' },
    { id: 'CloudRain', icon: CloudRain, label: 'Weather', category: 'feature' },

    // Business & Location
    { id: 'MapPin', icon: MapPin, label: 'Location', category: 'business' },
    { id: 'Home', icon: Home, label: 'Home', category: 'business' },
    { id: 'Store', icon: Store, label: 'Store', category: 'business' },
    { id: 'ShoppingBag', icon: ShoppingBag, label: 'Shopping', category: 'business' },
    { id: 'Package', icon: Package, label: 'Package', category: 'business' },

    // Time & Pricing
    { id: 'Clock', icon: Clock, label: 'Clock', category: 'utility' },
    { id: 'Calendar', icon: Calendar, label: 'Calendar', category: 'utility' },
    { id: 'Tag', icon: Tag, label: 'Tag', category: 'utility' },
    { id: 'Percent', icon: Percent, label: 'Discount', category: 'utility' },
    { id: 'DollarSign', icon: DollarSign, label: 'Dollar', category: 'utility' },
    { id: 'Euro', icon: Euro, label: 'Euro', category: 'utility' },

    // Navigation & UI
    { id: 'Menu', icon: Menu, label: 'Menu', category: 'ui' },
    { id: 'Grid', icon: Grid, label: 'Grid', category: 'ui' },
    { id: 'List', icon: List, label: 'List', category: 'ui' },
    { id: 'Search', icon: Search, label: 'Search', category: 'ui' },
    { id: 'Filter', icon: Filter, label: 'Filter', category: 'ui' },
    { id: 'Settings', icon: Settings, label: 'Settings', category: 'ui' },
];

const IconPicker = ({ selectedIcon, onSelect, showSearch = true }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [scrollPosition, setScrollPosition] = useState(0);
    const containerRef = React.useRef(null);

    const filteredIcons = useMemo(() => {
        if (!searchQuery.trim()) return ICON_SET;
        const query = searchQuery.toLowerCase();
        return ICON_SET.filter(icon =>
            icon.label.toLowerCase().includes(query) ||
            icon.category.toLowerCase().includes(query)
        );
    }, [searchQuery]);

    const scroll = (direction) => {
        if (containerRef.current) {
            const scrollAmount = 300;
            const newPosition = direction === 'left'
                ? Math.max(0, scrollPosition - scrollAmount)
                : scrollPosition + scrollAmount;

            containerRef.current.scrollTo({
                left: newPosition,
                behavior: 'smooth'
            });
            setScrollPosition(newPosition);
        }
    };

    return (
        <div>
            {showSearch && (
                <div style={{ marginBottom: '16px' }}>
                    <input
                        type="text"
                        placeholder="Search icons..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="admin-input"
                        style={{ fontSize: '14px' }}
                    />
                </div>
            )}

            {/* Horizontal Carousel */}
            <div style={{ position: 'relative' }}>
                {/* Left Scroll Button */}
                {scrollPosition > 0 && (
                    <button
                        onClick={() => scroll('left')}
                        style={{
                            position: 'absolute',
                            left: 0,
                            top: '50%',
                            transform: 'translateY(-50%)',
                            zIndex: 10,
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            border: 'none',
                            background: 'var(--bg-surface)',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        <ChevronLeft size={16} />
                    </button>
                )}

                {/* Icon Container */}
                <div
                    ref={containerRef}
                    onScroll={(e) => setScrollPosition(e.target.scrollLeft)}
                    style={{
                        display: 'flex',
                        gap: '8px',
                        overflowX: 'auto',
                        overflowY: 'hidden',
                        padding: '8px 4px',
                        scrollbarWidth: 'none',
                        msOverflowStyle: 'none'
                    }}
                    className="hide-scrollbar"
                >
                    {filteredIcons.map(({ id, icon: Icon, label }) => (
                        <motion.button
                            key={id}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => onSelect(id)}
                            title={label}
                            style={{
                                flexShrink: 0,
                                width: '56px',
                                height: '56px',
                                borderRadius: '12px',
                                border: `2px solid ${selectedIcon === id ? 'var(--color-primary)' : 'var(--border-color)'}`,
                                backgroundColor: selectedIcon === id ? 'rgba(var(--color-primary-rgb), 0.1)' : 'var(--bg-surface)',
                                color: selectedIcon === id ? 'var(--color-primary)' : 'var(--color-ink)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                        >
                            <Icon size={24} strokeWidth={selectedIcon === id ? 2.5 : 1.5} />
                        </motion.button>
                    ))}
                </div>

                {/* Right Scroll Button */}
                <button
                    onClick={() => scroll('right')}
                    style={{
                        position: 'absolute',
                        right: 0,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        zIndex: 10,
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        border: 'none',
                        background: 'var(--bg-surface)',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    <ChevronRight size={16} />
                </button>
            </div>

            <style>{`
                .hide-scrollbar::-webkit-scrollbar {
                    display: none;
                }
            `}</style>

            {/* Icon Count */}
            <div style={{
                marginTop: '12px',
                fontSize: '12px',
                color: 'var(--color-text-subtle)',
                textAlign: 'center'
            }}>
                {filteredIcons.length} icon{filteredIcons.length !== 1 ? 's' : ''} available
            </div>
        </div>
    );
};

export default IconPicker;
