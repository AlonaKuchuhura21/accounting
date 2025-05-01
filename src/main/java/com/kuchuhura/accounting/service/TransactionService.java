package com.kuchuhura.accounting.service;

import com.kuchuhura.accounting.dto.TransactionCreateDto;
import com.kuchuhura.accounting.dto.TransactionUpdateDto;
import com.kuchuhura.accounting.dto.YearlyTransactionsDto;
import com.kuchuhura.accounting.entity.Budget;
import com.kuchuhura.accounting.entity.Transaction;
import com.kuchuhura.accounting.exception.CustomException;

import java.util.Optional;

public interface TransactionService {
    Optional<Transaction> getTransactionById(long id);

    YearlyTransactionsDto allTransactions(Budget budget, int year);

    void createTransaction(TransactionCreateDto transactionCreateDto, Budget budget) throws CustomException;

    void updateTransaction(Transaction transaction, TransactionUpdateDto transactionUpdateDto) throws CustomException;

    void deleteTransaction(Transaction transaction) throws CustomException;
}
