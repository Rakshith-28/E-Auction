package com.eauction.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;

public record ProfileUpdateRequest(
        @NotBlank
        @Size(min = 2, max = 100)
        String name,
        
        String phone,
        
        String address,
        
        @Size(max = 500)
        String bio,
        
        String profilePictureUrl,
        
        String coverPhotoUrl,
        
        LocalDate dateOfBirth,
        
        String gender,
        
        String city,
        
        String country
) {
}
