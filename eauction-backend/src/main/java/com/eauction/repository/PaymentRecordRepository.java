package com.eauction.repository;

import com.eauction.model.PaymentRecord;
import java.util.List;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface PaymentRecordRepository extends MongoRepository<PaymentRecord, String> {
    List<PaymentRecord> findByBuyerId(String buyerId);
    List<PaymentRecord> findBySellerId(String sellerId);
    boolean existsByAuctionIdAndBuyerId(String auctionId, String buyerId);
}
