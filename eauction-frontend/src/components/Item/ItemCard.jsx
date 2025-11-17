import { memo, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import CountdownTimer from '../Common/CountdownTimer';
import { Heart, ShoppingCart } from 'lucide-react';
import { formatInr } from '../../utils/currencyUtils';
import { addToWatchlist, removeFromWatchlist, checkWatchlist } from '../../services/watchlistService.js';
import { useCart } from '../../context/CartContext.jsx';
import { checkInCart as apiCheckInCart } from '../../services/cartService.js';

const ItemCard = ({ item, onClick }) => {
  const navigate = useNavigate();
  const [fav, setFav] = useState(false);
  const [loadingFav, setLoadingFav] = useState(false);
  const [inCart, setInCart] = useState(false);
  const [loadingCart, setLoadingCart] = useState(false);
  const { addToCart, removeFromCart } = useCart();

  useEffect(() => {
    let active = true;
    (async () => {
      const [data] = await checkWatchlist(item.id);
      if (active && data) setFav(Boolean(data.inWatchlist));
    })();
    return () => { active = false; };
  }, [item.id]);

  useEffect(() => {
    let active = true;
    (async () => {
      const [data] = await apiCheckInCart(item.id);
      if (active) setInCart(Boolean(data?.inCart));
    })();
    return () => { active = false; };
  }, [item.id]);

  const toggleFav = async (e) => {
    e.stopPropagation();
    if (loadingFav) return;
    setLoadingFav(true);
    if (fav) {
      await removeFromWatchlist(item.id);
      setFav(false);
    } else {
      await addToWatchlist(item.id);
      setFav(true);
    }
    setLoadingFav(false);
  };
  const go = () => (onClick ? onClick() : navigate(`/items/${item.id}`));

  const toggleCart = async (e) => {
    e.stopPropagation();
    if (loadingCart) return;
    setLoadingCart(true);
    if (inCart) {
      const err = await removeFromCart(item.id);
      if (!err) setInCart(false);
    } else {
      const err = await addToCart(item.id);
      if (!err) setInCart(true);
    }
    setLoadingCart(false);
  };

  return (
    <article
      className="group flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl border border-white/60 bg-white/95 shadow-lg backdrop-blur transition hover:-translate-y-0.5 hover:shadow-xl"
      onClick={go}
    >
      <div className="relative h-48 w-full shrink-0 overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200">
        {(() => {
          const raw = item.images?.[0] || item.imageUrl;
          const src = (() => {
            if (!raw) return 'https://placehold.co/600x450/e2e8f0/64748b?text=No+Image';
            if (raw.startsWith('http')) return raw;
            const uploadsIdx = raw.indexOf('/uploads/');
            const path = uploadsIdx >= 0
              ? raw.substring(uploadsIdx)
              : (raw.startsWith('/uploads') ? raw : `/uploads/${raw}`);
            return `http://localhost:8080${path}`;
          })();
          const imageCount = item.images?.length || 0;
          return (
            <>
              <img
                src={src}
                alt={item.title}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                onError={(e) => { e.target.src = 'https://placehold.co/600x450/e2e8f0/64748b?text=No+Image'; }}
              />
              {imageCount > 1 && (
                <div className="absolute bottom-2 right-2 flex items-center gap-1 rounded-full bg-black/60 px-2 py-1 text-xs font-medium text-white backdrop-blur">
                  <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                  </svg>
                  {imageCount}
                </div>
              )}
            </>
          );
        })()}
        {item.category && (
          <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2 py-0.5 text-xs font-medium text-slate-700 shadow">
            {item.category}
          </span>
        )}
        <button
          type="button"
          onClick={toggleFav}
          className={`absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/80 backdrop-blur transition hover:bg-white ${fav ? 'text-rose-600' : 'text-slate-500'}`}
          aria-label={fav ? 'Remove from watchlist' : 'Add to watchlist'}
        >
          <Heart className={`h-5 w-5 ${fav ? 'fill-rose-500' : 'fill-transparent'}`} />
        </button>
        <button
          type="button"
          onClick={toggleCart}
          className={`absolute right-3 top-14 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/80 backdrop-blur transition hover:bg-white ${inCart ? 'text-primary-600' : 'text-slate-500'}`}
          aria-label={inCart ? 'Remove from cart' : 'Add to cart'}
        >
          <ShoppingCart className={`h-5 w-5 ${inCart ? 'fill-primary-500' : 'fill-transparent'}`} />
        </button>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="line-clamp-2 text-sm font-semibold text-slate-900">{item.title}</h3>
        <div className="mt-2 flex items-center justify-between text-sm">
          <div className="font-semibold text-slate-900">₹{formatInr(item.currentBid ?? item.minimumBid ?? 0)}</div>
          {item.auctionEndTime && <CountdownTimer endTime={item.auctionEndTime} />}
        </div>
        <div className="mt-1 text-xs text-slate-500">
          {(() => {
            const count = typeof item.totalBids === 'number' ? item.totalBids : 0;
            if (count === 0) return 'No bids yet';
            return `${count} ${count === 1 ? 'bid' : 'bids'}`;
          })()}
        </div>
        <button
          className="mt-3 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-primary-600 to-secondary px-3 py-2 text-sm font-semibold text-white shadow transition hover:shadow-lg"
          onClick={(e) => {
            e.stopPropagation();
            go();
          }}
        >
          View Details
        </button>
      </div>
    </article>
  );
};

ItemCard.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string,
    imageUrl: PropTypes.string,
    category: PropTypes.string,
    minimumBid: PropTypes.number,
    currentBid: PropTypes.number,
    auctionEndTime: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
    totalBids: PropTypes.number,
  }).isRequired,
  onClick: PropTypes.func,
};

export default memo(ItemCard);
