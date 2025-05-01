package com.kuchuhura.accounting.service;

import com.kuchuhura.accounting.dto.UserCreateDto;
import com.kuchuhura.accounting.dto.UserResponseDto;
import com.kuchuhura.accounting.dto.UserUpdateDto;
import com.kuchuhura.accounting.entity.User;
import org.springframework.security.core.Authentication;

import java.util.Optional;

public interface UserService {
    User getUserFromAuthentication(Authentication authentication);

    Optional<User> getUserById(long id);

    Optional<User> getUserByEmail(String email);

    UserResponseDto updateUser(User user, UserUpdateDto userUpdateDto);

    void deleteUser(User user);
}
