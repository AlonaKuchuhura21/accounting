package com.kuchuhura.accounting.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.time.Instant;
import java.util.Date;
import java.util.Objects;

@Entity
@Table(name = "transactions")
public class Transaction {
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
    private TransactionType type;
    @Column(columnDefinition = "DATE", name = "date", nullable = false)
    private Date date;
    @Column(name = "amount", nullable = false)
    private double amount;
    @ManyToOne
    @JoinColumn(name = "budget_id", nullable = false)
    private Budget budget;

    public Transaction() {}

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

    public TransactionType getType() {
        return type;
    }

    public Date getDate() {
        return date;
    }

    public double getAmount() {
        return amount;
    }

    public Budget getBudget() {
        return budget;
    }

    public Transaction setTitle(String title) {
        this.title = title;
        return this;
    }

    public Transaction setDescription(String description) {
        this.description = description;
        return this;
    }

    public Transaction setType(TransactionType type) {
        this.type = type;
        return this;
    }

    public Transaction setDate(Date date) {
        this.date = date;
        return this;
    }

    public Transaction setAmount(double amount) {
        this.amount = amount;
        return this;
    }

    public Transaction setBudget(Budget budget) {
        this.budget = budget;
        return this;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Transaction that = (Transaction) o;
        return Double.compare(amount, that.amount) == 0
                && Objects.equals(id, that.id)
                && Objects.equals(createdAt, that.createdAt)
                && Objects.equals(updatedAt, that.updatedAt)
                && Objects.equals(title, that.title)
                && Objects.equals(description, that.description)
                && type == that.type
                && Objects.equals(date, that.date)
                && Objects.equals(budget, that.budget);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, createdAt, updatedAt, title, description, type, date, amount, budget);
    }

    @Override
    public String toString() {
        return "Transaction{" +
                "id=" + id +
                ", createdAt=" + createdAt +
                ", updatedAt=" + updatedAt +
                ", title='" + title + '\'' +
                ", description='" + description + '\'' +
                ", type=" + type +
                ", date=" + date +
                ", amount=" + amount +
                ", budget=" + budget +
                '}';
    }
}
