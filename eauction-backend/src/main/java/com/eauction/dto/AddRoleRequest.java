package com.eauction.dto;

import com.eauction.model.Role;
import jakarta.validation.constraints.NotNull;

public record AddRoleRequest(@NotNull Role role) {
}
