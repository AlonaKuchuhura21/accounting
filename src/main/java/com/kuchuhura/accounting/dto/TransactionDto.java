package com.kuchuhura.accounting.dto;

import java.time.LocalDate;
import java.time.ZoneId;

import com.kuchuhura.accounting.entity.Transaction;
import com.kuchuhura.accounting.entity.TransactionType;

public record TransactionDto(
    Long id,
    String title,
    double amount,
    LocalDate date,
    TransactionType type
) {
    public static TransactionDto from(Transaction t) {
        return new TransactionDto(
            t.getId(),
            t.getTitle(),
            t.getAmount(),
            t.getDate().toInstant().atZone(ZoneId.systemDefault()).toLocalDate(),
            t.getType()
        );
    }
}
