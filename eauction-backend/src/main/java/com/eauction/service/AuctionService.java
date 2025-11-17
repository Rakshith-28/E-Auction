package com.eauction.service;

import static com.eauction.exception.CustomExceptions.BadRequestException;
import static com.eauction.exception.CustomExceptions.ResourceNotFoundException;

import com.eauction.dto.AuctionResponse;
import com.eauction.dto.BidResponse;
import com.eauction.dto.ItemSummary;
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

    @Scheduled(fixedRate = 60000)
    public void notifyEndingSoonAuctions() {
        Instant now = Instant.now();
        Instant cutoff = now.plusSeconds(3600); // 1 hour
        auctionRepository.findByStatus(AuctionStatus.ACTIVE).stream()
                .filter(a -> a.getEndTime() != null && a.getEndTime().isAfter(now) && a.getEndTime().isBefore(cutoff))
                .filter(a -> a.getEndingSoonNotified() == null || !a.getEndingSoonNotified())
                .forEach(a -> {
                    Item item = itemRepository.findById(a.getItemId()).orElse(null);
                    if (item == null) return;
                    String actionUrl = "/items/" + item.getId();
                    // Seller notification
                        notificationService.createNotification(
                            item.getSellerId(),
                            "Auction ending soon!",
                            item.getTitle() + " ends in 1 hour. Current bid: " + com.eauction.util.CurrencyUtil.formatInr(item.getCurrentBid() == null ? 0.0 : item.getCurrentBid()),
                            "AUCTION_ENDING_SOON",
                            item.getId(), item.getTitle(), actionUrl
                        );
                    // Highest bidder notification
                    List<Bid> bids = bidRepository.findByItemIdOrderByBidAmountDesc(item.getId());
                    if (!bids.isEmpty()) {
                        Bid highest = bids.get(0);
                        notificationService.createNotification(
                            highest.getBidderId(),
                            "Auction ending soon!",
                            item.getTitle() + " ends in 1 hour. Current bid: " + com.eauction.util.CurrencyUtil.formatInr(item.getCurrentBid() == null ? 0.0 : item.getCurrentBid()),
                            "AUCTION_ENDING_SOON",
                            item.getId(), item.getTitle(), actionUrl
                        );
                    }
                    a.setEndingSoonNotified(true);
                    auctionRepository.save(a);
                });
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

    public Page<AuctionResponse> getAllAuctions(Pageable pageable) {
        return auctionRepository.findAll(pageable)
                .map(auction -> toAuctionResponse(auction, false));
    }

    public List<AuctionResponse> getActiveAuctions() {
        return auctionRepository.findByStatus(AuctionStatus.ACTIVE)
                .stream()
                .map(auction -> toAuctionResponse(auction, false))
                .toList();
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

    public AuctionResponse getAuctionById(String id) {
        Auction auction = auctionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Auction not found"));
        return toAuctionResponse(auction, true);
    }

    public AuctionResponse closeAuctionManually(String auctionId) {
        Auction auction = auctionRepository.findById(auctionId)
                .orElseThrow(() -> new ResourceNotFoundException("Auction not found"));
        if (auction.getStatus() == AuctionStatus.ENDED) {
            throw new BadRequestException("Auction already closed");
        }
        Auction finalized = finalizeAuction(auction);
        return toAuctionResponse(finalized, true);
    }

    private void notifyAuctionParticipants(Item item, Auction auction, Bid winningBid) {
        userRepository.findById(item.getSellerId()).ifPresent(seller -> {
            String actionUrl = "/items/" + item.getId();
            notificationService.createNotification(
                seller.getId(),
                winningBid != null ? "Your item sold!" : "Auction ended",
                buildSellerMessage(item, winningBid),
                winningBid != null ? "ITEM_SOLD" : "AUCTION_CLOSED",
                item.getId(), item.getTitle(), actionUrl
            );
            if (winningBid != null) {
                emailService.sendEmail(
                        seller.getEmail(),
                        "Your item was sold",
                        "Your item " + item.getTitle() + " sold for " + com.eauction.util.CurrencyUtil.formatInr(winningBid.getBidAmount()) + "."
                );
            }
        });
        if (winningBid != null) {
            userRepository.findById(winningBid.getBidderId()).ifPresent(winner -> {
            String actionUrl = "/items/" + item.getId();
            notificationService.createNotification(
                winner.getId(),
                "Congratulations!",
                "You won " + item.getTitle() + " for " + com.eauction.util.CurrencyUtil.formatInr(winningBid.getBidAmount()),
                "AUCTION_WON",
                item.getId(), item.getTitle(), actionUrl
            );
                emailService.sendEmail(
                        winner.getEmail(),
                        "You won the auction",
                        "Congratulations! You won " + item.getTitle() + " for " + com.eauction.util.CurrencyUtil.formatInr(winningBid.getBidAmount()) + "."
                );
            });
        }
        bidRepository.findByItemIdOrderByBidAmountDesc(item.getId()).stream()
            .skip(winningBid != null ? 1 : 0)
            .forEach(bid -> {
                String actionUrl = "/items/" + item.getId();
                notificationService.createNotification(
                    bid.getBidderId(),
                    winningBid != null ? "Auction ended" : "Auction ended",
                    winningBid != null ? ("You didn't win " + item.getTitle() + ". Final price: " + com.eauction.util.CurrencyUtil.formatInr(winningBid.getBidAmount()))
                        : ("The auction for " + item.getTitle() + " ended without a winner."),
                    winningBid != null ? "AUCTION_LOST" : "AUCTION_CLOSED",
                    item.getId(), item.getTitle(), actionUrl
                );
            });
    }

    private String buildSellerMessage(Item item, Bid winningBid) {
        if (winningBid == null) {
            return "Your auction for " + item.getTitle() + " ended without any winning bids.";
        }
        User buyer = userRepository.findById(winningBid.getBidderId()).orElse(null);
        String buyerName = buyer != null ? buyer.getName() : "the winning bidder";
        return "Your item " + item.getTitle() + " sold to " + buyerName + " for " + com.eauction.util.CurrencyUtil.formatInr(winningBid.getBidAmount());
    }

    private AuctionResponse toAuctionResponse(Auction auction, boolean includeBids) {
        Item item = itemRepository.findById(auction.getItemId())
                .orElseThrow(() -> new ResourceNotFoundException("Item not found"));
        ItemSummary itemSummary = ItemSummary.from(item);
        Double currentBid = item.getCurrentBid();
        List<BidResponse> bidResponses = includeBids
                ? bidRepository.findByItemIdOrderByBidAmountDesc(item.getId())
                .stream()
                .map(BidResponse::from)
                .toList()
                : List.of();
        return AuctionResponse.from(auction, itemSummary, currentBid, bidResponses);
    }
}
