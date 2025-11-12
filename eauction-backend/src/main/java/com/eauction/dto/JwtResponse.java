package com.eauction.dto;

public record JwtResponse(String token, String tokenType) {
    public JwtResponse(String token) {
        this(token, "Bearer");
    }
}
