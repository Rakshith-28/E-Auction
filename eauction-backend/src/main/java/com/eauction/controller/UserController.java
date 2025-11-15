package com.eauction.controller;

import com.eauction.dto.AddRoleRequest;
import com.eauction.dto.ChangePasswordRequest;
import com.eauction.dto.ProfileUpdateRequest;
import com.eauction.dto.UserResponse;
import com.eauction.dto.UserStatsResponse;
import com.eauction.model.Role;
import com.eauction.service.UserService;
import jakarta.validation.Valid;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/profile")
    public ResponseEntity<UserResponse> getProfile() {
        return ResponseEntity.ok(UserResponse.from(userService.getCurrentUser()));
    }

    @PutMapping("/profile")
    public ResponseEntity<UserResponse> updateProfile(@Valid @RequestBody ProfileUpdateRequest request) {
        return ResponseEntity.ok(UserResponse.from(userService.updateProfile(request)));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<java.util.List<UserResponse>> getUsers() {
        return ResponseEntity.ok(userService.getAllUsers().stream().map(UserResponse::from).toList());
    }

    @PutMapping("/add-role")
    public ResponseEntity<UserResponse> addRole(@Valid @RequestBody AddRoleRequest request) {
        Role role = request.role();
        return ResponseEntity.ok(UserResponse.from(userService.addRoleToCurrentUser(role)));
    }

    @GetMapping("/me")
    public ResponseEntity<UserResponse> getCurrentUser() {
        return ResponseEntity.ok(UserResponse.from(userService.getCurrentUser()));
    }

    @GetMapping("/{userId}")
    public ResponseEntity<UserResponse> getUserById(@PathVariable String userId) {
        return ResponseEntity.ok(UserResponse.from(userService.getUserById(userId)));
    }

    @GetMapping("/stats")
    public ResponseEntity<UserStatsResponse> getUserStats() {
        return ResponseEntity.ok(userService.getUserStats());
    }

    @PostMapping("/change-password")
    public ResponseEntity<Map<String, String>> changePassword(@Valid @RequestBody ChangePasswordRequest request) {
        userService.changePassword(request);
        return ResponseEntity.ok(Map.of("message", "Password changed successfully"));
    }

    @DeleteMapping("/account")
    public ResponseEntity<Map<String, String>> deleteAccount(@RequestBody Map<String, String> request) {
        String password = request.get("password");
        userService.deleteCurrentUserAccount(password);
        return ResponseEntity.ok(Map.of("message", "Account deleted successfully"));
    }

    @PutMapping("/deactivate")
    public ResponseEntity<Map<String, String>> deactivateAccount() {
        userService.deactivateAccount();
        return ResponseEntity.ok(Map.of("message", "Account deactivated successfully"));
    }
}
