import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { addToCart as apiAdd, removeFromCart as apiRemove, clearCart as apiClear, getCartCount as apiCount, checkInCart as apiCheck } from '../services/cartService';
import { useAuth } from '../hooks/useAuth';

const CartContext = createContext({
  cartCount: 0,
  refreshCartCount: async () => {},
  addToCart: async (_id) => {},
  removeFromCart: async (_id) => {},
  clearCart: async () => {},
  checkInCart: async (_id) => false,
});

export const CartProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [cartCount, setCartCount] = useState(0);

  const refreshCartCount = useCallback(async () => {
    if (!isAuthenticated) {
      setCartCount(0);
      return 0;
    }
    const [data] = await apiCount();
    const c = data?.count ?? 0;
    setCartCount(c);
    return c;
  }, [isAuthenticated]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (cancelled) return;
      await refreshCartCount();
    })();
    return () => { cancelled = true; };
  }, [refreshCartCount]);

  const addToCart = useCallback(async (itemId) => {
    const [, err] = await apiAdd(itemId);
    if (!err) {
      setCartCount((c) => c + 1);
    }
    return err;
  }, []);

  const removeFromCart = useCallback(async (itemId) => {
    const [, err] = await apiRemove(itemId);
    if (!err) {
      setCartCount((c) => Math.max(0, c - 1));
    }
    return err;
  }, []);

  const clearCart = useCallback(async () => {
    const [, err] = await apiClear();
    if (!err) setCartCount(0);
    return err;
  }, []);

  const checkIn = useCallback(async (itemId) => {
    const [data] = await apiCheck(itemId);
    return Boolean(data?.inCart);
  }, []);

  const value = useMemo(() => ({
    cartCount,
    refreshCartCount,
    addToCart,
    removeFromCart,
    clearCart,
    checkInCart: checkIn,
  }), [cartCount, refreshCartCount, addToCart, removeFromCart, clearCart, checkIn]);

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

CartProvider.propTypes = {
  children: PropTypes.node,
};

export const useCart = () => useContext(CartContext);
