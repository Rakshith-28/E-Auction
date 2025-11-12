package com.eauction.dto;

import com.eauction.model.Role;
import com.eauction.model.User;
import java.time.Instant;

public record UserResponse(
        String id,
        String name,
        String email,
        Role role,
        String phone,
        String address,
        Instant createdAt,
        Instant updatedAt
) {
    public static UserResponse from(User user) {
        return new UserResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole(),
                user.getPhone(),
                user.getAddress(),
                user.getCreatedAt(),
                user.getUpdatedAt()
        );
    }
}
