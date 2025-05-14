package com.kuchuhura.accounting.dto;

import java.util.List;
import java.util.Map;

public record MonthlyTransactionSummary(
        double income,
        double expense,
        Map<String, Double> spendingByName,
        List<Double> weeklyIncome,
        List<Double> weeklyExpense,
        List<TopSpendingDto> topSpendings
) {}
