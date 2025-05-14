package com.kuchuhura.accounting.entity;

import java.io.Serializable;
import java.time.Instant;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "tokens")
public class EmailToken implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "token", nullable = false, unique = true)
    private String token;
    @Column(name = "expirationTime", nullable = false)
    private Instant expirationTime;
    @Column(name = "activated", nullable = false)
    private boolean activated;
    @CreationTimestamp
    @Column(name = "createdAt")
    private Instant createdAt;
    @UpdateTimestamp
    @Column(name = "updatedAt")
    private Instant updateAt;
    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;

    public EmailToken() {}

    public EmailToken(String token, Instant expirationTime, User user) {
        this.token = token;
        this.expirationTime = expirationTime;
        this.activated = false;
        this.user = user;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public Instant getExpirationTime() {
        return expirationTime;
    }

    public void setExpirationTime(Instant expirationTime) {
        this.expirationTime = expirationTime;
    }

    public boolean isActivated() {
        return activated;
    }

    public void setActivated(boolean activated) {
        this.activated = activated;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}
