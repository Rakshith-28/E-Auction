package com.eauction.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record BidDTO(
        String id,
        @NotBlank String itemId,
        @NotNull @Min(0) Double bidAmount
) {
}
