require('dotenv').config();
const fetch = require('node-fetch');

const EXCHANGE_RATE_API_KEY = process.env.EXCHANGE_RATE_API_KEY;
const BASE_URL = `https://v6.exchangerate-api.com/v6/${EXCHANGE_RATE_API_KEY}/latest`;

/**
 * Converts an amount from one currency to another using locally cached rates.
 * Fetches the full rate list only once per `fromCurrency`.
 * @param {string} fromCurrency - The base currency to convert from (e.g., 'USD').
 * @param {string} toCurrency - The target currency to convert to (e.g., 'EUR').
 * @param {number} amount - The amount to convert.
 * @returns {Promise<number>} - The converted amount.
 */
async function convertCurrency(fromCurrency, toCurrency, amount) {
    try {
        const response = await fetch(`${BASE_URL}/${fromCurrency}`);
        if (!response.ok) throw new Error(`Error fetching exchange rates: ${response.statusText}`);
        const data = await response.json();
        if (data.result !== 'success') throw new Error(`API Error: ${data['error-type']}`);
        const conversionRate = data.conversion_rates[toCurrency];
        if (!conversionRate) throw new Error(`Unsupported target currency: ${toCurrency}`);
        return amount * conversionRate;
    } catch (error) {
        console.error("Currency conversion error:", error);
        throw error;
    }
}

module.exports = { convertCurrency };
