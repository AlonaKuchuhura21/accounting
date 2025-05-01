package com.kuchuhura.accounting.service.impl;

import com.kuchuhura.accounting.dto.BudgetCreateDto;
import com.kuchuhura.accounting.dto.BudgetPageDto;
import com.kuchuhura.accounting.dto.BudgetUpdateDto;
import com.kuchuhura.accounting.entity.Budget;
import com.kuchuhura.accounting.entity.User;
import com.kuchuhura.accounting.repository.BudgetRepository;
import com.kuchuhura.accounting.service.BudgetService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
public class BudgetServiceImpl implements BudgetService {
    private final BudgetRepository budgetRepository;

    public BudgetServiceImpl(BudgetRepository budgetRepository) {
        this.budgetRepository = budgetRepository;
    }

    @Override
    public Optional<Budget> getBudgetById(long id) {
        return budgetRepository.findById(id);
    }

    @Override
    public BudgetPageDto getAllBudgets(int page, int size, String sortBy, String orderBy, String title) {
        Pageable pageable;
        if (orderBy.equals("asc")) {
            pageable = PageRequest.of(page, size, Sort.by(sortBy).ascending());
        } else {
            pageable = PageRequest.of(page, size, Sort.by(sortBy).descending());
        }
        Page<Budget> budgetPage = (title != null && !title.isEmpty())
                ? budgetRepository.findAllByCriteria(pageable, title)
                : budgetRepository.findAll(pageable);
        return new BudgetPageDto(budgetPage.getContent(), budgetPage.getNumber(), budgetPage.getTotalPages(),
                budgetPage.getTotalElements());
    }

    @Override
    public void createBudget(BudgetCreateDto budgetCreateDto, User user) {
        Budget budget = new Budget()
                .setTitle(budgetCreateDto.title())
                .setDescription(budgetCreateDto.description())
                .setType(budgetCreateDto.type())
                .setFrom(budgetCreateDto.from())
                .setTo(budgetCreateDto.to())
                .setInitialBalance(budgetCreateDto.initialBalance())
                .setCurrentBalance(0.0)
                .setUser(user);
        budgetRepository.save(budget);
    }

    @Override
    public void updateBudget(Budget budget, BudgetUpdateDto budgetUpdateDto) {
        if (budgetUpdateDto.title() != null) {
            budget.setTitle(budgetUpdateDto.title());
        }
        if (budgetUpdateDto.description() != null) {
            budget.setDescription(budgetUpdateDto.description());
        }
        if (budgetUpdateDto.type() != null) {
            budget.setType(budgetUpdateDto.type());
        }
        if (budgetUpdateDto.from() != null) {
            budget.setFrom(budgetUpdateDto.from());
        }
        if (budgetUpdateDto.to() != null) {
            budget.setTo(budgetUpdateDto.to());
        }
        if (budgetUpdateDto.initialBalance() != null) {
            budget.setInitialBalance(budgetUpdateDto.initialBalance());
        }
        budgetRepository.save(budget);
    }

    @Override
    public void deleteBudget(Budget budget) {
        budgetRepository.delete(budget);
    }
}
