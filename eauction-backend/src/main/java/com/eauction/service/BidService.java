package com.eauction.service;

import static com.eauction.exception.CustomExceptions.BadRequestException;
import static com.eauction.exception.CustomExceptions.ResourceNotFoundException;

import com.eauction.dto.BidDTO;
import com.eauction.model.Auction;
import com.eauction.model.Bid;
import com.eauction.model.BidStatus;
import com.eauction.model.Item;
import com.eauction.model.ItemStatus;
import com.eauction.model.User;
import com.eauction.repository.AuctionRepository;
import com.eauction.repository.BidRepository;
import com.eauction.repository.ItemRepository;
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

    public Bid placeBid(BidDTO bidRequest) {
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
        itemRepository.save(item);
        Auction auction = auctionRepository.findById(item.getId()).orElse(null);
        if (auction != null) {
            int total = auction.getTotalBids() == null ? 0 : auction.getTotalBids();
            auction.setTotalBids(total + 1);
            auctionRepository.save(auction);
        }

        notifyParticipants(item, bidder);
        return savedBid;
    }

    public List<Bid> getBidsForItem(String itemId) {
        return bidRepository.findByItemIdOrderByBidAmountDesc(itemId);
    }

    public List<Bid> getMyBids() {
        User user = userService.getCurrentUser();
        return bidRepository.findByBidderId(user.getId());
    }

    private void notifyParticipants(Item item, User bidder) {
        notificationService.createNotification(
                item.getSellerId(),
                "New bid placed",
                bidder.getName() + " placed a bid of $" + item.getCurrentBid() + " on your item " + item.getTitle(),
                "BID_PLACED"
        );
        notificationService.createNotification(
                bidder.getId(),
                "Bid successful",
                "You placed a bid of $" + item.getCurrentBid() + " on " + item.getTitle(),
                "BID_PLACED"
        );
    }
}
