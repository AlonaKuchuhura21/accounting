package com.kuchuhura.accounting.repository;

import com.kuchuhura.accounting.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    @Query("SELECT t FROM Transaction t WHERE t.budget.id = :budgetId AND EXTRACT(YEAR FROM t.date) = :year")
    List<Transaction> findByBudgetIdAndYear(@Param("budgetId") Long budgetId, @Param("year") int year);

    @Query("""
            SELECT t FROM Transaction t
            JOIN FETCH t.budget b
            WHERE b.id = :budgetId
              AND t.date BETWEEN :startDate AND :endDate
            """)
    List<Transaction> findTransactionsBetweenDates(@Param("budgetId") Long budgetId, @Param("startDate") Date startDate,
                                                   @Param("endDate") Date endDate);
}
