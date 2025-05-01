package com.kuchuhura.accounting.service.impl;

import com.kuchuhura.accounting.dto.LoginDto;
import com.kuchuhura.accounting.dto.LoginOauth2Dto;
import com.kuchuhura.accounting.dto.UserCreateDto;
import com.kuchuhura.accounting.entity.User;
import com.kuchuhura.accounting.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthenticationService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;

    public AuthenticationService(
            UserRepository userRepository,
            AuthenticationManager authenticationManager,
            PasswordEncoder passwordEncoder
    ) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public User signup(UserCreateDto userCreateDto) {
        User user = new User(
                userCreateDto.fullName(),
                userCreateDto.email(),
                passwordEncoder.encode(userCreateDto.password()),
                false
        );
        return userRepository.save(user);
    }

    public User authenticate(LoginDto input) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        input.email(),
                        input.password()
                )
        );
        return userRepository.findByEmail(input.email()).orElseThrow();
    }

    @Transactional
    public User signupOauth2(LoginOauth2Dto input) {
        User user = new User();
        user.setFullName(input.fullName());
        user.setEmail(input.email());
        user.setEnabled(true);
        return userRepository.save(user);
    }
}
