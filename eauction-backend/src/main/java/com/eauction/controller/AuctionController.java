package com.eauction.controller;

import com.eauction.model.Auction;
import com.eauction.service.AuctionService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auctions")
@RequiredArgsConstructor
public class AuctionController {

    private final AuctionService auctionService;

    @GetMapping
    public ResponseEntity<Page<Auction>> getAuctions(@PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(auctionService.getAllAuctions(pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Auction> getAuction(@PathVariable String id) {
        return ResponseEntity.ok(auctionService.getAuctionById(id));
    }

    @GetMapping("/active")
    public ResponseEntity<java.util.List<Auction>> activeAuctions() {
        return ResponseEntity.ok(auctionService.getActiveAuctions());
    }
}
