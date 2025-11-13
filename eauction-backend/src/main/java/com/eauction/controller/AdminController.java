package com.eauction.controller;

import com.eauction.dto.AdminDashboardResponse;
import com.eauction.dto.AuctionResponse;
import com.eauction.dto.ItemStatusUpdateRequest;
import com.eauction.dto.UserResponse;
import com.eauction.model.Item;
import com.eauction.service.AuctionService;
import com.eauction.service.ItemService;
import com.eauction.service.UserService;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
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
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final UserService userService;
    private final ItemService itemService;
    private final AuctionService auctionService;

    @GetMapping("/users")
    public ResponseEntity<List<UserResponse>> getUsers() {
        return ResponseEntity.ok(userService.getAllUsers().stream().map(UserResponse::from).toList());
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable String id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/items")
    public ResponseEntity<Page<Item>> getItems(@PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(itemService.getItems(pageable));
    }

    @PutMapping("/items/{id}/status")
    public ResponseEntity<Item> updateItemStatus(@PathVariable String id, @Valid @RequestBody ItemStatusUpdateRequest request) {
        return ResponseEntity.ok(itemService.changeStatus(id, request.status()));
    }

    @PostMapping("/auctions/{id}/close")
    public ResponseEntity<AuctionResponse> closeAuction(@PathVariable String id) {
        return ResponseEntity.ok(auctionService.closeAuctionManually(id));
    }

    @GetMapping("/dashboard")
    public ResponseEntity<AdminDashboardResponse> dashboard() {
        long totalUsers = userService.countUsers();
        long totalItems = itemService.countItems();
        long activeAuctions = auctionService.countActiveAuctions();
        double totalRevenue = auctionService.calculateTotalRevenue();
        return ResponseEntity.ok(new AdminDashboardResponse(totalUsers, totalItems, activeAuctions, totalRevenue));
    }
}
