package com.eauction.util;

import java.text.NumberFormat;
import java.util.Locale;

/**
 * Currency utility for formatting INR amounts.
 * All monetary values are now stored in INR in the database.
 */
public final class CurrencyUtil {

    private CurrencyUtil() {}

    /**
     * Format amount as Indian Rupees
     * @param inr Amount in INR (already in INR, no conversion needed)
     * @return Formatted string with ₹ symbol and Indian number formatting
     */
    public static String formatInr(Double inr) {
        if (inr == null) inr = 0.0;
        NumberFormat nf = NumberFormat.getNumberInstance(new Locale("en", "IN"));
        nf.setMinimumFractionDigits(2);
        nf.setMaximumFractionDigits(2);
        return "₹" + nf.format(inr);
    }
}
