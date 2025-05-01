package com.kuchuhura.accounting.controller;

import com.kuchuhura.accounting.dto.TransactionCreateDto;
import com.kuchuhura.accounting.dto.TransactionUpdateDto;
import com.kuchuhura.accounting.dto.YearlyTransactionsDto;
import com.kuchuhura.accounting.entity.Budget;
import com.kuchuhura.accounting.entity.Transaction;
import com.kuchuhura.accounting.entity.User;
import com.kuchuhura.accounting.exception.CustomException;
import com.kuchuhura.accounting.service.BudgetService;
import com.kuchuhura.accounting.service.TransactionService;
import com.kuchuhura.accounting.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.Optional;

@RestController
@RequestMapping(path = "/transactions")
public class TransactionController {
    private final UserService userService;
    private final BudgetService budgetService;
    private final TransactionService transactionService;

    public TransactionController(UserService userService, BudgetService budgetService,
                                 TransactionService transactionService) {
        this.userService = userService;
        this.budgetService = budgetService;
        this.transactionService = transactionService;
    }

    @GetMapping(path = "/{transactionId}")
    public ResponseEntity<Transaction> transaction(Authentication authentication,
                                                   @PathVariable(value = "transactionId") Long transactionId,
                                                   @RequestParam(value = "budgetId") Long budgetId
    ) {
        User user = userService.getUserFromAuthentication(authentication);
        Optional<Budget> budget = budgetService.getBudgetById(budgetId);
        if (user.isEnabled() && budget.isPresent() && budget.get().getUser().equals(user)) {
            Optional<Transaction> transaction = transactionService.getTransactionById(transactionId);
            return transaction
                    .map(value -> ResponseEntity.status(HttpStatus.OK).body(value))
                    .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @GetMapping(path = "/all")
    public ResponseEntity<YearlyTransactionsDto> all(Authentication authentication,
                                                     @RequestParam(value = "budgetId") Long budgetId,
                                                     @RequestParam(value = "year") int year
    ) {
        User user = userService.getUserFromAuthentication(authentication);
        Optional<Budget> budget = budgetService.getBudgetById(budgetId);
        if (user.isEnabled() && budget.isPresent() && budget.get().getUser().equals(user)) {
            return ResponseEntity.status(HttpStatus.OK).body(transactionService.allTransactions(budget.get(), year));
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @PostMapping(path = "/create")
    public ResponseEntity<Void> createTransaction(Authentication authentication,
                                                  @Valid @RequestBody TransactionCreateDto transactionCreateDto,
                                                  @RequestParam(value = "budgetId") Long budgetId
    ) throws CustomException {
        User user = userService.getUserFromAuthentication(authentication);
        Optional<Budget> budget = budgetService.getBudgetById(budgetId);
        if (user.isEnabled() && budget.isPresent() && budget.get().getUser().equals(user)) {
            transactionService.createTransaction(transactionCreateDto, budget.get());
            return ResponseEntity.status(HttpStatus.CREATED).build();
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @PatchMapping(path = "/{transactionId}/update")
    public ResponseEntity<Void> updateTransaction(Authentication authentication,
                                                  @Valid @RequestBody TransactionUpdateDto transactionUpdateDto,
                                                  @PathVariable(value = "transactionId") Long transactionId,
                                                  @RequestParam(value = "budgetId") Long budgetId
    ) throws CustomException {
        User user = userService.getUserFromAuthentication(authentication);
        Optional<Budget> budget = budgetService.getBudgetById(budgetId);
        Optional<Transaction> transaction = transactionService.getTransactionById(transactionId);
        if (user.isEnabled() && transaction.isPresent() && budget.isPresent()
                && transaction.get().getBudget().equals(budget.get())) {
            transactionService.updateTransaction(transaction.get(), transactionUpdateDto);
            return ResponseEntity.status(HttpStatus.OK).build();
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @DeleteMapping(path = "/{transactionId}/delete")
    public ResponseEntity<Void> deleteTransaction(Authentication authentication,
                                                  @PathVariable(value = "transactionId") Long transactionId
    ) throws CustomException {
        User user = userService.getUserFromAuthentication(authentication);
        Optional<Transaction> transaction = transactionService.getTransactionById(transactionId);
        if (user.isEnabled() && transaction.isPresent() && transaction.get().getBudget().getUser().equals(user)) {
            transactionService.deleteTransaction(transaction.get());
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }
}
