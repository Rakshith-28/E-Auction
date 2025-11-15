package com.eauction.controller;

import com.eauction.dto.ItemDTO;
import com.eauction.model.Item;
import com.eauction.model.ItemStatus;
import com.eauction.service.ItemService;
import com.eauction.service.UserService;
import com.eauction.service.AuctionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
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
@RequestMapping("/api/items")
@RequiredArgsConstructor
public class ItemController {

    private final ItemService itemService;
    private final AuctionService auctionService;
    private final UserService userService;

    @GetMapping
    public ResponseEntity<Page<Item>> listItems(@PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(itemService.getItems(pageable));
    }

    @GetMapping("/active")
    public ResponseEntity<Page<Item>> listActiveItems(@PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(itemService.getActiveItems(pageable));
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<Page<Item>> listByStatus(@PathVariable ItemStatus status, @PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(itemService.getItemsByStatus(status, pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Item> getItem(@PathVariable String id) {
        return ResponseEntity.ok(itemService.getItem(id));
    }

    @GetMapping("/seller/{sellerId}")
    public ResponseEntity<Page<Item>> getItemsBySeller(@PathVariable String sellerId, @PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(itemService.getItemsBySeller(sellerId, pageable));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('SELLER','ADMIN')")
    public ResponseEntity<Item> createItem(@Valid @RequestBody ItemDTO dto) {
        Item created = itemService.createItem(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('SELLER','ADMIN')")
    public ResponseEntity<Item> updateItem(@PathVariable String id, @Valid @RequestBody ItemDTO dto) {
        return ResponseEntity.ok(itemService.updateItem(id, dto));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('SELLER','ADMIN')")
    public ResponseEntity<Void> deleteItem(@PathVariable String id) {
        itemService.deleteItem(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/mine")
    @PreAuthorize("hasAnyRole('SELLER','ADMIN')")
    public ResponseEntity<java.util.List<Item>> myItems() {
        return ResponseEntity.ok(itemService.getMyItems());
    }

    @GetMapping("/my-items")
    @PreAuthorize("hasAnyRole('SELLER','ADMIN')")
    public ResponseEntity<Page<Item>> myItemsPaged(@PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(itemService.getItemsBySeller(pageable));
    }

    @PostMapping("/{id}/close")
    @PreAuthorize("hasAnyRole('SELLER','ADMIN')")
    public ResponseEntity<com.eauction.dto.AuctionResponse> closeAuction(@PathVariable String id) {
        // Ensure ownership
        Item item = itemService.getItem(id);
        if (!item.getSellerId().equals(userService.getCurrentUser().getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        return ResponseEntity.ok(auctionService.closeAuctionManually(id));
    }
}
