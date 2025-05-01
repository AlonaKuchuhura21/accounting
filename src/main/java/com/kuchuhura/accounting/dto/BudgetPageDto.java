package com.kuchuhura.accounting.dto;

import com.kuchuhura.accounting.entity.Budget;
import java.util.List;

public record BudgetPageDto(
        List<Budget> content,
        int pageNumber,
        int totalPages,
        long totalElements
) {
}
