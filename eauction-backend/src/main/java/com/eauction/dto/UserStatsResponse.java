package com.eauction.dto;

public record UserStatsResponse(
        long totalBids,
        long itemsListed,
        long itemsWon,
        long itemsSold,
        double successRate,
        long totalTransactions
) {
}
