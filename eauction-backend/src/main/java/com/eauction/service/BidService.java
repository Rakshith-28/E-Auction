package com.eauction.service;

import static com.eauction.exception.CustomExceptions.BadRequestException;
import static com.eauction.exception.CustomExceptions.ResourceNotFoundException;

import com.eauction.dto.BidDTO;
import com.eauction.dto.BidResponse;
import com.eauction.dto.ItemSummary;
import com.eauction.model.Auction;
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
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;

@Service
@RequiredArgsConstructor
@Slf4j
public class BidService {

    private final BidRepository bidRepository;
    private final ItemRepository itemRepository;
    private final AuctionRepository auctionRepository;
    private final UserService userService;
    private final NotificationService notificationService;
    private final UserRepository userRepository;

    public BidResponse placeBid(BidDTO bidRequest) {
        Assert.notNull(bidRequest.itemId(), "Item id is required");
        Assert.notNull(bidRequest.bidAmount(), "Bid amount is required");
        User bidder = userService.getCurrentUser();
        Item item = itemRepository.findById(bidRequest.itemId())
                .orElseThrow(() -> new ResourceNotFoundException("Item not found"));
        if (item.getStatus() != ItemStatus.ACTIVE) {
            throw new BadRequestException("Auction is not active");
        }
        if (item.getSellerId().equals(bidder.getId())) {
            throw new BadRequestException("You cannot bid on your own item");
        }
        if (bidRequest.bidAmount() <= item.getCurrentBid()) {
            throw new BadRequestException("Bid amount must be higher than current bid");
        }

        List<Bid> existingBids = bidRepository.findByItemIdOrderByBidAmountDesc(item.getId());
        Bid previousHighest = existingBids.isEmpty() ? null : existingBids.get(0);
        for (Bid existing : existingBids) {
            existing.setStatus(BidStatus.OUTBID);
        }
        bidRepository.saveAll(existingBids);

        Bid bid = Bid.builder()
                .itemId(item.getId())
                .bidderId(bidder.getId())
                .bidAmount(bidRequest.bidAmount())
                .bidTime(Instant.now())
                .status(BidStatus.ACTIVE)
                .build();
        Bid savedBid = bidRepository.save(bid);

        item.setCurrentBid(bidRequest.bidAmount());
        Integer tb = item.getTotalBids() == null ? 0 : item.getTotalBids();
        item.setTotalBids(tb + 1);
        itemRepository.save(item);
        Auction auction = auctionRepository.findById(item.getId()).orElse(null);
        if (auction != null) {
            int total = auction.getTotalBids() == null ? 0 : auction.getTotalBids();
            auction.setTotalBids(total + 1);
            auctionRepository.save(auction);
        }

        notifyParticipants(item, bidder, previousHighest);
        return BidResponse.from(savedBid, ItemSummary.from(item));
    }

    public List<BidResponse> getBidsForItem(String itemId) {
        return bidRepository.findByItemIdOrderByBidAmountDesc(itemId)
                .stream()
                .map(bid -> BidResponse.from(bid))
                .toList();
    }

    public List<BidResponse> getMyBids() {
        User user = userService.getCurrentUser();
        return bidRepository.findByBidderIdOrderByBidTimeDesc(user.getId())
                .stream()
                .map(bid -> {
                    Item item = itemRepository.findById(bid.getItemId()).orElse(null);
                    String bidderName = user.getName();
                    return BidResponse.from(bid, ItemSummary.from(item), bidderName);
                })
                .toList();
    }

    public List<BidResponse> getBidsOnMyItems() {
        User me = userService.getCurrentUser();
        List<Item> myItems = itemRepository.findBySellerId(me.getId());
        java.util.Set<String> itemIds = myItems.stream().map(Item::getId).collect(java.util.stream.Collectors.toSet());
        return itemIds.stream()
                .flatMap(itemId -> bidRepository.findByItemIdOrderByBidAmountDesc(itemId).stream())
                .sorted((a, b) -> b.getBidTime().compareTo(a.getBidTime()))
                .map(bid -> {
                    Item item = itemRepository.findById(bid.getItemId()).orElse(null);
                    String bidderName = userRepository.findById(bid.getBidderId()).map(User::getName).orElse("User");
                    return BidResponse.from(bid, ItemSummary.from(item), bidderName);
                })
                .toList();
    }

        private void notifyParticipants(Item item, User bidder, Bid previousHighest) {
        String actionUrl = "/items/" + item.getId();
        String amountStr = com.eauction.util.CurrencyUtil.formatInr(item.getCurrentBid());
        notificationService.createNotification(
            item.getSellerId(),
            "New bid on " + item.getTitle(),
            bidder.getName() + " placed a bid of " + amountStr,
            "NEW_BID_ON_ITEM",
            item.getId(), item.getTitle(), actionUrl
        );
        notificationService.createNotification(
            bidder.getId(),
            "Bid successful",
            "You placed a bid of " + amountStr + " on " + item.getTitle(),
            "BID_PLACED",
            item.getId(), item.getTitle(), actionUrl
        );
        if (previousHighest != null && !previousHighest.getBidderId().equals(bidder.getId())) {
            notificationService.createNotification(
                previousHighest.getBidderId(),
                "You've been outbid!",
                "Someone bid higher on " + item.getTitle() + ". Current bid: " + amountStr,
                "OUTBID",
                item.getId(), item.getTitle(), actionUrl
            );
        }
    }
}
