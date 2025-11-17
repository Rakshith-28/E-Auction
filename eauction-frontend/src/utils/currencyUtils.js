// Currency utilities for INR formatting
// All amounts are now stored in INR in the database (no conversion needed)

/**
 * Format INR amount for display
 * @param {number} inrAmount - Amount in INR from backend
 * @param {number} decimals - Number of decimal places (default 2)
 * @returns {string} Formatted INR string
 */
export const formatInr = (inrAmount, decimals = 2) => {
  if (!inrAmount || isNaN(inrAmount)) return '0.00';
  return Number(inrAmount).toFixed(decimals);
};

/**
 * Format INR with Indian number system (lakhs/crores)
 * @param {number} inrAmount - Amount in INR from backend
 * @returns {string} Formatted string with commas
 */
export const formatInrLocale = (inrAmount) => {
  if (!inrAmount || isNaN(inrAmount)) return '0.00';
  return Number(inrAmount).toLocaleString('en-IN', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2
  });
};

/**
 * Parse INR amount from user input
 * @param {string|number} input - User input string or number
 * @returns {number} Parsed INR amount
 */
export const parseAmount = (input) => {
  if (!input) return 0;
  const str = String(input).replace(/,/g, '');
  const parsed = parseFloat(str);
  return isNaN(parsed) ? 0 : parsed;
};
