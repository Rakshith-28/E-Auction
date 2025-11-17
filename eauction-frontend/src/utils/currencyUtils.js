// Currency conversion utilities
// Backend stores amounts in USD, frontend displays in INR

const USD_TO_INR_RATE = 83; // Update this rate as needed

/**
 * Convert USD to INR for display
 * @param {number} usdAmount - Amount in USD
 * @returns {number} Amount in INR
 */
export const usdToInr = (usdAmount) => {
  if (!usdAmount || isNaN(usdAmount)) return 0;
  return Number(usdAmount) * USD_TO_INR_RATE;
};

/**
 * Convert INR to USD for API submission
 * @param {number} inrAmount - Amount in INR
 * @returns {number} Amount in USD
 */
export const inrToUsd = (inrAmount) => {
  if (!inrAmount || isNaN(inrAmount)) return 0;
  return Number(inrAmount) / USD_TO_INR_RATE;
};

/**
 * Format INR amount for display
 * @param {number} usdAmount - Amount in USD from backend
 * @param {number} decimals - Number of decimal places (default 2)
 * @returns {string} Formatted INR string
 */
export const formatInr = (usdAmount, decimals = 2) => {
  const inr = usdToInr(usdAmount);
  return inr.toFixed(decimals);
};

/**
 * Format INR with Indian number system (lakhs/crores)
 * @param {number} usdAmount - Amount in USD from backend
 * @returns {string} Formatted string with commas
 */
export const formatInrLocale = (usdAmount) => {
  const inr = usdToInr(usdAmount);
  return inr.toLocaleString('en-IN', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2
  });
};
