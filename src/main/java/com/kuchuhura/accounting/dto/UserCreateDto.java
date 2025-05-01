package com.kuchuhura.accounting.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;

public record UserCreateDto(
        @NotNull(message = "full name is mandatory")
        String fullName,
        @NotNull(message = "email is mandatory")
        @Email(message = "email should be valid")
        String email,
        @NotNull(message = "password is mandatory")
        String password
) {
}
