package com.eauction.dto;

import com.eauction.model.Auction;
import com.eauction.model.AuctionStatus;
import java.time.Instant;
import java.util.List;

public record AuctionResponse(
        String id,
        Instant startTime,
        Instant endTime,
        AuctionStatus status,
        Double currentBidAmount,
        Integer totalBids,
        String winnerId,
        Double winningBid,
        ItemSummary item,
        List<BidResponse> bids
) {
    public static AuctionResponse from(Auction auction,
                                       ItemSummary itemSummary,
                                       Double currentBid,
                                       List<BidResponse> bids) {
        if (auction == null) {
            return null;
        }
        return new AuctionResponse(
                auction.getId(),
                auction.getStartTime(),
                auction.getEndTime(),
                auction.getStatus(),
                currentBid,
                auction.getTotalBids(),
                auction.getWinnerId(),
                auction.getWinningBid(),
                itemSummary,
                bids
        );
    }
}
