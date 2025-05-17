package com.kuchuhura.accounting.controller;

import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.kuchuhura.accounting.dto.UserResponseDto;
import com.kuchuhura.accounting.dto.UserUpdateDto;
import com.kuchuhura.accounting.entity.User;
import com.kuchuhura.accounting.service.UserService;

import jakarta.validation.Valid;

@RestController
@RequestMapping(path = "/users")
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping(path = "/{userId}")
    public ResponseEntity<User> user(@PathVariable(value = "userId") Long userId) {
        Optional<User> user = userService.getUserById(userId);
        return user
                .map(value -> ResponseEntity.status(HttpStatus.OK).body(value))
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    @PatchMapping
    public ResponseEntity<UserResponseDto> updateUser(
            Authentication authentication,
            @Valid @RequestBody UserUpdateDto userUpdateDto
    ) {
        User user = userService.getUserFromAuthentication(authentication);
        if (user.isEnabled()) {
            return ResponseEntity.status(HttpStatus.OK).body(userService.updateUser(user, userUpdateDto));
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @DeleteMapping()
    public ResponseEntity<Void> deleteUser(Authentication authentication) {
        User user = userService.getUserFromAuthentication(authentication);
        if (user.isEnabled()) {
            userService.deleteUser(user);
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }
}
