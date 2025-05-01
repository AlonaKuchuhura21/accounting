package com.kuchuhura.accounting.service.impl;

import com.kuchuhura.accounting.entity.EmailToken;
import com.kuchuhura.accounting.entity.User;
import com.kuchuhura.accounting.exception.CustomException;
import com.kuchuhura.accounting.repository.EmailTokenRepository;
import com.kuchuhura.accounting.repository.UserRepository;
import com.kuchuhura.accounting.service.VerificationService;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Optional;
import java.util.UUID;

@Service
public class VerificationServiceImpl implements VerificationService {
    @Value("${authenticate.account.url}")
    private String url;
    private final EmailTokenRepository emailTokenRepository;
    private final UserRepository userRepository;
    private final JavaMailSender mailSender;

    public VerificationServiceImpl(EmailTokenRepository emailTokenRepository, UserRepository userRepository,
                                   JavaMailSender mailSender) {
        this.emailTokenRepository = emailTokenRepository;
        this.userRepository = userRepository;
        this.mailSender = mailSender;
    }

    public Optional<EmailToken> getToken(String token){
        return emailTokenRepository.findByToken(token);
    }

    public String createToken(User user){
        String token = UUID.randomUUID().toString();
        var emailToken = new EmailToken(
                token,
                Instant.now().plus(24, ChronoUnit.HOURS),
                user
        );
        emailTokenRepository.save(emailToken);
        return token;
    }

    @Async
    public void sendVerificationEmail(User user) throws CustomException {
        try {
            var token = createToken(user);
            String verificationUrl = String.format("%s?token=%s", url, token);
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, "utf-8");
            helper.setText(buildEmail(user.getFullName(), verificationUrl), true);
            helper.setTo(user.getEmail());
            helper.setSubject("Confirm your email");
            helper.setFrom("YourEmailHere");
            mailSender.send(mimeMessage);
        } catch (MessagingException e) {
            throw new CustomException("Failed to send email for: " + user.getEmail(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public User confirmEmail(String token) throws CustomException {
        Optional<EmailToken> confirmToken = getToken(token);
        if (confirmToken.isEmpty()){
            throw new CustomException("Token doesn't exist!", HttpStatus.BAD_REQUEST);
        }
        if (confirmToken.get().isActivated()) {
            throw new CustomException("Token was already activated", HttpStatus.CONFLICT);
        }
        if (confirmToken.get().getExpirationTime().isBefore(Instant.now())) {
            throw new CustomException("Token is expired", HttpStatus.NOT_FOUND);
        }
        User user = confirmToken.get().getUser();
        user.setEnabled(true);
        userRepository.save(user);
        var updateToken = confirmToken.get();
        updateToken.setActivated(true);
        emailTokenRepository.save(updateToken);
        return user;
    }

    private String buildEmail(String fullName, String token){
        return "<div style='font-family: Arial, sans-serif; font-size: 16px; color: #333;'>"
                + "<h2 style='color: #0066cc;'>Вітаємо у нашому сервісі, " + fullName + "!</h2>"
                + "<p>Дякуємо за реєстрацію! Щоб завершити налаштування облікового запису та скористатися всіма перевагами нашої бухгалтерської платформи, активуйте свій акаунт за допомогою кнопки нижче:</p>"
                + "<a href='" + token + "' style='display: inline-block; padding: 12px 24px; "
                + "margin: 20px 0; font-size: 16px; color: #ffffff; background-color: #28a745; "
                + "text-decoration: none; border-radius: 5px;'>Активувати акаунт</a>"
                + "<p>Якщо у Вас виникнуть запитання або потребуватимете допомоги — звертайтесь! Ми завжди раді допомогти.</p>"
                + "<p>Контактна особа: <strong>Alona Kuchuhura</strong></p>"
                + "<p>З повагою,<br>Ваша команда бухгалтерського сервісу</p>"
                + "</div>";
    }
}
