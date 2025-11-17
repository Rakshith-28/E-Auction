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
@Document(collection = "bids")
public class Bid {

    @Id
    private String id;

    private String itemId;
    private String bidderId;
    private Double bidAmount;       // Amount in INR
    private Instant bidTime;
    private BidStatus status;

    @CreatedDate
    private Instant createdAt;
}
