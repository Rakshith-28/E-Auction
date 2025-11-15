package com.eauction.service;

import static com.eauction.exception.CustomExceptions.ResourceNotFoundException;
import static com.eauction.exception.CustomExceptions.UnauthorizedException;

import com.eauction.dto.ChangePasswordRequest;
import com.eauction.dto.ProfileUpdateRequest;
import com.eauction.dto.UserStatsResponse;
import com.eauction.model.ItemStatus;
import com.eauction.model.Role;
import com.eauction.model.User;
import com.eauction.repository.BidRepository;
import com.eauction.repository.ItemRepository;
import com.eauction.repository.UserRepository;
import java.time.Instant;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final ItemRepository itemRepository;
    private final BidRepository bidRepository;

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
        user.setBio(request.bio());
        user.setProfilePictureUrl(request.profilePictureUrl());
        user.setCoverPhotoUrl(request.coverPhotoUrl());
        user.setDateOfBirth(request.dateOfBirth());
        user.setGender(request.gender());
        user.setCity(request.city());
        user.setCountry(request.country());
        return userRepository.save(user);
    }

    public User changePassword(ChangePasswordRequest request) {
        User user = getCurrentUser();
        if (!passwordEncoder.matches(request.currentPassword(), user.getPassword())) {
            throw new UnauthorizedException("Current password is incorrect");
        }
        user.setPassword(passwordEncoder.encode(request.newPassword()));
        user = userRepository.save(user);
        log.info("Password changed for user {}", user.getEmail());
        return user;
    }

    public UserStatsResponse getUserStats() {
        User user = getCurrentUser();
        long totalBids = bidRepository.countByBidderId(user.getId());
        long itemsListed = itemRepository.countBySellerId(user.getId());
        // For won items, we'll count bids where auction ended and user had highest bid
        // For sold items, count items with SOLD status
        long itemsSold = itemRepository.countBySellerIdAndStatus(user.getId(), ItemStatus.SOLD);
        // Simplified stats for now
        long itemsWon = 0; // TODO: implement proper won items counting
        long totalTransactions = itemsWon + itemsSold;
        double successRate = totalBids > 0 ? (double) itemsWon / totalBids * 100 : 0;
        return new UserStatsResponse(totalBids, itemsListed, itemsWon, itemsSold, successRate, totalTransactions);
    }

    public void deleteCurrentUserAccount(String password) {
        User user = getCurrentUser();
        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new UnauthorizedException("Password is incorrect");
        }
        user.setAccountStatus("DELETED");
        userRepository.save(user);
        log.info("User account deleted: {}", user.getEmail());
    }

    public void deactivateAccount() {
        User user = getCurrentUser();
        user.setAccountStatus("DEACTIVATED");
        userRepository.save(user);
        log.info("User account deactivated: {}", user.getEmail());
    }

    public void updateLastActive() {
        User user = getCurrentUser();
        user.setLastActive(Instant.now());
        userRepository.save(user);
    }

    public User getUserById(String userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
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
