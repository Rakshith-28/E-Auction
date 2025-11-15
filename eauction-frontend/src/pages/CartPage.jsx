import { useEffect, useState } from 'react';
import ItemCard from '../components/Item/ItemCard.jsx';
import { getCartItems } from '../services/cartService.js';
import { useCart } from '../context/CartContext.jsx';

const CartPage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { clearCart: ctxClear, refreshCartCount, removeFromCart } = useCart();

  useEffect(() => {
    let active = true;
    (async () => {
      const [data, err] = await getCartItems();
      if (!active) return;
      if (err) setError(err.message || 'Failed to load cart');
      else if (data) setItems(data);
      setLoading(false);
    })();
    return () => { active = false; };
  }, []);

  if (loading) {
    return <div className="mx-auto max-w-6xl px-4 py-10"><p className="text-sm text-slate-500">Loading cart...</p></div>;
  }

  if (error) {
    return <div className="mx-auto max-w-6xl px-4 py-10"><p className="text-sm text-red-600">{error}</p></div>;
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-2xl font-bold text-slate-900">My Cart</h1>
      {items.length > 0 && (
        <div className="mt-4">
          <button
            type="button"
            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-danger/30 hover:text-danger"
            onClick={async () => {
              await ctxClear();
              await refreshCartCount();
              setItems([]);
            }}
          >
            Clear Cart
          </button>
        </div>
      )}
      {items.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-slate-200 p-10 text-center">
          <p className="text-sm text-slate-600">Your cart is empty.</p>
          <p className="mt-2 text-xs text-slate-500">Browse items and add them to your cart.</p>
        </div>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <div key={item.id}>
              <ItemCard item={item} />
              <div className="mt-3">
                <button
                  type="button"
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-danger/30 hover:text-danger"
                  onClick={async () => {
                    const err = await removeFromCart(item.id);
                    if (!err) {
                      setItems((prev) => prev.filter((i) => i.id !== item.id));
                      await refreshCartCount();
                    }
                  }}
                >
                  Remove from Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CartPage;
