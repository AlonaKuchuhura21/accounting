package com.kuchuhura.accounting.service.impl;

import com.kuchuhura.accounting.dto.UserResponseDto;
import com.kuchuhura.accounting.dto.UserUpdateDto;
import com.kuchuhura.accounting.entity.User;
import com.kuchuhura.accounting.repository.UserRepository;
import com.kuchuhura.accounting.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;

@Service
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserServiceImpl(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public User getUserDetails(String username) {
        return userRepository.findByEmail(username).orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }

    public User getUserFromAuthentication(Authentication authentication) {
        try {
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            String username = userDetails.getUsername();
            return getUserDetails(username);
        } catch (Exception exception) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User retrieval exception", exception);
        }
    }

    @Override
    public Optional<User> getUserById(long id) {
        return userRepository.findById(id);
    }

    @Override
    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    @Override
    public UserResponseDto updateUser(User user, UserUpdateDto userUpdateDto) {
        if (userUpdateDto.fullName() != null) {
            user.setFullName(userUpdateDto.fullName());
        }
        if (userUpdateDto.password() != null) {
            user.setPassword(passwordEncoder.encode(userUpdateDto.password()));
        }
        User updatedUser = userRepository.save(user);
        return toDto(updatedUser);
    }

    @Override
    public void deleteUser(User user) {
        userRepository.delete(user);
    }

    private UserResponseDto toDto(User user) {
        return new UserResponseDto(
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getCreatedAt(),
                user.getUpdatedAt()
        );
    }
}
