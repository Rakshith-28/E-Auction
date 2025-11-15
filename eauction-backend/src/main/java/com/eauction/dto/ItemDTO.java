package com.eauction.dto;

import com.eauction.model.ItemCondition;
import com.eauction.model.ItemStatus;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.Instant;
import java.util.List;

public record ItemDTO(
        String id,
        @NotBlank @Size(min = 3, max = 200) String title,
        @NotBlank @Size(min = 10, max = 5000) String description,
        @NotBlank String category,
        String imageUrl,
        List<String> images,
        ItemCondition condition,
        @NotNull @Min(0) Double minimumBid,
        @Min(0) Double bidIncrement,
        @FutureOrPresent Instant auctionStartTime,
        @Future Instant auctionEndTime,
        ItemStatus status
) {
}
