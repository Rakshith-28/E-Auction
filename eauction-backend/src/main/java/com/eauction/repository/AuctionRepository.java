package com.eauction.repository;

import com.eauction.model.Auction;
import com.eauction.model.AuctionStatus;
import java.time.Instant;
import java.util.List;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface AuctionRepository extends MongoRepository<Auction, String> {
    List<Auction> findByStatus(AuctionStatus status);
    List<Auction> findByStatusAndStartTimeBefore(AuctionStatus status, Instant before);
    List<Auction> findByStatusAndEndTimeBefore(AuctionStatus status, Instant before);
    long countByStatus(AuctionStatus status);
}
