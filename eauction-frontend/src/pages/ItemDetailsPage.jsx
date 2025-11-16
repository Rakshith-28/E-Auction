import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import PageContainer from '../components/Common/PageContainer.jsx';
import Loader from '../components/Common/Loader.jsx';
import CountdownTimer from '../components/Common/CountdownTimer.jsx';
import Toast from '../components/Common/Toast.jsx';
import { getItem } from '../services/itemService.js';
import { getBidsForItem, placeBid } from '../services/bidService.js';
import { formatDateTime } from '../utils/dateUtils.js';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../context/CartContext.jsx';
import { checkInCart as apiCheckInCart } from '../services/cartService.js';
import BidConfirmationModal from '../components/Auction/BidConfirmationModal.jsx';

const ItemDetailsPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [item, setItem] = useState(null);
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bidAmount, setBidAmount] = useState('');
  const [placing, setPlacing] = useState(false);
  const [toast, setToast] = useState(null);
  const [inCart, setInCart] = useState(false);
  const [cartBusy, setCartBusy] = useState(false);
  const { addToCart, removeFromCart } = useCart();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingBid, setPendingBid] = useState(null);

  const fetchAll = async () => {
    const [[itemData, itemErr], [bidsData, bidsErr]] = await Promise.all([
      getItem(id),
      getBidsForItem(id),
    ]);
    if (itemErr) setError(itemErr);
    else setItem(itemData);
    if (!bidsErr && bidsData) setBids(bidsData);
    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    fetchAll();
    // Poll bids every 5s when page visible
    let intervalId = null;
    const startPolling = () => {
      intervalId = setInterval(async () => {
        if (document.visibilityState !== 'visible') return;
        const [data] = await getBidsForItem(id);
        if (data) setBids(data);
        const [itm] = await getItem(id);
        if (itm) setItem(itm);
      }, 5000);
    };
    startPolling();
    return () => intervalId && clearInterval(intervalId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    let active = true;
    (async () => {
      if (!id) return;
      const [data] = await apiCheckInCart(id);
      if (active) setInCart(Boolean(data?.inCart));
    })();
    return () => { active = false; };
  }, [id]);

  useEffect(() => {
    const t = toast ? setTimeout(() => setToast(null), 3500) : null;
    return () => t && clearTimeout(t);
  }, [toast]);

  const minimumBid = useMemo(() => {
    if (!item) return 0;
    const current = item.currentBid ?? 0;
    const minimum = item.minimumBid ?? 0;
    return Math.max(current, minimum);
  }, [item]);

  const handleBid = async (e) => {
    e.preventDefault();
    if (!item) return;
    const amount = Number.parseFloat(bidAmount);
    if (Number.isNaN(amount) || amount <= minimumBid) {
      setToast({ type: 'error', title: 'Invalid bid', message: `Bid must be greater than ${minimumBid.toFixed(2)}` });
      return;
    }
    if (user && item.sellerId === user.id) {
      setToast({ type: 'error', title: 'Not allowed', message: 'You cannot bid on your own item.' });
      return;
    }
    setPendingBid(amount);
    setConfirmOpen(true);
  };

  const confirmPlaceBid = async () => {
    if (!item || !pendingBid) return false;
    setPlacing(true);
    const [, err] = await placeBid({ itemId: item.id, bidAmount: pendingBid });
    setPlacing(false);
    if (err) {
      setToast({ type: 'error', title: 'Bid failed', message: err });
      return false;
    }
    setToast({ type: 'success', title: 'Bid placed', message: 'Bid placed successfully!' });
    setBidAmount('');
    setConfirmOpen(false);
    setPendingBid(null);
    fetchAll();
    return true;
  };

  const handleCartToggle = async () => {
    if (!item) return;
    setCartBusy(true);
    if (inCart) {
      const err = await removeFromCart(item.id);
      if (!err) {
        setInCart(false);
        setToast({ type: 'success', title: 'Removed', message: 'Item removed from cart.' });
      } else {
        setToast({ type: 'error', title: 'Remove failed', message: err });
      }
    } else {
      const err = await addToCart(item.id);
      if (!err) {
        setInCart(true);
        setToast({ type: 'success', title: 'Added', message: 'Item added to cart.' });
      } else {
        setToast({ type: 'error', title: 'Add failed', message: err });
      }
    }
    setCartBusy(false);
  };

  if (loading) {
    return (
      <PageContainer title="Item details">
        <Loader label="Loading item" />
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer title="Item details">
        <p className="text-sm text-red-600">{error}</p>
      </PageContainer>
    );
  }

  if (!item) {
    return (
      <PageContainer title="Item details">
        <p className="text-sm text-slate-600">Item not found.</p>
      </PageContainer>
    );
  }

  const isEnded = item.auctionEndTime && new Date(item.auctionEndTime).getTime() <= Date.now();

  return (
    <PageContainer
      title={item.title}
      subtitle={item.description}
      actions={item.status === 'ACTIVE' && !isEnded ? (
        <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700">Active</span>
      ) : (
        <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-600">Ended</span>
      )}
    >
      <div className="grid gap-6 md:grid-cols-[2fr_1fr]">
        <div className="space-y-6">
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="relative mx-auto aspect-[4/3] w-full max-w-lg bg-gradient-to-br from-slate-100 to-slate-200">
              <img 
                src={item.images?.[0] || item.imageUrl || 'https://placehold.co/800x600/e2e8f0/64748b?text=No+Image'} 
                alt={item.title} 
                className="h-full w-full object-cover"
                onError={(e) => { e.target.src = 'https://placehold.co/800x600/e2e8f0/64748b?text=No+Image'; }}
              />
            </div>
            <div className="grid gap-4 p-6 text-sm text-slate-600 md:grid-cols-2">
              <div>
                <div className="text-xs font-medium text-slate-500">Category</div>
                <div className="mt-1 capitalize text-slate-900">{item.category ?? 'N/A'}</div>
              </div>
              <div>
                <div className="text-xs font-medium text-slate-500">Minimum bid</div>
                <div className="mt-1 text-slate-900">${(item.minimumBid ?? 0).toFixed(2)}</div>
              </div>
              <div>
                <div className="text-xs font-medium text-slate-500">Auction ends</div>
                <div className="mt-1 text-slate-900">{formatDateTime(item.auctionEndTime)}</div>
              </div>
              <div>
                <div className="text-xs font-medium text-slate-500">Time remaining</div>
                <div className="mt-1 text-slate-900">
                  {item.auctionEndTime ? <CountdownTimer endTime={item.auctionEndTime} /> : '—'}
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Bid history</h2>
            {bids.length === 0 ? (
              <p className="mt-3 text-sm text-slate-600">No bids yet.</p>
            ) : (
              <ul className="mt-3 space-y-2">
                {bids.map((b) => (
                  <li key={b.id} className="flex items-center justify-between rounded-xl border border-slate-100 bg-surface px-4 py-3 text-sm">
                    <span className="font-medium text-slate-900">${b.amount?.toFixed?.(2) ?? b.amount}</span>
                    <span className="text-slate-500">{formatDateTime(b.timestamp)}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <aside className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Auction</h2>
          <div className="mt-2 text-sm text-slate-600">Current highest bid</div>
          <div className="mt-1 text-3xl font-bold text-slate-900">${(item.currentBid ?? item.minimumBid ?? 0).toFixed(2)}</div>
          <button
            type="button"
            onClick={handleCartToggle}
            disabled={cartBusy}
            className="mt-4 w-full rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-primary-200 hover:text-primary-600 disabled:opacity-60"
          >
            {inCart ? (cartBusy ? 'Removing…' : 'Remove from Cart') : (cartBusy ? 'Adding…' : 'Add to Cart')}
          </button>
          <form onSubmit={handleBid} className="mt-6 space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-700">Your bid</label>
              <input
                type="number"
                min={minimumBid + 0.01}
                step="0.01"
                value={bidAmount}
                onChange={(e) => setBidAmount(e.target.value)}
                disabled={isEnded}
                className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-2 text-sm"
                required
              />
            </div>
            <button
              type="submit"
              disabled={placing || isEnded}
              className="w-full rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700 disabled:opacity-60"
            >
              {isEnded ? 'Auction Ended' : placing ? 'Placing…' : 'Place Bid'}
            </button>
          </form>
        </aside>
      </div>

      {toast && <Toast type={toast.type} title={toast.title} message={toast.message} />}

      <BidConfirmationModal
        isOpen={confirmOpen}
        onClose={() => { setConfirmOpen(false); setPendingBid(null); }}
        item={item}
        currentBid={item?.currentBid ?? item?.minimumBid ?? 0}
        bidAmount={pendingBid ?? 0}
        onConfirm={confirmPlaceBid}
      />
    </PageContainer>
  );
};

export default ItemDetailsPage;
