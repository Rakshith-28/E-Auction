package com.eauction.dto;

import com.eauction.model.Bid;
import com.eauction.model.BidStatus;
import java.time.Instant;

public record BidResponse(
        String id,
        String itemId,
        String bidderId,
        Double amount,
        Instant timestamp,
        BidStatus status,
        ItemSummary item
) {
    public static BidResponse from(Bid bid) {
        return from(bid, null);
    }

    public static BidResponse from(Bid bid, ItemSummary itemSummary) {
        if (bid == null) {
            return null;
        }
        return new BidResponse(
                bid.getId(),
                bid.getItemId(),
                bid.getBidderId(),
                bid.getBidAmount(),
                bid.getBidTime(),
                bid.getStatus(),
                itemSummary
        );
    }
}
