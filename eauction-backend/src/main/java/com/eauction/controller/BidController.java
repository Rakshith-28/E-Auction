package com.eauction.controller;

import com.eauction.dto.BidDTO;
import com.eauction.dto.BidResponse;
import com.eauction.service.BidService;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/bids")
@RequiredArgsConstructor
public class BidController {

    private final BidService bidService;

    @PostMapping
    @PreAuthorize("hasRole('BUYER')")
    public ResponseEntity<BidResponse> placeBid(@Valid @RequestBody BidDTO request) {
        BidResponse bid = bidService.placeBid(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(bid);
    }

    @GetMapping("/item/{itemId}")
    public ResponseEntity<List<BidResponse>> bidsForItem(@PathVariable String itemId) {
        return ResponseEntity.ok(bidService.getBidsForItem(itemId));
    }

    @GetMapping("/user")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<BidResponse>> myBids() {
        return ResponseEntity.ok(bidService.getMyBids());
    }
}
