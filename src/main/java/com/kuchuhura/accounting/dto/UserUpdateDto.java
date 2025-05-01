package com.kuchuhura.accounting.dto;

public record UserUpdateDto(
        String fullName,
        String password
) {
}
