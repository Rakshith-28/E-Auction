package com.eauction.dto;

import com.eauction.model.ItemStatus;
import jakarta.validation.constraints.NotNull;

public record ItemStatusUpdateRequest(
        @NotNull ItemStatus status
) {
}
