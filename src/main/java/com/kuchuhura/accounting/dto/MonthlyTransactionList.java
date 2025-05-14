package com.kuchuhura.accounting.dto;

import java.util.List;

public record MonthlyTransactionList(
    List<TransactionDto> income,
    List<TransactionDto> expense,
    double totalIncome,
    double totalExpense
) {
    public MonthlyTransactionList(List<TransactionDto> income, List<TransactionDto> expense) {
        this(
            income,
            expense,
            income.stream().mapToDouble(TransactionDto::amount).sum(),
            expense.stream().mapToDouble(TransactionDto::amount).sum()
        );
    }
}
