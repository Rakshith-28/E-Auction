import { memo, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import CountdownTimer from '../Common/CountdownTimer';
import { Heart, ShoppingCart } from 'lucide-react';
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
      className="group flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-white/60 bg-white/95 shadow-lg backdrop-blur transition hover:-translate-y-0.5 hover:shadow-xl"
      onClick={go}
    >
      <div className="relative aspect-[4/3] w-full bg-slate-100">
        {item.imageUrl ? (
          <img src={item.imageUrl} alt={item.title} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]" />
        ) : (
          <div className="grid h-full w-full place-items-center text-slate-400">No image</div>
        )}
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
          <div className="font-semibold text-slate-900">${Number(item.currentBid ?? item.minimumBid ?? 0).toFixed(2)}</div>
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
