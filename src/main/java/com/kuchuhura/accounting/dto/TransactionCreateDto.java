package com.kuchuhura.accounting.dto;

import com.kuchuhura.accounting.entity.TransactionType;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import java.util.Date;

public record TransactionCreateDto(
        @NotNull(message = "title mustn't be null")
        @Size(min = 5, max = 255, message = "max size must be up to 255 characters")
        String title,
        String description,
        @NotNull(message = "type mustn't be null")
        TransactionType type,
        @NotNull(message = "date mustn't be null")
        Date date,
        @Positive(message = "amount must be positive")
        @NotNull(message = "amount mustn't be null")
        Double amount
) {
}
