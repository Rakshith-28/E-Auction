package com.eauction.repository;

import com.eauction.model.Auction;
import com.eauction.model.AuctionStatus;
import com.eauction.model.PaymentStatus;
import java.time.Instant;
import java.util.List;
import java.util.Optional;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface AuctionRepository extends MongoRepository<Auction, String> {
    List<Auction> findByStatus(AuctionStatus status);
    List<Auction> findByStatusAndStartTimeBefore(AuctionStatus status, Instant before);
    List<Auction> findByStatusAndEndTimeBefore(AuctionStatus status, Instant before);
    long countByStatus(AuctionStatus status);
    Optional<Auction> findTopByItemIdOrderByEndTimeDesc(String itemId);
    List<Auction> findByWinnerIdAndStatus(String winnerId, AuctionStatus status);
    long countByWinnerIdAndStatusAndPaymentStatus(String winnerId, AuctionStatus status, PaymentStatus paymentStatus);
}
