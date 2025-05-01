package com.kuchuhura.accounting.dto;

import com.kuchuhura.accounting.entity.BudgetType;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import java.util.Date;

public record BudgetUpdateDto(
        @Size(min = 3, max = 255, message = "max size must be up to 255 characters")
        String title,
        String description,
        BudgetType type,
        Date from,
        Date to,
        @Positive(message = "balance should be positive")
        Double initialBalance
) {
}
