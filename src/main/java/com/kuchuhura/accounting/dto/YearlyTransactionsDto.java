package com.kuchuhura.accounting.dto;

import java.time.Month;
import java.util.Map;

public record YearlyTransactionsDto(
    String budget,
    Map<Month, MonthlyTransactionList> data
) {
}
