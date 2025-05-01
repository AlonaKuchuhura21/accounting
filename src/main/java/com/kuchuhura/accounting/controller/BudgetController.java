package com.kuchuhura.accounting.controller;

import com.kuchuhura.accounting.dto.BudgetCreateDto;
import com.kuchuhura.accounting.dto.BudgetPageDto;
import com.kuchuhura.accounting.dto.BudgetUpdateDto;
import com.kuchuhura.accounting.entity.Budget;
import com.kuchuhura.accounting.entity.User;
import com.kuchuhura.accounting.service.BudgetService;
import com.kuchuhura.accounting.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.Optional;

@RestController
@RequestMapping(path = "/budgets")
public class BudgetController {
    private final BudgetService budgetService;
    private final UserService userService;

    public BudgetController(BudgetService budgetService, UserService userService) {
        this.budgetService = budgetService;
        this.userService = userService;
    }

    @GetMapping(path = "/{budgetId}")
    public ResponseEntity<Budget> budget(Authentication authentication,
                                         @PathVariable(value = "budgetId") Long budgetId
    ) {
        User user = userService.getUserFromAuthentication(authentication);
        if (user.isEnabled()) {
            Optional<Budget> budget = budgetService.getBudgetById(budgetId);
            if (budget.isPresent() && budget.get().getUser().equals(user)) {
                return ResponseEntity.status(HttpStatus.OK).body(budget.get());
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }
        } else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
    }

    @GetMapping(path = "/all")
    public ResponseEntity<BudgetPageDto> budgets(
            Authentication authentication,
            @RequestParam(value = "page", defaultValue = "0", required = false) int page,
            @RequestParam(value = "size", defaultValue = "50", required = false) int size,
            @RequestParam(value = "sortBy", defaultValue = "id", required = false) String sortBy,
            @RequestParam(value = "orderBy", defaultValue = "asc", required = false) String orderBy,
            @RequestParam(value = "title", required = false) String title
    ) {
        User user = userService.getUserFromAuthentication(authentication);
        if (user.isEnabled()) {
            return ResponseEntity.status(HttpStatus.OK)
                    .body(budgetService.getAllBudgets(page, size, sortBy, orderBy, title));
        } else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
    }

    @PostMapping(path = "/create")
    public ResponseEntity<Void> createBudget(Authentication authentication,
                                             @Valid @RequestBody BudgetCreateDto budgetCreateDto
    ) {
        User user = userService.getUserFromAuthentication(authentication);
        if (user.isEnabled()) {
            budgetService.createBudget(budgetCreateDto, user);
            return ResponseEntity.status(HttpStatus.CREATED).build();
        } else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
    }

    @PatchMapping(path = "/{budgetId}/update")
    public ResponseEntity<Void> updateBudget(Authentication authentication,
                                             @PathVariable(value = "budgetId") Long budgetId,
                                             @Valid @RequestBody BudgetUpdateDto budgetUpdateDto
    ) {
        User user = userService.getUserFromAuthentication(authentication);
        if (user.isEnabled()) {
            Optional<Budget> budget = budgetService.getBudgetById(budgetId);
            if (budget.isPresent() && budget.get().getUser().equals(user)) {
                budgetService.updateBudget(budget.get(), budgetUpdateDto);
                return ResponseEntity.status(HttpStatus.OK).build();
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }
        } else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
    }

    @DeleteMapping(path = "/{budgetId}/delete")
    public ResponseEntity<Void> deleteBudget(Authentication authentication,
                                             @PathVariable(value = "budgetId") Long budgetId
    ) {
        User user = userService.getUserFromAuthentication(authentication);
        if (user.isEnabled()) {
            Optional<Budget> budget = budgetService.getBudgetById(budgetId);
            if (budget.isPresent() && budget.get().getUser().equals(user)) {
                budgetService.deleteBudget(budget.get());
                return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }
        } else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
    }
}
