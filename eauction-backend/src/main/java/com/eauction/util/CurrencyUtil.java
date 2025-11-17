package com.eauction.util;

import java.text.NumberFormat;
import java.util.Locale;

public final class CurrencyUtil {
    private static final double USD_TO_INR_RATE = 83.0;

    private CurrencyUtil() {}

    public static double usdToInr(Double usd) {
        if (usd == null) return 0.0;
        return usd * USD_TO_INR_RATE;
    }

    public static String formatInr(Double usd) {
        double inr = usdToInr(usd);
        NumberFormat nf = NumberFormat.getNumberInstance(new Locale("en", "IN"));
        nf.setMinimumFractionDigits(2);
        nf.setMaximumFractionDigits(2);
        return "₹" + nf.format(inr);
    }
}
