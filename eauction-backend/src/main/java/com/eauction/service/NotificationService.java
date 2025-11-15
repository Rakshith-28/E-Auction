package com.eauction.service;

import static com.eauction.exception.CustomExceptions.ResourceNotFoundException;

import com.eauction.model.Notification;
import com.eauction.repository.NotificationRepository;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserService userService;

    public Notification createNotification(String userId, String title, String message, String type) {
        return createNotification(userId, title, message, type, null, null, null);
    }

    public Notification createNotification(String userId, String title, String message, String type,
                                           String itemId, String itemTitle, String actionUrl) {
        Notification notification = Notification.builder()
                .userId(userId)
                .title(title)
                .message(message)
                .type(type)
                .itemId(itemId)
                .itemTitle(itemTitle)
                .actionUrl(actionUrl)
                .read(false)
                .build();
        notificationRepository.save(notification);
        log.debug("Notification created for user {}: {}", userId, title);
        return notification;
    }

    public Page<Notification> getNotificationsForCurrentUser(int page, int size, boolean unreadOnly, String type, Boolean readFilter) {
        String userId = userService.getCurrentUser().getId();
        List<Notification> all;
        if (unreadOnly) {
            all = notificationRepository.findByUserIdAndReadFalseOrderByCreatedAtDesc(userId);
        } else {
            all = notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
        }
        if (type != null && !type.isBlank()) {
            all = all.stream().filter(n -> type.equalsIgnoreCase(n.getType())).toList();
        }
        if (readFilter != null) {
            all = all.stream().filter(n -> n.isRead() == readFilter).toList();
        }
        int from = page * size;
        int to = Math.min(from + size, all.size());
        List<Notification> slice = from >= all.size() ? List.of() : all.subList(from, to);
        return new PageImpl<>(slice, PageRequest.of(page, size), all.size());
    }

    public long getUnreadCount() {
        String userId = userService.getCurrentUser().getId();
        return notificationRepository.countByUserIdAndReadFalse(userId);
    }

    public void markAsRead(String notificationId) {
        String userId = userService.getCurrentUser().getId();
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found"));
        if (!notification.getUserId().equals(userId)) {
            throw new ResourceNotFoundException("Notification not found");
        }
        notification.setRead(true);
        notificationRepository.save(notification);
    }

    public void markAsUnread(String notificationId) {
        String userId = userService.getCurrentUser().getId();
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found"));
        if (!notification.getUserId().equals(userId)) {
            throw new ResourceNotFoundException("Notification not found");
        }
        notification.setRead(false);
        notificationRepository.save(notification);
    }

    public void markAllAsRead() {
        String userId = userService.getCurrentUser().getId();
        List<Notification> unread = notificationRepository.findByUserIdAndReadFalseOrderByCreatedAtDesc(userId);
        unread.forEach(n -> n.setRead(true));
        notificationRepository.saveAll(unread);
    }

    public void deleteNotification(String id) {
        String userId = userService.getCurrentUser().getId();
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found"));
        if (!notification.getUserId().equals(userId)) {
            throw new ResourceNotFoundException("Notification not found");
        }
        notificationRepository.delete(notification);
    }

    public void clearReadNotifications() {
        String userId = userService.getCurrentUser().getId();
        List<Notification> read = notificationRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .stream().filter(Notification::isRead).toList();
        notificationRepository.deleteAll(read);
    }
}
