package com.eauction.model;

import java.time.Instant;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "auctions")
public class Auction {

    @Id
    private String id;

    private String itemId;
    private Instant startTime;
    private Instant endTime;
    private AuctionStatus status;
    private String winnerId;
    private Double winningBid;
    private Integer totalBids;
    private Boolean endingSoonNotified;

    // Payment fields
    private PaymentStatus paymentStatus; // PENDING, PAID, REFUNDED
    private Instant paymentDate;

    @CreatedDate
    private Instant createdAt;

    @LastModifiedDate
    private Instant updatedAt;
}
