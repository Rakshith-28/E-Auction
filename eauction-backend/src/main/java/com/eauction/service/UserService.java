package com.eauction.service;

import static com.eauction.exception.CustomExceptions.ResourceNotFoundException;
import static com.eauction.exception.CustomExceptions.UnauthorizedException;

import com.eauction.dto.ProfileUpdateRequest;
import com.eauction.model.Role;
import com.eauction.model.User;
import com.eauction.repository.UserRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {

    private final UserRepository userRepository;

    public User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || authentication instanceof AnonymousAuthenticationToken) {
            throw new UnauthorizedException("User not authenticated");
        }
        Object principal = authentication.getPrincipal();
        if (principal instanceof User user) {
            return userRepository.findById(user.getId())
                    .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        }
        throw new UnauthorizedException("User not authenticated");
    }

    public User updateProfile(ProfileUpdateRequest request) {
        User user = getCurrentUser();
        user.setName(request.name());
        user.setPhone(request.phone());
        user.setAddress(request.address());
        return userRepository.save(user);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public long countUsers() {
        return userRepository.count();
    }

    public void deleteUser(String userId) {
        if (!userRepository.existsById(userId)) {
            throw new ResourceNotFoundException("User not found");
        }
        userRepository.deleteById(userId);
        log.info("Deleted user with id {}", userId);
    }

    public boolean isAdmin(User user) {
        return user.getRoles() != null && user.getRoles().contains(Role.ADMIN);
    }

    public User addRoleToCurrentUser(Role role) {
        User user = getCurrentUser();
        if (!user.hasRole(role)) {
            user.addRole(role);
            user = userRepository.save(user);
            log.info("Added role {} to user {}", role, user.getEmail());
        }
        return user;
    }

    public User addItemToWatchlist(String itemId) {
        User user = getCurrentUser();
        user.addToWatchlist(itemId);
        return userRepository.save(user);
    }

    public User removeItemFromWatchlist(String itemId) {
        User user = getCurrentUser();
        user.removeFromWatchlist(itemId);
        return userRepository.save(user);
    }

    public boolean isItemInWatchlist(String itemId) {
        User user = getCurrentUser();
        return user.getWatchlist().contains(itemId);
    }

    public User addItemToCart(String itemId) {
        User user = getCurrentUser();
        user.addToCart(itemId);
        return userRepository.save(user);
    }

    public User removeItemFromCart(String itemId) {
        User user = getCurrentUser();
        user.removeFromCart(itemId);
        return userRepository.save(user);
    }

    public void clearCart() {
        User user = getCurrentUser();
        user.clearCart();
        userRepository.save(user);
    }

    public boolean isItemInCart(String itemId) {
        User user = getCurrentUser();
        return user.getCart().contains(itemId);
    }

    public int getCartCount() {
        User user = getCurrentUser();
        return user.getCart().size();
    }
}
