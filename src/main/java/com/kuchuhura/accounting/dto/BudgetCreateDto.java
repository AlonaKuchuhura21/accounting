package com.kuchuhura.accounting.dto;

import com.kuchuhura.accounting.entity.BudgetType;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import java.util.Date;

public record BudgetCreateDto(
        @NotNull(message = "title mustn't be null")
        @Size(min = 3, max = 255, message = "max size must be up to 255 characters")
        String title,
        String description,
        BudgetType type,
        @NotNull(message = "from date mustn't be null")
        Date from,
        @NotNull(message = "to date mustn't be null")
        Date to,
        @Positive(message = "balance should be positive")
        @NotNull(message = "initialBalance mustn't be null")
        Double initialBalance
) {
}
