package com.eauction.dto;

import com.eauction.model.Role;
import com.eauction.model.User;
import java.time.Instant;
import java.util.List;

public record UserResponse(
        String id,
        String name,
        String email,
        List<Role> roles,
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
                user.getRoles(),
                user.getPhone(),
                user.getAddress(),
                user.getCreatedAt(),
                user.getUpdatedAt()
        );
    }
}
