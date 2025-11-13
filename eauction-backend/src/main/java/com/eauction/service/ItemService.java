package com.eauction.service;

import static com.eauction.exception.CustomExceptions.BadRequestException;
import static com.eauction.exception.CustomExceptions.ForbiddenException;
import static com.eauction.exception.CustomExceptions.ResourceNotFoundException;

import com.eauction.dto.ItemDTO;
import com.eauction.model.Auction;
import com.eauction.model.AuctionStatus;
import com.eauction.model.Item;
import com.eauction.model.ItemStatus;
import com.eauction.model.User;
import com.eauction.repository.AuctionRepository;
import com.eauction.repository.ItemRepository;
import java.time.Instant;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;

@Service
@RequiredArgsConstructor
@Slf4j
public class ItemService {

    private final ItemRepository itemRepository;
    private final AuctionRepository auctionRepository;
    private final UserService userService;

    public Item createItem(ItemDTO dto) {
        User seller = userService.getCurrentUser();
        validateItemTimes(dto.auctionStartTime(), dto.auctionEndTime());

        ItemStatus status = determineInitialStatus(dto.auctionStartTime(), dto.auctionEndTime());
        Item item = Item.builder()
                .title(dto.title())
                .description(dto.description())
                .category(dto.category())
                .imageUrl(dto.imageUrl())
                .minimumBid(dto.minimumBid())
                .currentBid(dto.minimumBid())
                .sellerId(seller.getId())
                .auctionStartTime(dto.auctionStartTime())
                .auctionEndTime(dto.auctionEndTime())
                .status(status)
                .build();
        Item savedItem = itemRepository.save(item);
        createAuctionForItem(savedItem);
        log.info("Created item {} with auction between {} and {}", savedItem.getId(), savedItem.getAuctionStartTime(), savedItem.getAuctionEndTime());
        return savedItem;
    }

    public Item updateItem(String itemId, ItemDTO dto) {
        Item item = getItem(itemId);
        User currentUser = userService.getCurrentUser();
        ensureOwnershipOrAdmin(item, currentUser);
        validateItemTimes(dto.auctionStartTime(), dto.auctionEndTime());
        item.setTitle(dto.title());
        item.setDescription(dto.description());
        item.setCategory(dto.category());
        item.setImageUrl(dto.imageUrl());
        item.setMinimumBid(dto.minimumBid());
        if (item.getCurrentBid() == null || item.getCurrentBid() < dto.minimumBid()) {
            item.setCurrentBid(dto.minimumBid());
        }
        item.setAuctionStartTime(dto.auctionStartTime());
        item.setAuctionEndTime(dto.auctionEndTime());
        if (dto.status() != null && userService.isAdmin(currentUser)) {
            item.setStatus(dto.status());
        }
        Item updated = itemRepository.save(item);
        updateAuctionTimeline(updated);
        return updated;
    }

    public void deleteItem(String itemId) {
        Item item = getItem(itemId);
        User currentUser = userService.getCurrentUser();
        ensureOwnershipOrAdmin(item, currentUser);
        itemRepository.deleteById(itemId);
        auctionRepository.findById(itemId).ifPresent(auctionRepository::delete);
    }

    public Item getItem(String itemId) {
        return itemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Item not found"));
    }

    private void ensureOwnershipOrAdmin(Item item, User currentUser) {
        boolean isOwner = item.getSellerId().equals(currentUser.getId());
        if (!isOwner && !userService.isAdmin(currentUser)) {
            throw new ForbiddenException("You are not allowed to modify this item");
        }
    }

    public Page<Item> getItems(Pageable pageable) {
        return itemRepository.findAll(pageable);
    }

    public Page<Item> getItemsByStatus(ItemStatus status, Pageable pageable) {
        return itemRepository.findByStatus(status, pageable);
    }

    public Page<Item> getItemsBySeller(Pageable pageable) {
        User seller = userService.getCurrentUser();
        return itemRepository.findBySellerId(seller.getId(), pageable);
    }

    public Page<Item> getItemsBySeller(String sellerId, Pageable pageable) {
        return itemRepository.findBySellerId(sellerId, pageable);
    }

    public Page<Item> getActiveItems(Pageable pageable) {
        Instant now = Instant.now();
        return itemRepository.findByStatusAndAuctionEndTimeAfter(ItemStatus.ACTIVE, now, pageable);
    }

    public List<Item> getActiveItems() {
        Instant now = Instant.now();
        return itemRepository.findByStatusAndAuctionEndTimeAfter(ItemStatus.ACTIVE, now);
    }

    public List<Item> getMyItems() {
        User seller = userService.getCurrentUser();
        return itemRepository.findBySellerId(seller.getId());
    }

    public long countItems() {
        return itemRepository.count();
    }

    public Item changeStatus(String itemId, ItemStatus status) {
        Item item = getItem(itemId);
        item.setStatus(status);
        Item updated = itemRepository.save(item);
        auctionRepository.findById(itemId).ifPresent(auction -> {
            auction.setStatus(mapItemStatusToAuction(status));
            auctionRepository.save(auction);
        });
        return updated;
    }

    private AuctionStatus mapItemStatusToAuction(ItemStatus status) {
        return switch (status) {
            case ACTIVE -> AuctionStatus.ACTIVE;
            case CLOSED, SOLD -> AuctionStatus.ENDED;
            default -> AuctionStatus.SCHEDULED;
        };
    }

    private void validateItemTimes(Instant start, Instant end) {
        Assert.notNull(start, "Auction start time is required");
        Assert.notNull(end, "Auction end time is required");
        if (!end.isAfter(start)) {
            throw new BadRequestException("Auction end time must be after start time");
        }
    }

    private ItemStatus determineInitialStatus(Instant start, Instant end) {
        Instant now = Instant.now();
        if (end.isBefore(now)) {
            throw new BadRequestException("Auction end time must be in the future");
        }
        if (start.isAfter(now)) {
            return ItemStatus.PENDING;
        }
        return ItemStatus.ACTIVE;
    }

    private void createAuctionForItem(Item item) {
        Auction auction = Auction.builder()
                .id(item.getId())
                .itemId(item.getId())
                .startTime(item.getAuctionStartTime())
                .endTime(item.getAuctionEndTime())
                .status(item.getStatus() == ItemStatus.ACTIVE ? AuctionStatus.ACTIVE : AuctionStatus.SCHEDULED)
                .totalBids(0)
                .build();
        auctionRepository.save(auction);
    }

    private void updateAuctionTimeline(Item item) {
        auctionRepository.findById(item.getId()).ifPresentOrElse(auction -> {
            auction.setStartTime(item.getAuctionStartTime());
            auction.setEndTime(item.getAuctionEndTime());
            auctionRepository.save(auction);
        }, () -> createAuctionForItem(item));
    }
}
