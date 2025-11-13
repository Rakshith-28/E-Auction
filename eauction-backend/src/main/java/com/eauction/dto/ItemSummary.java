package com.eauction.dto;

import com.eauction.model.Item;
import com.eauction.model.ItemStatus;
import java.time.Instant;

public record ItemSummary(
        String id,
        String title,
        String description,
        String category,
        String imageUrl,
        Double minimumBid,
        Double currentBid,
        ItemStatus status,
        Instant auctionStartTime,
        Instant auctionEndTime
) {
    public static ItemSummary from(Item item) {
        if (item == null) {
            return null;
        }
        return new ItemSummary(
                item.getId(),
                item.getTitle(),
                item.getDescription(),
                item.getCategory(),
                item.getImageUrl(),
                item.getMinimumBid(),
                item.getCurrentBid(),
                item.getStatus(),
                item.getAuctionStartTime(),
                item.getAuctionEndTime()
        );
    }
}
