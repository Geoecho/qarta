// Currency formatting helper

export const CURRENCIES = {
    MKD: {
        code: 'MKD',
        symbol: 'МКД',
        name: 'Macedonian Denar'
    },
    EUR: {
        code: 'EUR',
        symbol: '€',
        name: 'Euro'
    }
};

/**
 * Format price with currency symbol
 * @param {number} price - The price to format
 * @param {string} currency - Currency code ('MKD' or 'EUR')
 * @returns {string} Formatted price string
 */
export const formatPrice = (price, currency = 'MKD') => {
    const curr = CURRENCIES[currency] || CURRENCIES.MKD;

    if (currency === 'EUR') {
        return `${curr.symbol}${price.toFixed(2)}`;
    }

    // MKD format: "120 ден"
    return `${Math.round(price)} ${curr.symbol}`;
};

/**
 * Get currency symbol
 * @param {string} currency - Currency code
 * @returns {string} Currency symbol
 */
export const getCurrencySymbol = (currency = 'MKD') => {
    return CURRENCIES[currency]?.symbol || CURRENCIES.MKD.symbol;
};
