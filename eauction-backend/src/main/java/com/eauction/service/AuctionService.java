package com.eauction.service;

import static com.eauction.exception.CustomExceptions.BadRequestException;
import static com.eauction.exception.CustomExceptions.ResourceNotFoundException;

import com.eauction.model.Auction;
import com.eauction.model.AuctionStatus;
import com.eauction.model.Bid;
import com.eauction.model.BidStatus;
import com.eauction.model.Item;
import com.eauction.model.ItemStatus;
import com.eauction.model.User;
import com.eauction.repository.AuctionRepository;
import com.eauction.repository.BidRepository;
import com.eauction.repository.ItemRepository;
import com.eauction.repository.UserRepository;
import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuctionService {

    private final AuctionRepository auctionRepository;
    private final ItemRepository itemRepository;
    private final BidRepository bidRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;
    private final EmailService emailService;

    @Scheduled(fixedRate = 60000)
    public void activateScheduledAuctions() {
    Instant now = Instant.now();
    List<Auction> auctionsToActivate = auctionRepository
        .findByStatusAndStartTimeBefore(AuctionStatus.SCHEDULED, now);
        for (Auction auction : auctionsToActivate) {
            auction.setStatus(AuctionStatus.ACTIVE);
            auctionRepository.save(auction);
            itemRepository.findById(auction.getItemId()).ifPresent(item -> {
                item.setStatus(ItemStatus.ACTIVE);
                itemRepository.save(item);
            });
            log.info("Auction {} moved to ACTIVE", auction.getId());
        }
    }

    @Scheduled(fixedRate = 60000)
    public void closeExpiredAuctions() {
    Instant now = Instant.now();
    List<Auction> auctionsToClose = auctionRepository
        .findByStatusAndEndTimeBefore(AuctionStatus.ACTIVE, now);
        auctionsToClose.forEach(this::finalizeAuction);
    }

    public Auction finalizeAuction(String auctionId) {
        Auction auction = auctionRepository.findById(auctionId)
                .orElseThrow(() -> new ResourceNotFoundException("Auction not found"));
        return finalizeAuction(auction);
    }

    private Auction finalizeAuction(Auction auction) {
        if (auction.getStatus() == AuctionStatus.ENDED) {
            return auction;
        }
        List<Bid> bids = bidRepository.findByItemIdOrderByBidAmountDesc(auction.getItemId());
        Bid winningBid = bids.isEmpty() ? null : bids.get(0);
        if (winningBid != null) {
            winningBid.setStatus(BidStatus.WON);
            bidRepository.save(winningBid);
            List<Bid> losingBids = bids.stream().skip(1).peek(bid -> bid.setStatus(BidStatus.LOST)).collect(Collectors.toList());
            bidRepository.saveAll(losingBids);
            auction.setWinnerId(winningBid.getBidderId());
            auction.setWinningBid(winningBid.getBidAmount());
        }
        auction.setStatus(AuctionStatus.ENDED);
        auctionRepository.save(auction);

        Item item = itemRepository.findById(auction.getItemId())
                .orElseThrow(() -> new ResourceNotFoundException("Item not found"));
        if (winningBid != null) {
            item.setStatus(ItemStatus.SOLD);
            item.setCurrentBid(winningBid.getBidAmount());
        } else {
            item.setStatus(ItemStatus.CLOSED);
        }
        itemRepository.save(item);
        notifyAuctionParticipants(item, auction, winningBid);
        log.info("Auction {} closed. Winner: {}", auction.getId(), auction.getWinnerId());
        return auction;
    }

    public Page<Auction> getAllAuctions(Pageable pageable) {
        return auctionRepository.findAll(pageable);
    }

    public List<Auction> getActiveAuctions() {
        return auctionRepository.findByStatus(AuctionStatus.ACTIVE);
    }

    public long countActiveAuctions() {
        return auctionRepository.countByStatus(AuctionStatus.ACTIVE);
    }

    public double calculateTotalRevenue() {
        return auctionRepository.findByStatus(AuctionStatus.ENDED).stream()
                .map(Auction::getWinningBid)
                .filter(bid -> bid != null && bid > 0)
                .mapToDouble(Double::doubleValue)
                .sum();
    }

    public Auction getAuctionById(String id) {
        return auctionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Auction not found"));
    }

    public Auction closeAuctionManually(String auctionId) {
        Auction auction = auctionRepository.findById(auctionId)
                .orElseThrow(() -> new ResourceNotFoundException("Auction not found"));
        if (auction.getStatus() == AuctionStatus.ENDED) {
            throw new BadRequestException("Auction already closed");
        }
        return finalizeAuction(auction);
    }

    private void notifyAuctionParticipants(Item item, Auction auction, Bid winningBid) {
        userRepository.findById(item.getSellerId()).ifPresent(seller -> {
            notificationService.createNotification(
                    seller.getId(),
                    "Auction ended",
                    buildSellerMessage(item, winningBid),
                    winningBid != null ? "ITEM_SOLD" : "AUCTION_CLOSED"
            );
            if (winningBid != null) {
                emailService.sendEmail(
                        seller.getEmail(),
                        "Your item was sold",
                        "Your item " + item.getTitle() + " sold for $" + winningBid.getBidAmount() + "."
                );
            }
        });
        if (winningBid != null) {
            userRepository.findById(winningBid.getBidderId()).ifPresent(winner -> {
                notificationService.createNotification(
                        winner.getId(),
                        "Congratulations!",
                        "You won the auction for " + item.getTitle() + " with a bid of $" + winningBid.getBidAmount(),
                        "AUCTION_WON"
                );
                emailService.sendEmail(
                        winner.getEmail(),
                        "You won the auction",
                        "Congratulations! You won " + item.getTitle() + " for $" + winningBid.getBidAmount() + "."
                );
            });
        } else {
            bidRepository.findByItemIdOrderByBidAmountDesc(item.getId()).forEach(bid ->
                    notificationService.createNotification(
                            bid.getBidderId(),
                            "Auction ended",
                            "The auction for " + item.getTitle() + " ended without a winner.",
                            "AUCTION_CLOSED"
                    ));
        }
    }

    private String buildSellerMessage(Item item, Bid winningBid) {
        if (winningBid == null) {
            return "Your auction for " + item.getTitle() + " ended without any winning bids.";
        }
        User buyer = userRepository.findById(winningBid.getBidderId()).orElse(null);
        String buyerName = buyer != null ? buyer.getName() : "the winning bidder";
        return "Your item " + item.getTitle() + " sold to " + buyerName + " for $" + winningBid.getBidAmount();
    }
}
