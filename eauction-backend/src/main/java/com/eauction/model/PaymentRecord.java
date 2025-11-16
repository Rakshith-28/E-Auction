package com.eauction.model;

import java.time.Instant;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "payments")
public class PaymentRecord {

    @Id
    private String id; // paymentId

    private String auctionId;
    private String buyerId;
    private String sellerId;
    private Double amount;
    private String paymentMethod; // mock_card
    private String status; // completed

    @CreatedDate
    private Instant createdAt;
}
