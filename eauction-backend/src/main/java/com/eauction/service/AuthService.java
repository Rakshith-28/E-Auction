package com.eauction.service;

import static com.eauction.exception.CustomExceptions.BadRequestException;

import com.eauction.dto.GoogleLoginRequest;
import com.eauction.dto.JwtResponse;
import com.eauction.dto.LoginRequest;
import com.eauction.dto.RegisterRequest;
import com.eauction.model.Role;
import com.eauction.model.User;
import com.eauction.repository.UserRepository;
import com.eauction.security.JwtTokenProvider;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.FirebaseToken;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;

    public JwtResponse register(RegisterRequest request) {
        log.info("Registering new user with email {}", request.email());
        if (userRepository.existsByEmail(request.email())) {
            throw new BadRequestException("Email already registered");
        }
        List<Role> roles = request.roles();
        if (roles == null || roles.isEmpty()) {
            roles = List.of(Role.BUYER);
        }
        User user = User.builder()
                .name(request.name())
                .email(request.email().toLowerCase())
                .password(passwordEncoder.encode(request.password()))
                .roles(roles)
                .phone(request.phone())
                .address(request.address())
                .build();
        User saved = userRepository.save(user);
        String token = jwtTokenProvider.generateToken(saved);
        return new JwtResponse(token);
    }

    public JwtResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.email().toLowerCase(), request.password())
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String token = jwtTokenProvider.generateToken((User) authentication.getPrincipal());
        return new JwtResponse(token);
    }

    public JwtResponse loginWithGoogle(GoogleLoginRequest request) {
        log.info("Attempting Google login with token length: {}", request.idToken() != null ? request.idToken().length() : "null");
        
        FirebaseToken firebaseToken;
        try {
            log.debug("Verifying Firebase ID token...");
            firebaseToken = FirebaseAuth.getInstance().verifyIdToken(request.idToken());
            log.info("Successfully verified Firebase token for user: {}", firebaseToken.getEmail());
        } catch (FirebaseAuthException e) {
            log.error("Failed to verify Google ID token. Error code: {}, Message: {}", 
                e.getAuthErrorCode(), e.getMessage(), e);
            String reason = e.getAuthErrorCode() != null ? e.getAuthErrorCode().name() : e.getMessage();
            throw new BadRequestException("Unable to verify Google token: " + reason);
        } catch (Exception e) {
            log.error("Unexpected error during Firebase token verification", e);
            throw new BadRequestException("Unexpected error verifying Google token: " + e.getMessage());
        }

        String email = firebaseToken.getEmail();
        if (email == null || email.isBlank()) {
            throw new BadRequestException("Google account does not contain an email address");
        }
        email = email.toLowerCase();

        User user = userRepository.findByEmail(email).orElse(null);
        if (user == null) {
            user = provisionGoogleUser(firebaseToken, email);
        }

        // Ensure roles are set (defensive check)
        if (user.getRoles() == null || user.getRoles().isEmpty()) {
            log.warn("User {} has null or empty roles, setting to BUYER", email);
            user.setRoles(List.of(Role.BUYER));
            user = userRepository.save(user);
        }

        String token = jwtTokenProvider.generateToken(user);
        return new JwtResponse(token);
    }

    private User provisionGoogleUser(FirebaseToken firebaseToken, String email) {
        String displayName = firebaseToken.getName();
        if (displayName == null || displayName.isBlank()) {
            displayName = email;
        }

        Map<String, Object> claims = firebaseToken.getClaims();
        Object emailVerifiedClaim = claims.get("email_verified");
        if (emailVerifiedClaim instanceof Boolean verified && !verified) {
            throw new BadRequestException("Google account email is not verified");
        } else if (!(emailVerifiedClaim instanceof Boolean)) {
            log.warn("Google token for {} missing email_verified claim. Proceeding with user provisioning.", email);
        }

        User user = User.builder()
                .name(displayName)
                .email(email)
                .password(passwordEncoder.encode(UUID.randomUUID().toString()))
                .roles(List.of(Role.BUYER))
                .build();
        User savedUser = userRepository.save(user);
        log.info("Provisioned new user {} via Google sign-in", email);
        return savedUser;
    }
}
