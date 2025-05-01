package com.kuchuhura.accounting.service;

import com.kuchuhura.accounting.dto.BudgetCreateDto;
import com.kuchuhura.accounting.dto.BudgetPageDto;
import com.kuchuhura.accounting.dto.BudgetUpdateDto;
import com.kuchuhura.accounting.entity.Budget;
import com.kuchuhura.accounting.entity.User;
import org.springframework.data.domain.Page;

import java.util.Optional;

public interface BudgetService {
    Optional<Budget> getBudgetById(long id);

    BudgetPageDto getAllBudgets(int page, int size, String sortBy, String orderBy, String title);

    void createBudget(BudgetCreateDto budgetCreateDto, User user);

    void updateBudget(Budget budget, BudgetUpdateDto budgetUpdateDto);

    void deleteBudget(Budget budget);
}
