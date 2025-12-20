import {
    Coffee, Utensils, Wine, Martini, Soup, Salad, Pizza, Croissant, IceCream,
    GlassWater, Snowflake, Beer, Sunrise, Beef, Fish, Cake, Apple, Sandwich,
    Cookie, Milk, Grape, Cherry, Flame, Leaf, Drumstick, Egg, Wheat, ChefHat,
    CupSoda, Candy, Popcorn, Shell, Citrus, Carrot
} from 'lucide-react';

// Comprehensive icon mapping with smart keyword matching
const ICON_KEYWORDS = {
    // Drinks
    Coffee: ['coffee', 'espresso', 'cappuccino', 'latte', 'mocha', 'americano', 'macchiato'],
    Beer: ['beer', 'lager', 'ale', 'ipa', 'stout', 'pilsner', 'brew'],
    Wine: ['wine', 'vino', 'вино', 'verë', 'red wine', 'white wine', 'rosé', 'champagne', 'prosecco'],
    Martini: ['cocktail', 'martini', 'alcoholic', 'liquor', 'spirits', 'mixed drink', 'bar'],
    GlassWater: ['water', 'soft drink', 'soda', 'juice', 'beverage', 'drink'],
    CupSoda: ['soda', 'cola', 'pepsi', 'sprite', 'fanta', 'carbonated'],
    Milk: ['milk', 'dairy', 'shake', 'smoothie', 'milkshake'],

    // Food Categories
    Pizza: ['pizza', 'пица', 'pica'],
    Utensils: ['pasta', 'noodles', 'spaghetti', 'linguine', 'fettuccine', 'main', 'entrée'],
    Sandwich: ['sandwich', 'burger', 'wrap', 'panini', 'sub', 'hoagie'],
    Soup: ['soup', 'stew', 'broth', 'chowder', 'bisque', 'starter', 'appetizer'],
    Salad: ['salad', 'greens', 'салата', 'sallatë', 'fresh', 'healthy'],

    // Proteins
    Beef: ['beef', 'steak', 'meat', 'месо', 'mish', 'ribeye', 'sirloin'],
    Drumstick: ['chicken', 'poultry', 'wings', 'fried chicken', 'roast'],
    Fish: ['fish', 'seafood', 'salmon', 'tuna', 'shrimp', 'lobster', 'crab'],
    Egg: ['egg', 'omelette', 'breakfast', 'brunch'],

    // Bakery & Breakfast
    Croissant: ['bakery', 'pastry', 'croissant', 'danish', 'bread', 'baked'],
    Sunrise: ['breakfast', 'brunch', 'morning', 'доручек'],
    Wheat: ['grain', 'cereal', 'oats', 'granola'],
    Cookie: ['cookie', 'biscuit', 'cracker'],

    // Desserts
    IceCream: ['ice cream', 'gelato', 'frozen', 'sundae', 'sorbet'],
    Cake: ['cake', 'торта', 'ëmbëlsirë', 'dessert', 'sweet', 'cupcake'],
    Candy: ['candy', 'chocolate', 'bonbon', 'sweets'],
    Popcorn: ['popcorn', 'snack', 'chips'],

    // Fruits & Vegetables
    Apple: ['fruit', 'apple', 'banana', 'orange', 'fresh fruit'],
    Grape: ['grape', 'berry', 'berries', 'strawberry', 'blueberry'],
    Cherry: ['cherry', 'tropical', 'exotic'],
    Citrus: ['citrus', 'lemon', 'lime', 'grapefruit'],
    Carrot: ['vegetable', 'veggie', 'vegan', 'vegetarian'],
    Leaf: ['green', 'organic', 'natural', 'herb', 'basil'],

    // Special
    Flame: ['hot', 'spicy', 'grilled', 'bbq', 'barbecue', 'fire'],
    ChefHat: ['chef', 'special', 'signature', 'house special'],
    Shell: ['shellfish', 'oyster', 'mussel', 'clam']
};

// Smart icon matcher
export const getSmartIcon = (text) => {
    if (!text) return Utensils;

    const searchText = text.toLowerCase();

    // Try exact ID match first
    const exactMatch = Object.entries(ICON_KEYWORDS).find(([icon, keywords]) =>
        keywords.includes(searchText)
    );
    if (exactMatch) return eval(exactMatch[0]);

    // Try partial keyword match
    const partialMatch = Object.entries(ICON_KEYWORDS).find(([icon, keywords]) =>
        keywords.some(keyword => searchText.includes(keyword) || keyword.includes(searchText))
    );
    if (partialMatch) return eval(partialMatch[0]);

    // Fallback to Utensils
    return Utensils;
};

// Export all icons for direct use
export {
    Coffee, Utensils, Wine, Martini, Soup, Salad, Pizza, Croissant, IceCream,
    GlassWater, Snowflake, Beer, Sunrise, Beef, Fish, Cake, Apple, Sandwich,
    Cookie, Milk, Grape, Cherry, Flame, Leaf, Drumstick, Egg, Wheat, ChefHat,
    CupSoda, Candy, Popcorn, Shell, Citrus, Carrot
};
