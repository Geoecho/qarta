import { Wheat, Milk, Nut, Flame, Leaf, Carrot, Egg, Fish, XCircle } from 'lucide-react';

// Standard Allergen List
export const ALLERGENS = [
    'Gluten',
    'Dairy',
    'Nuts',
    'Spicy',
    'Vegan',
    'Vegetarian',
    'Eggs',
    'Soy',
    'Seafood'
];

export const getAllergenDetails = (allergen) => {
    const normalized = allergen?.toLowerCase().trim();

    switch (normalized) {
        case 'gluten':
            return { icon: Wheat, color: '#f59e0b', label: 'Gluten' }; // Amber
        case 'dairy':
            return { icon: Milk, color: '#3b82f6', label: 'Dairy' }; // Blue
        case 'nuts':
            return { icon: Nut, color: '#854d0e', label: 'Nuts' }; // Brown
        case 'spicy':
            return { icon: Flame, color: '#ef4444', label: 'Spicy' }; // Red
        case 'vegan':
            return { icon: Leaf, color: '#22c55e', label: 'Vegan' }; // Green
        case 'vegetarian':
            return { icon: Carrot, color: '#84cc16', label: 'Veg' }; // Lime
        case 'eggs':
            return { icon: Egg, color: '#eab308', label: 'Eggs' }; // Yellow
        case 'soy':
            return { icon: Leaf, color: '#10b981', label: 'Soy' }; // Emerald
        case 'seafood':
            return { icon: Fish, color: '#0ea5e9', label: 'Seafood' }; // Sky
        default:
            return { icon: XCircle, color: '#9ca3af', label: allergen };
    }
};
