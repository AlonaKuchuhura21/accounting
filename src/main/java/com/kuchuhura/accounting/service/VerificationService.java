package com.kuchuhura.accounting.service;

import com.kuchuhura.accounting.entity.EmailToken;
import com.kuchuhura.accounting.entity.User;
import com.kuchuhura.accounting.exception.CustomException;
import java.util.Optional;

public interface VerificationService {
    Optional<EmailToken> getToken(String token);

    String createToken(User user);

    void sendVerificationEmail(User user) throws CustomException;

    User confirmEmail(String token) throws CustomException;
}
