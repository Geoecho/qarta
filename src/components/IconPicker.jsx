import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, X } from 'lucide-react';
import * as Icons from '../utils/iconMatcher';

// List of all available icons with their names
const ICON_LIST = [
    { id: 'Coffee', name: 'Coffee', Icon: Icons.Coffee },
    { id: 'Beer', name: 'Beer', Icon: Icons.Beer },
    { id: 'Wine', name: 'Wine', Icon: Icons.Wine },
    { id: 'Martini', name: 'Cocktail', Icon: Icons.Martini },
    { id: 'GlassWater', name: 'Water/Drinks', Icon: Icons.GlassWater },
    { id: 'CupSoda', name: 'Soda', Icon: Icons.CupSoda },
    { id: 'Milk', name: 'Milk', Icon: Icons.Milk },
    { id: 'Pizza', name: 'Pizza', Icon: Icons.Pizza },
    { id: 'Utensils', name: 'Utensils/Pasta', Icon: Icons.Utensils },
    { id: 'Sandwich', name: 'Burger/Sandwich', Icon: Icons.Sandwich },
    { id: 'Soup', name: 'Soup/Starter', Icon: Icons.Soup },
    { id: 'Salad', name: 'Salad', Icon: Icons.Salad },
    { id: 'Beef', name: 'Beef/Steak', Icon: Icons.Beef },
    { id: 'Drumstick', name: 'Chicken', Icon: Icons.Drumstick },
    { id: 'Fish', name: 'Fish/Seafood', Icon: Icons.Fish },
    { id: 'Egg', name: 'Egg/Breakfast', Icon: Icons.Egg },
    { id: 'Croissant', name: 'Bakery', Icon: Icons.Croissant },
    { id: 'Sunrise', name: 'Breakfast', Icon: Icons.Sunrise },
    { id: 'Wheat', name: 'Grain/Cereal', Icon: Icons.Wheat },
    { id: 'Cookie', name: 'Cookie', Icon: Icons.Cookie },
    { id: 'IceCream', name: 'Ice Cream', Icon: Icons.IceCream },
    { id: 'Cake', name: 'Cake/Dessert', Icon: Icons.Cake },
    { id: 'Candy', name: 'Candy', Icon: Icons.Candy },
    { id: 'Popcorn', name: 'Popcorn/Snack', Icon: Icons.Popcorn },
    { id: 'Apple', name: 'Fruit', Icon: Icons.Apple },
    { id: 'Grape', name: 'Grape/Berry', Icon: Icons.Grape },
    { id: 'Cherry', name: 'Cherry', Icon: Icons.Cherry },
    { id: 'Citrus', name: 'Citrus', Icon: Icons.Citrus },
    { id: 'Carrot', name: 'Vegetable', Icon: Icons.Carrot },
    { id: 'Leaf', name: 'Green/Herb', Icon: Icons.Leaf },
    { id: 'Flame', name: 'Spicy/Hot', Icon: Icons.Flame },
    { id: 'ChefHat', name: 'Chef Special', Icon: Icons.ChefHat },
    { id: 'Shell', name: 'Shellfish', Icon: Icons.Shell }
];

const IconPicker = ({ selectedIcon, onSelect, onClose }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredIcons = ICON_LIST.filter(icon =>
        icon.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        icon.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div style={{
            background: 'var(--bg-surface)',
            borderRadius: '12px',
            padding: '16px',
            border: '1px solid var(--border-color)'
        }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 600 }}>Select Icon</h4>
                {onClose && (
                    <button
                        onClick={onClose}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            padding: '4px',
                            display: 'flex',
                            color: 'var(--color-text-subtle)'
                        }}
                    >
                        <X size={16} />
                    </button>
                )}
            </div>

            {/* Search */}
            <div style={{ position: 'relative', marginBottom: '12px' }}>
                <Search size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-subtle)' }} />
                <input
                    type="text"
                    placeholder="Search icons..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                        width: '100%',
                        padding: '8px 8px 8px 32px',
                        borderRadius: '8px',
                        border: '1px solid var(--border-color)',
                        fontSize: '13px',
                        background: 'var(--bg-app)'
                    }}
                />
            </div>

            {/* Icon Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(60px, 1fr))',
                gap: '8px',
                maxHeight: '300px',
                overflowY: 'auto'
            }}>
                {filteredIcons.map(({ id, name, Icon }) => {
                    const isSelected = selectedIcon === id;
                    return (
                        <motion.button
                            key={id}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => onSelect(id)}
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                padding: '12px 8px',
                                borderRadius: '8px',
                                border: isSelected ? '2px solid var(--color-primary)' : '1px solid var(--border-color)',
                                background: isSelected ? 'var(--color-primary-light, rgba(99, 102, 241, 0.1))' : 'var(--bg-surface)',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                gap: '4px'
                            }}
                            title={name}
                        >
                            <Icon size={24} style={{ color: isSelected ? 'var(--color-primary)' : 'var(--color-ink)' }} />
                            <span style={{
                                fontSize: '10px',
                                color: isSelected ? 'var(--color-primary)' : 'var(--color-text-subtle)',
                                textAlign: 'center',
                                lineHeight: 1.2,
                                maxWidth: '100%',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap'
                            }}>
                                {name.split('/')[0]}
                            </span>
                        </motion.button>
                    );
                })}
            </div>

            {filteredIcons.length === 0 && (
                <div style={{ textAlign: 'center', padding: '32px', color: 'var(--color-text-subtle)' }}>
                    No icons found
                </div>
            )}
        </div>
    );
};

export default IconPicker;
