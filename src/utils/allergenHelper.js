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

// Allergen Translations
const ALLERGEN_TRANSLATIONS = {
    gluten: {
        en: 'Gluten',
        mk: 'Глутен',
        sq: 'Gluten'
    },
    dairy: {
        en: 'Dairy',
        mk: 'Млечни',
        sq: 'Qumësht'
    },
    nuts: {
        en: 'Nuts',
        mk: 'Јатки',
        sq: 'Arra'
    },
    spicy: {
        en: 'Spicy',
        mk: 'Луто',
        sq: 'Pikant'
    },
    vegan: {
        en: 'Vegan',
        mk: 'Веган',
        sq: 'Vegan'
    },
    vegetarian: {
        en: 'Vegetarian',
        mk: 'Вегетаријанско',
        sq: 'Vegjetarian'
    },
    eggs: {
        en: 'Eggs',
        mk: 'Јајца',
        sq: 'Vezë'
    },
    soy: {
        en: 'Soy',
        mk: 'Соја',
        sq: 'Sojë'
    },
    seafood: {
        en: 'Seafood',
        mk: 'Морски',
        sq: 'Ushqim Deti'
    }
};

export const getAllergenDetails = (allergen, language = 'en') => {
    const normalized = allergen?.toLowerCase().trim();

    const getLabel = (key) => {
        return ALLERGEN_TRANSLATIONS[key]?.[language] || ALLERGEN_TRANSLATIONS[key]?.en || allergen;
    };

    switch (normalized) {
        case 'gluten':
            return { icon: Wheat, color: '#f59e0b', label: getLabel('gluten') }; // Amber
        case 'dairy':
            return { icon: Milk, color: '#3b82f6', label: getLabel('dairy') }; // Blue
        case 'nuts':
            return { icon: Nut, color: '#854d0e', label: getLabel('nuts') }; // Brown
        case 'spicy':
            return { icon: Flame, color: '#ef4444', label: getLabel('spicy') }; // Red
        case 'vegan':
            return { icon: Leaf, color: '#22c55e', label: getLabel('vegan') }; // Green
        case 'vegetarian':
            return { icon: Carrot, color: '#84cc16', label: getLabel('vegetarian') }; // Lime
        case 'eggs':
            return { icon: Egg, color: '#eab308', label: getLabel('eggs') }; // Yellow
        case 'soy':
            return { icon: Leaf, color: '#10b981', label: getLabel('soy') }; // Emerald
        case 'seafood':
            return { icon: Fish, color: '#0ea5e9', label: getLabel('seafood') }; // Sky
        default:
            return { icon: XCircle, color: '#9ca3af', label: allergen };
    }
};
