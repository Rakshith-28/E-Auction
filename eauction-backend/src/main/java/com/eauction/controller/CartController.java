package com.eauction.controller;

import com.eauction.dto.ItemSummary;
import com.eauction.model.User;
import com.eauction.repository.ItemRepository;
import com.eauction.service.UserService;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
@PreAuthorize("isAuthenticated()")
public class CartController {

    private final UserService userService;
    private final ItemRepository itemRepository;

    @PostMapping("/{itemId}")
    public ResponseEntity<Map<String, Object>> add(@PathVariable String itemId) {
        userService.addItemToCart(itemId);
        return ResponseEntity.ok(Map.of("status", "added"));
    }

    @DeleteMapping("/{itemId}")
    public ResponseEntity<Map<String, Object>> remove(@PathVariable String itemId) {
        userService.removeItemFromCart(itemId);
        return ResponseEntity.ok(Map.of("status", "removed"));
    }

    @DeleteMapping
    public ResponseEntity<Map<String, Object>> clear() {
        userService.clearCart();
        return ResponseEntity.ok(Map.of("status", "cleared"));
    }

    @GetMapping
    public ResponseEntity<List<ItemSummary>> list() {
        User user = userService.getCurrentUser();
        List<ItemSummary> items = user.getCart().stream()
                .map(itemRepository::findById)
                .filter(java.util.Optional::isPresent)
                .map(java.util.Optional::get)
                .map(ItemSummary::from)
                .collect(Collectors.toList());
        return ResponseEntity.ok(items);
    }

    @GetMapping("/count")
    public ResponseEntity<Map<String, Integer>> count() {
        int count = userService.getCartCount();
        return ResponseEntity.ok(Map.of("count", count));
    }

    @GetMapping("/check/{itemId}")
    public ResponseEntity<Map<String, Boolean>> check(@PathVariable String itemId) {
        boolean present = userService.isItemInCart(itemId);
        return ResponseEntity.ok(Map.of("inCart", present));
    }
}
