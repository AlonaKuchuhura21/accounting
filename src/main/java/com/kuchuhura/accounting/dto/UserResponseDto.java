package com.kuchuhura.accounting.dto;

import java.time.Instant;

public record UserResponseDto(
        Long id,
        String fullName,
        String email,
        Instant createdAt,
        Instant updatedAt
) {
}
