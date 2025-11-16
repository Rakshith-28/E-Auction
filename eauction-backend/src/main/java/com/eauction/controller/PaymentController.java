package com.eauction.controller;

import com.eauction.model.Auction;
import com.eauction.model.Item;
import com.eauction.model.PaymentRecord;
import com.eauction.model.PaymentStatus;
import com.eauction.repository.AuctionRepository;
import com.eauction.repository.ItemRepository;
import com.eauction.repository.PaymentRecordRepository;
import com.eauction.repository.UserRepository;
import java.time.Instant;
import java.util.Map;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final AuctionRepository auctionRepository;
    private final ItemRepository itemRepository;
    private final UserRepository userRepository;
    private final PaymentRecordRepository paymentRecordRepository;

    // Note: This is a mock payment system for demonstration purposes
    @PostMapping("/confirm")
    public ResponseEntity<?> confirmPayment(@RequestBody Map<String, Object> body) {
        try {
            System.out.println("=== Payment Request Received ===");
            System.out.println("Request Body: " + body);
            
            String auctionId = (String) body.get("auctionId");
            String itemId = (String) body.get("itemId");
            String userId = (String) body.get("userId");
            String paymentMethod = (String) body.getOrDefault("paymentMethod", "mock_card");
            
            System.out.println("Parsed - auctionId: " + auctionId);
            System.out.println("Parsed - itemId: " + itemId);
            System.out.println("Parsed - userId: " + userId);
            System.out.println("Parsed - paymentMethod: " + paymentMethod);
            
            final Double amount;
            Object amountObj = body.get("amount");
            if (amountObj instanceof Number n) {
                amount = n.doubleValue();
                System.out.println("Parsed - amount: " + amount);
            }
            else {
                System.out.println("ERROR: Missing or invalid amount. Received: " + amountObj);
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", "Missing amount"));
            }

            // Require userId and at least one of auctionId or itemId
            if (userId == null || (auctionId == null && itemId == null)) {
                System.out.println("ERROR: Missing required fields - userId: " + userId + ", auctionId: " + auctionId + ", itemId: " + itemId);
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("error", "Missing required fields: userId and (auctionId or itemId)"));
            }

            Optional<Auction> auctionOpt = auctionId != null
                ? auctionRepository.findById(auctionId)
                : (itemId != null ? auctionRepository.findTopByItemIdOrderByEndTimeDesc(itemId) : Optional.empty());
            // If lookup by provided auctionId failed but itemId exists, try fallback by itemId
            if (auctionOpt.isEmpty() && itemId != null) {
                System.out.println("Primary lookup failed for auctionId: " + auctionId + ", attempting fallback by itemId: " + itemId);
                auctionOpt = auctionRepository.findTopByItemIdOrderByEndTimeDesc(itemId);
            }
            
            if (auctionOpt.isEmpty()) {
                System.out.println("ERROR: Auction not found for auctionId: " + auctionId + ", itemId: " + itemId);
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Auction not found"));
            }
            Auction auction = auctionOpt.get();
            System.out.println("Found auction: " + auction.getId() + ", Status: " + auction.getStatus());

            if (auction.getWinnerId() == null || !auction.getWinnerId().equals(userId)) {
                System.out.println("ERROR: User is not the winner. WinnerId: " + auction.getWinnerId() + ", UserId: " + userId);
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", "User is not the winner"));
            }

            if (auction.getPaymentStatus() == PaymentStatus.PAID) {
                System.out.println("ERROR: Auction already paid");
                return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("error", "Auction already paid"));
            }

            // Validate amount matches winning bid (allow minor rounding diff)
            double expected = auction.getWinningBid() != null ? auction.getWinningBid() : 0.0;
            System.out.println("Expected winning bid: " + expected + ", Received amount: " + amount);
            
            if (Math.abs(expected - amount) > 0.01 * Math.max(1.0, expected)) {
                // Allow slight deviation due to processing fee added on UI; accept >= winningBid
                if (amount < expected) {
                    System.out.println("ERROR: Invalid payment amount. Expected at least: " + expected);
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", "Invalid payment amount"));
                }
            }
            System.out.println("Amount validation passed");

            // Resolve sellerId from item
            String sellerId = null;
            if (auction.getItemId() != null) {
                Optional<Item> itemOpt = itemRepository.findById(auction.getItemId());
                if (itemOpt.isPresent()) {
                    sellerId = itemOpt.get().getSellerId();
                    System.out.println("Found seller: " + sellerId);
                } else {
                    System.out.println("WARNING: Item not found for itemId: " + auction.getItemId());
                }
            }

            // Create payment record
            PaymentRecord record = PaymentRecord.builder()
                    .auctionId(auction.getId())
                    .buyerId(userId)
                    .sellerId(sellerId)
                    .amount(amount)
                    .paymentMethod(paymentMethod)
                    .status("completed")
                    .build();
            record = paymentRecordRepository.save(record);
            System.out.println("Payment record created with ID: " + record.getId());

            // Update auction payment status
            auction.setPaymentStatus(PaymentStatus.PAID);
            auction.setPaymentDate(Instant.now());
            auctionRepository.save(auction);
            System.out.println("Auction payment status updated to PAID");

            // Update aggregates on users (mock totals for dashboard)
            userRepository.findById(userId).ifPresent(buyer -> {
                double current = buyer.getTotalSpent() == null ? 0.0 : buyer.getTotalSpent();
                buyer.setTotalSpent(current + amount);
                userRepository.save(buyer);
                System.out.println("Buyer total spent updated: " + current + " -> " + buyer.getTotalSpent());
            });
            
            if (sellerId != null) {
                userRepository.findById(sellerId).ifPresent(seller -> {
                    double current = seller.getRevenue() == null ? 0.0 : seller.getRevenue();
                    seller.setRevenue(current + amount);
                    userRepository.save(seller);
                    System.out.println("Seller revenue updated: " + current + " -> " + seller.getRevenue());
                });
            }

            System.out.println("=== Payment Successful ===");
            
            return ResponseEntity.ok(Map.of(
                    "paymentId", record.getId(),
                    "status", record.getStatus(),
                    "auctionId", record.getAuctionId(),
                    "buyerId", record.getBuyerId(),
                    "sellerId", sellerId != null ? sellerId : "",
                    "amount", record.getAmount(),
                    "paymentMethod", record.getPaymentMethod(),
                    "timestamp", record.getCreatedAt()
            ));

        } catch (Exception e) {
            System.out.println("=== Payment Exception ===");
            System.out.println("Exception type: " + e.getClass().getName());
            System.out.println("Exception message: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Payment processing failed: " + e.getMessage()));
        }
    }
    
    @org.springframework.web.bind.annotation.GetMapping("/exists")
    public ResponseEntity<?> paymentExists(@org.springframework.web.bind.annotation.RequestParam(required = false) String auctionId,
                                           @org.springframework.web.bind.annotation.RequestParam(required = false) String itemId,
                                           @org.springframework.web.bind.annotation.RequestParam String userId) {
        Optional<Auction> auctionOpt = auctionId != null
                ? auctionRepository.findById(auctionId)
                : (itemId != null ? auctionRepository.findTopByItemIdOrderByEndTimeDesc(itemId) : Optional.empty());
        if (auctionOpt.isEmpty()) {
            return ResponseEntity.ok(java.util.Map.of("paid", false));
        }
        Auction auction = auctionOpt.get();
        boolean paid = auction.getPaymentStatus() == PaymentStatus.PAID
                || paymentRecordRepository.existsByAuctionIdAndBuyerId(auction.getId(), userId);
        return ResponseEntity.ok(java.util.Map.of("paid", paid));
    }

    @org.springframework.web.bind.annotation.GetMapping("/summary")
    public ResponseEntity<?> paymentSummary(@org.springframework.web.bind.annotation.RequestParam String userId) {
        // Totals from records
        var asBuyer = paymentRecordRepository.findByBuyerId(userId);
        double totalSpent = asBuyer.stream().mapToDouble(r -> r.getAmount() != null ? r.getAmount() : 0.0).sum();
        var asSeller = paymentRecordRepository.findBySellerId(userId);
        double revenue = asSeller.stream().mapToDouble(r -> r.getAmount() != null ? r.getAmount() : 0.0).sum();

        long wonPaid = auctionRepository.countByWinnerIdAndStatusAndPaymentStatus(userId, com.eauction.model.AuctionStatus.ENDED, PaymentStatus.PAID);
        long wonUnpaid = auctionRepository.countByWinnerIdAndStatusAndPaymentStatus(userId, com.eauction.model.AuctionStatus.ENDED, PaymentStatus.PENDING);

        return ResponseEntity.ok(java.util.Map.of(
                "totalSpent", totalSpent,
                "revenue", revenue,
                "wonPaid", wonPaid,
                "wonUnpaid", wonUnpaid
        ));
    }
}