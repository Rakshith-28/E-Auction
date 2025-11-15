package com.eauction.model;

import java.time.Instant;
import java.util.List;
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
@Document(collection = "items")
public class Item {

    @Id
    private String id;

    private String title;
    private String description;
    private String category;
    private String imageUrl;
    private List<String> images;
    private ItemCondition condition;
    private Double minimumBid;
    private Double currentBid;
    private Double bidIncrement;
    private String sellerId;
    private String sellerName;
    private Instant auctionStartTime;
    private Instant auctionEndTime;
    private ItemStatus status;
    private Integer totalBids;

    @CreatedDate
    private Instant createdAt;

    @LastModifiedDate
    private Instant updatedAt;
}
