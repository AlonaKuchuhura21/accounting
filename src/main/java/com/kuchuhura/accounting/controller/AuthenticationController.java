package com.kuchuhura.accounting.controller;

import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.kuchuhura.accounting.dto.LoginDto;
import com.kuchuhura.accounting.dto.LoginOauth2Dto;
import com.kuchuhura.accounting.dto.UserCreateDto;
import com.kuchuhura.accounting.entity.User;
import com.kuchuhura.accounting.exception.CustomException;
import com.kuchuhura.accounting.repository.UserRepository;
import com.kuchuhura.accounting.service.UserService;
import com.kuchuhura.accounting.service.VerificationService;
import com.kuchuhura.accounting.service.impl.AuthenticationService;
import com.kuchuhura.accounting.service.impl.JwtService;

import jakarta.validation.Valid;

@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
@RestController
@RequestMapping(path = "/auth")
public class AuthenticationController {
    private final JwtService jwtService;
    private final AuthenticationService authenticationService;
    private final UserService userService;
    private final VerificationService verificationService;
    private final UserRepository userRepository;

    public AuthenticationController(JwtService jwtService, AuthenticationService authenticationService, UserService userService, VerificationService verificationService, UserRepository userRepository) {
        this.jwtService = jwtService;
        this.authenticationService = authenticationService;
        this.userService = userService;
        this.verificationService = verificationService;
        this.userRepository = userRepository;
    }

    @PostMapping(path = "/signup")
    public ResponseEntity<String> signUp(@Valid @RequestBody UserCreateDto userCreateDto) throws CustomException {
        Optional<User> existedUser = userService.getUserByEmail(userCreateDto.email());
        if (existedUser.isEmpty()) {
            User user = authenticationService.signup(userCreateDto);
            verificationService.sendVerificationEmail(user);
            return ResponseEntity.status(HttpStatus.CREATED).build();
        } else {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }
    }

    @PostMapping(path = "/login")
    public ResponseEntity<String> login(@Valid @RequestBody LoginDto loginDto) {
        User authenticatedUser = authenticationService.authenticate(loginDto);
        String jwt = jwtService.generateToken(authenticatedUser);
        return ResponseEntity.status(HttpStatus.OK).body(jwt);
    }

    @PostMapping("/verify-account")
    public ResponseEntity<Void> verifyAccount(@RequestParam(value = "email") String email) throws CustomException {
        Optional<User> user = userService.getUserByEmail(email);
        if (user.isPresent()) {
            if (!user.get().isEnabled()) {
                verificationService.sendVerificationEmail(user.get());
                return ResponseEntity.status(HttpStatus.OK).build();
            } else {
                return ResponseEntity.status(HttpStatus.CONFLICT).build();
            }
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @PostMapping("/confirm-email")
    public ResponseEntity<String> confirmEmail(@RequestParam(value = "token") String token) throws CustomException {
        try {
            User user = verificationService.confirmEmail(token);
            String jwtToken = jwtService.generateToken(user);
            return ResponseEntity.status(HttpStatus.OK).body(jwtToken);
        } catch (Exception exception) {
            if (exception instanceof CustomException) {
                throw exception;
            }
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/login-oauth2")
    public ResponseEntity<String> authenticateOauth2(@Valid @RequestBody LoginOauth2Dto loginOauth2Dto) {
        User user = userRepository.findByEmail(loginOauth2Dto.email())
                .orElseGet(() -> authenticationService.signupOauth2(loginOauth2Dto));

        String jwtToken = jwtService.generateToken(user);
        return ResponseEntity.status(HttpStatus.OK).body(jwtToken);
    }
}
