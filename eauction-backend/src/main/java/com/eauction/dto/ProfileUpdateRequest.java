package com.eauction.dto;

import jakarta.validation.constraints.NotBlank;

public record ProfileUpdateRequest(
        @NotBlank String name,
        String phone,
        String address
) {
}
