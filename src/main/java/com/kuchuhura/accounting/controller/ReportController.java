package com.kuchuhura.accounting.controller;

import java.io.IOException;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.kuchuhura.accounting.dto.ReportDto;
import com.kuchuhura.accounting.entity.Budget;
import com.kuchuhura.accounting.entity.User;
import com.kuchuhura.accounting.service.BudgetService;
import com.kuchuhura.accounting.service.ReportService;
import com.kuchuhura.accounting.service.UserService;

@RestController
@RequestMapping(path = "/reports")
public class ReportController {
    private final ReportService reportService;
    private final BudgetService budgetService;
    private final UserService userService;

    public ReportController(ReportService reportService, BudgetService budgetService, UserService userService) {
        this.reportService = reportService;
        this.budgetService = budgetService;
        this.userService = userService;
    }

    @GetMapping(path = "/generate")
    public ResponseEntity<ReportDto> generateReport(
            Authentication authentication,
            @RequestParam("budgetId") Long budgetId
    ) throws IOException {
        User user = userService.getUserFromAuthentication(authentication);
        Optional<Budget> budget = budgetService.getBudgetById(budgetId);
        if (user.isEnabled() && budget.isPresent() && budget.get().getUser().equals(user)) {
            return ResponseEntity.status(HttpStatus.OK)
                    .body(reportService.generateTransactionReport(budget.get()));
        } else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
    }
}
