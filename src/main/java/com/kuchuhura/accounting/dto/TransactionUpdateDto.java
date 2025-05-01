package com.kuchuhura.accounting.dto;

import com.kuchuhura.accounting.entity.TransactionType;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import java.util.Date;

public record TransactionUpdateDto(
        @Size(min = 5, max = 255, message = "max size must be up to 255 characters")
        String title,
        String description,
        TransactionType type,
        Date date,
        @Positive(message = "amount must be positive")
        Double amount
) {
}
