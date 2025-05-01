package com.kuchuhura.accounting.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.time.Instant;
import java.util.Date;
import java.util.List;
import java.util.Objects;

@Entity
@Table(name = "budgets")
public class Budget {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @CreationTimestamp
    @Column(columnDefinition = "TIMESTAMP", name = "createdAt", updatable = false)
    private Instant createdAt;
    @UpdateTimestamp
    @Column(columnDefinition = "TIMESTAMP", name = "updatedAt")
    private Instant updatedAt;
    @Column(name = "title", nullable = false)
    private String title;
    @Column(columnDefinition = "TEXT", name = "description")
    private String description;
    @Column(name = "type", nullable = false)
    @Enumerated(value = EnumType.STRING)
    private BudgetType type;
    @Column(name = "start_date", columnDefinition = "DATE", nullable = false)
    @Temporal(TemporalType.DATE)
    private Date startDate;
    @Column(name = "end_date", columnDefinition = "DATE", nullable = false)
    @Temporal(TemporalType.DATE)
    private Date endDate;
    @Column(name = "initial_balance", nullable = false, updatable = false)
    private double initialBalance;
    @Column(name = "current_balance", nullable = false)
    private double currentBalance;
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    @JsonIgnore
    @OneToMany(mappedBy = "budget", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Transaction> transaction;

    public Budget() {}

    public Long getId() {
        return id;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }

    public String getTitle() {
        return title;
    }

    public String getDescription() {
        return description;
    }

    public BudgetType getType() {
        return type;
    }

    public Date getStartDate() {
        return startDate;
    }

    public Date getEndDate() {
        return endDate;
    }

    public double getCurrentBalance() {
        return currentBalance;
    }

    public User getUser() {
        return user;
    }

    public List<Transaction> getTransaction() {
        return transaction;
    }

    public Budget setTitle(String title) {
        this.title = title;
        return this;
    }

    public Budget setDescription(String description) {
        this.description = description;
        return this;
    }

    public Budget setType(BudgetType type) {
        this.type = type;
        return this;
    }

    public Budget setFrom(Date from) {
        this.startDate = from;
        return this;
    }

    public Budget setTo(Date to) {
        this.endDate = to;
        return this;
    }

    public Budget setInitialBalance(double initialBalance) {
        this.initialBalance = initialBalance;
        return this;
    }

    public Budget setCurrentBalance(double currentBalance) {
        this.currentBalance = currentBalance;
        return this;
    }

    public Budget setUser(User user) {
        this.user = user;
        return this;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Budget budget = (Budget) o;
        return Double.compare(initialBalance, budget.initialBalance) == 0
                && Double.compare(currentBalance, budget.currentBalance) == 0
                && Objects.equals(id, budget.id)
                && Objects.equals(createdAt, budget.createdAt)
                && Objects.equals(updatedAt, budget.updatedAt)
                && Objects.equals(title, budget.title)
                && Objects.equals(description, budget.description)
                && type == budget.type
                && Objects.equals(startDate, budget.startDate)
                && Objects.equals(endDate, budget.endDate)
                && Objects.equals(user, budget.user)
                && Objects.equals(transaction, budget.transaction);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, createdAt, updatedAt, title, description, type, startDate, endDate, initialBalance,
                currentBalance, user, transaction);
    }

    @Override
    public String toString() {
        return "Budget{" +
                "id=" + id +
                ", createdAt=" + createdAt +
                ", updatedAt=" + updatedAt +
                ", title='" + title + '\'' +
                ", description='" + description + '\'' +
                ", type=" + type +
                ", startDate=" + startDate +
                ", endDate=" + endDate +
                ", initialBalance=" + initialBalance +
                ", currentBalance=" + currentBalance +
                ", user=" + user +
                ", transaction=" + transaction +
                '}';
    }
}
