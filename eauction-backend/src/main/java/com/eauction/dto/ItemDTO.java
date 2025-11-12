package com.eauction.dto;

import com.eauction.model.ItemStatus;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.Instant;

public record ItemDTO(
        String id,
        @NotBlank String title,
        @NotBlank String description,
        @NotBlank String category,
        String imageUrl,
        @NotNull @Min(0) Double minimumBid,
        @FutureOrPresent Instant auctionStartTime,
        @Future Instant auctionEndTime,
        ItemStatus status
) {
}
