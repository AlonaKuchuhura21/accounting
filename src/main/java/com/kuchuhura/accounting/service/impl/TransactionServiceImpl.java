package com.kuchuhura.accounting.service.impl;

import com.kuchuhura.accounting.dto.MonthlyTransactionSummary;
import com.kuchuhura.accounting.dto.TransactionCreateDto;
import com.kuchuhura.accounting.dto.TransactionUpdateDto;
import com.kuchuhura.accounting.dto.YearlyTransactionsDto;
import com.kuchuhura.accounting.entity.Budget;
import com.kuchuhura.accounting.entity.Transaction;
import com.kuchuhura.accounting.entity.TransactionType;
import com.kuchuhura.accounting.exception.CustomException;
import com.kuchuhura.accounting.repository.BudgetRepository;
import com.kuchuhura.accounting.repository.TransactionRepository;
import com.kuchuhura.accounting.service.TransactionService;
import jakarta.transaction.Transactional;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.Month;
import java.time.ZoneId;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class TransactionServiceImpl implements TransactionService {
    private final TransactionRepository transactionRepository;
    private final BudgetRepository budgetRepository;

    public TransactionServiceImpl(TransactionRepository transactionRepository, BudgetRepository budgetRepository) {
        this.transactionRepository = transactionRepository;
        this.budgetRepository = budgetRepository;
    }

    @Override
    public Optional<Transaction> getTransactionById(long id) {
        return transactionRepository.findById(id);
    }

    @Override
    public YearlyTransactionsDto allTransactions(Budget budget, int year) {
        List<Transaction> transactions = transactionRepository.findByBudgetIdAndYear(budget.getId(), year);
        Map<Month, List<Transaction>> groupedByMonth = transactions.stream()
                .collect(Collectors.groupingBy(t -> t.getDate().toInstant()
                        .atZone(ZoneId.systemDefault())
                        .getMonth()));
        Map<Month, MonthlyTransactionSummary> summaryByMonth = new EnumMap<>(Month.class);
        for (Month month : Month.values()) {
            List<Transaction> monthTransactions = groupedByMonth.getOrDefault(month, List.of());
            double income = monthTransactions.stream()
                    .filter(t -> t.getType() == TransactionType.INCOME)
                    .mapToDouble(Transaction::getAmount)
                    .sum();
            double expense = monthTransactions.stream()
                    .filter(t -> t.getType() == TransactionType.EXPENSE)
                    .mapToDouble(Transaction::getAmount)
                    .sum();

            summaryByMonth.put(month, new MonthlyTransactionSummary(income, expense));
        }
        return new YearlyTransactionsDto(budget.getTitle(), summaryByMonth);
    }

    @Transactional
    @Override
    public void createTransaction(TransactionCreateDto transactionCreateDto, Budget budget) throws CustomException {
        if (transactionCreateDto.type() == TransactionType.EXPENSE) {
            if (budget.getCurrentBalance() < transactionCreateDto.amount()) {
                throw new CustomException("Your budget has less than this transaction :(", HttpStatus.BAD_REQUEST);
            }
            budget.setCurrentBalance(budget.getCurrentBalance() - transactionCreateDto.amount());
        } else {
            budget.setCurrentBalance(budget.getCurrentBalance() + transactionCreateDto.amount());
        }
        Transaction transaction = new Transaction()
                .setTitle(transactionCreateDto.title())
                .setDescription((transactionCreateDto.description()))
                .setType(transactionCreateDto.type())
                .setDate(transactionCreateDto.date())
                .setAmount(transactionCreateDto.amount())
                .setBudget(budget);
        budgetRepository.save(budget);
        transactionRepository.save(transaction);
    }

    @Transactional
    @Override
    public void updateTransaction(Transaction transaction, TransactionUpdateDto dto) throws CustomException {
        Budget budget = transaction.getBudget();
        if (transaction.getType() == TransactionType.EXPENSE) {
            budget.setCurrentBalance(budget.getCurrentBalance() + transaction.getAmount());
        } else {
            budget.setCurrentBalance(budget.getCurrentBalance() - transaction.getAmount());
        }
        if (dto.title() != null) {
            transaction.setTitle(dto.title());
        }
        if (dto.description() != null) {
            transaction.setDescription(dto.description());
        }
        if (dto.date() != null) {
            transaction.setDate(dto.date());
        }
        if (dto.type() != null) {
            transaction.setType(dto.type());
        }
        if (dto.amount() != null) {
            transaction.setAmount(dto.amount());
        }
        if (transaction.getType() == TransactionType.EXPENSE) {
            if (budget.getCurrentBalance() < transaction.getAmount()) {
                throw new CustomException("Your budget has less than this transaction :(", HttpStatus.BAD_REQUEST);
            }
            budget.setCurrentBalance(budget.getCurrentBalance() - transaction.getAmount());
        } else {
            budget.setCurrentBalance(budget.getCurrentBalance() + transaction.getAmount());
        }
        budgetRepository.save(budget);
        transactionRepository.save(transaction);
    }

    @Transactional
    @Override
    public void deleteTransaction(Transaction transaction) throws CustomException {
        Budget budget = transaction.getBudget();
        if (transaction.getType() == TransactionType.EXPENSE) {
            budget.setCurrentBalance(budget.getCurrentBalance() + transaction.getAmount());
        } else {
            if (budget.getCurrentBalance() < transaction.getAmount()) {
                throw new CustomException("Cannot delete this transaction: it would make your budget negative",
                        HttpStatus.BAD_REQUEST);
            }
            budget.setCurrentBalance(budget.getCurrentBalance() - transaction.getAmount());
        }
        budgetRepository.save(budget);
        transactionRepository.delete(transaction);
    }
}
