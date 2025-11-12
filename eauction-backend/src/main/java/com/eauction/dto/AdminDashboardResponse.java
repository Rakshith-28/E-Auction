package com.eauction.dto;

public record AdminDashboardResponse(
        long totalUsers,
        long totalItems,
        long activeAuctions,
        double totalRevenue
) {
}
