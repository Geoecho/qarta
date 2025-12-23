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

// Exchange rate: 1 MKD = ~0.016 EUR (approximate, update as needed)
const MKD_TO_EUR_RATE = 0.016;

/**
 * Convert price between currencies
 * @param {number} price - The price to convert
 * @param {string} fromCurrency - Source currency
 * @param {string} toCurrency - Target currency
 * @returns {number} Converted price
 */
export const convertCurrency = (price, fromCurrency, toCurrency) => {
    if (fromCurrency === toCurrency) return price;

    // Assuming prices are stored in MKD
    if (fromCurrency === 'MKD' && toCurrency === 'EUR') {
        return price * MKD_TO_EUR_RATE;
    }
    if (fromCurrency === 'EUR' && toCurrency === 'MKD') {
        return price / MKD_TO_EUR_RATE;
    }

    return price;
};

/**
 * Format price with currency symbol
 * @param {number} price - The price to format (assumed to be in MKD)
 * @param {string} currency - Currency code ('MKD' or 'EUR')
 * @returns {string} Formatted price string
 */
export const formatPrice = (price, currency = 'MKD') => {
    const curr = CURRENCIES[currency] || CURRENCIES.MKD;

    // Convert from MKD to EUR if needed
    const convertedPrice = currency === 'EUR' ? convertCurrency(price, 'MKD', 'EUR') : price;

    if (currency === 'EUR') {
        return `${curr.symbol}${convertedPrice.toFixed(2)}`;
    }

    // MKD format: "120 ден"
    return `${Math.round(convertedPrice)} ${curr.symbol}`;
};

/**
 * Get currency symbol
 * @param {string} currency - Currency code
 * @returns {string} Currency symbol
 */
export const getCurrencySymbol = (currency = 'MKD') => {
    return CURRENCIES[currency]?.symbol || CURRENCIES.MKD.symbol;
};
