package com.eauction.service;

import static com.eauction.exception.CustomExceptions.BadRequestException;

import com.eauction.dto.JwtResponse;
import com.eauction.dto.LoginRequest;
import com.eauction.dto.RegisterRequest;
import com.eauction.model.Role;
import com.eauction.model.User;
import com.eauction.repository.UserRepository;
import com.eauction.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;

    public void register(RegisterRequest request) {
        log.info("Registering new user with email {}", request.email());
        if (userRepository.existsByEmail(request.email())) {
            throw new BadRequestException("Email already registered");
        }
        Role role = request.role();
        User user = User.builder()
                .name(request.name())
                .email(request.email().toLowerCase())
                .password(passwordEncoder.encode(request.password()))
                .role(role)
                .phone(request.phone())
                .address(request.address())
                .build();
        userRepository.save(user);
    }

    public JwtResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.email().toLowerCase(), request.password())
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String token = jwtTokenProvider.generateToken((User) authentication.getPrincipal());
        return new JwtResponse(token);
    }
}
