package com.eauction.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import java.time.Instant;
import java.util.Collection;
import java.util.ArrayList;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "users")
public class User implements UserDetails {

    @Id
    private String id;

    private String name;

    @Indexed(unique = true)
    private String email;

    @JsonIgnore
    private String password;

    private List<Role> roles;

    private String phone;

    private String address;

    private java.util.List<String> watchlist;
    private java.util.List<String> cart;

    @CreatedDate
    private Instant createdAt;

    @LastModifiedDate
    private Instant updatedAt;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        if (roles == null || roles.isEmpty()) {
            return List.of(new SimpleGrantedAuthority("ROLE_BUYER"));
        }
        return roles.stream()
                .map(role -> new SimpleGrantedAuthority("ROLE_" + role.name()))
                .toList();
    }

    public boolean hasRole(Role role) {
        return roles != null && roles.contains(role);
    }

    public boolean isBuyer() {
        return hasRole(Role.BUYER);
    }

    public boolean isSeller() {
        return hasRole(Role.SELLER);
    }

    public void addRole(Role role) {
        if (roles == null) {
            roles = new ArrayList<>();
        }
        if (!roles.contains(role)) {
            roles.add(role);
        }
    }

    public java.util.List<String> getWatchlist() {
        if (watchlist == null) {
            watchlist = new ArrayList<>();
        }
        return watchlist;
    }

    public void addToWatchlist(String itemId) {
        getWatchlist();
        if (!watchlist.contains(itemId)) {
            watchlist.add(itemId);
        }
    }

    public void removeFromWatchlist(String itemId) {
        if (watchlist != null) {
            watchlist.remove(itemId);
        }
    }

    public java.util.List<String> getCart() {
        if (cart == null) {
            cart = new ArrayList<>();
        }
        return cart;
    }

    public void addToCart(String itemId) {
        getCart();
        if (!cart.contains(itemId)) {
            cart.add(itemId);
        }
    }

    public void removeFromCart(String itemId) {
        if (cart != null) {
            cart.remove(itemId);
        }
    }

    public void clearCart() {
        if (cart != null) {
            cart.clear();
        }
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
