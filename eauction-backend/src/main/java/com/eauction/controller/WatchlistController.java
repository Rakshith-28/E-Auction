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
@RequestMapping("/api/watchlist")
@RequiredArgsConstructor
@PreAuthorize("isAuthenticated()")
public class WatchlistController {

    private final UserService userService;
    private final ItemRepository itemRepository;

    @PostMapping("/{itemId}")
    public ResponseEntity<Map<String, Object>> add(@PathVariable String itemId) {
        userService.addItemToWatchlist(itemId);
        return ResponseEntity.ok(Map.of("status", "added"));
    }

    @DeleteMapping("/{itemId}")
    public ResponseEntity<Map<String, Object>> remove(@PathVariable String itemId) {
        userService.removeItemFromWatchlist(itemId);
        return ResponseEntity.ok(Map.of("status", "removed"));
    }

    @GetMapping
    public ResponseEntity<List<ItemSummary>> list() {
        User user = userService.getCurrentUser();
        List<ItemSummary> items = user.getWatchlist().stream()
                .map(itemRepository::findById)
                .filter(java.util.Optional::isPresent)
                .map(java.util.Optional::get)
                .map(ItemSummary::from)
                .collect(Collectors.toList());
        return ResponseEntity.ok(items);
    }

    @GetMapping("/check/{itemId}")
    public ResponseEntity<Map<String, Boolean>> check(@PathVariable String itemId) {
        boolean present = userService.isItemInWatchlist(itemId);
        return ResponseEntity.ok(Map.of("inWatchlist", present));
    }
}