package com.eauction.repository;

import com.eauction.model.Item;
import com.eauction.model.ItemStatus;
import java.time.Instant;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ItemRepository extends MongoRepository<Item, String> {
    List<Item> findBySellerId(String sellerId);
    Page<Item> findBySellerId(String sellerId, Pageable pageable);
    Page<Item> findByStatus(ItemStatus status, Pageable pageable);
    Page<Item> findByStatusAndAuctionEndTimeAfter(ItemStatus status, Instant currentTime, Pageable pageable);
    List<Item> findByStatusAndAuctionEndTimeAfter(ItemStatus status, Instant currentTime);
    long countBySellerId(String sellerId);
    long countBySellerIdAndStatus(String sellerId, ItemStatus status);
}
