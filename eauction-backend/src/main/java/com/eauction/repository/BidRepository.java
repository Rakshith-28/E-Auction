package com.eauction.repository;

import com.eauction.model.Bid;
import java.util.List;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface BidRepository extends MongoRepository<Bid, String> {
    List<Bid> findByItemIdOrderByBidAmountDesc(String itemId);
    List<Bid> findByBidderIdOrderByBidTimeDesc(String bidderId);
}
