package com.kuchuhura.accounting.dto;

import java.util.List;

public record MonthlyTransactionList(
    List<TransactionDto> income,
    List<TransactionDto> expense
) {
}
