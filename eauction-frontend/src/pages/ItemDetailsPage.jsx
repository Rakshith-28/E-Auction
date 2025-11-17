import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import PageContainer from '../components/Common/PageContainer.jsx';
import Loader from '../components/Common/Loader.jsx';
import CountdownTimer from '../components/Common/CountdownTimer.jsx';
import Toast from '../components/Common/Toast.jsx';
import { getItem } from '../services/itemService.js';
import { getBidsForItem, placeBid } from '../services/bidService.js';
import { getUserById } from '../services/userService.js';
import { formatDateTime } from '../utils/dateUtils.js';
import { formatInr } from '../utils/currencyUtils.js';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../context/CartContext.jsx';
import { checkInCart as apiCheckInCart } from '../services/cartService.js';
import BidConfirmationModal from '../components/Auction/BidConfirmationModal.jsx';
import SellerContactCard from '../components/Item/SellerContactCard.jsx';

const ItemDetailsPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [item, setItem] = useState(null);
  const [seller, setSeller] = useState(null);
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
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const fetchAll = async () => {
    const [[itemData, itemErr], [bidsData, bidsErr]] = await Promise.all([
      getItem(id),
      getBidsForItem(id),
    ]);
    if (itemErr) setError(itemErr);
    else {
      setItem(itemData);
      // Fetch seller information if sellerId exists
      if (itemData?.sellerId) {
        const [sellerData] = await getUserById(itemData.sellerId);
        if (sellerData) setSeller(sellerData);
      }
    }
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

  // Keyboard navigation for image carousel
  useEffect(() => {
    if (!item?.images || item.images.length <= 1) return;
    
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        setCurrentImageIndex((prev) => (prev === 0 ? item.images.length - 1 : prev - 1));
      } else if (e.key === 'ArrowRight') {
        setCurrentImageIndex((prev) => (prev === item.images.length - 1 ? 0 : prev + 1));
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [item?.images]);

  const minimumBid = useMemo(() => {
    if (!item) return 0;
    const current = item.currentBid ?? 0;
    const minimum = item.minimumBid ?? 0;
    return Math.max(current, minimum);
  }, [item]);

  const minimumBidInr = minimumBid;  // Already in INR, no conversion needed

  const handleBid = async (e) => {
    e.preventDefault();
    if (!item) return;
    const amountInr = Number.parseFloat(bidAmount);
    if (Number.isNaN(amountInr) || amountInr <= minimumBidInr) {
      setToast({ type: 'error', title: 'Invalid bid', message: `Bid must be greater than ₹${minimumBidInr.toFixed(2)}` });
      return;
    }
    if (user && item.sellerId === user.id) {
      setToast({ type: 'error', title: 'Not allowed', message: 'You cannot bid on your own item.' });
      return;
    }
    setPendingBid(amountInr);
    setConfirmOpen(true);
  };

  const confirmPlaceBid = async () => {
    if (!item || !pendingBid) return false;
    setPlacing(true);
    // Submit INR value directly, no conversion needed
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
              {(() => {
                const images = item.images && item.images.length > 0 ? item.images : [item.imageUrl].filter(Boolean);
                const currentImage = images[currentImageIndex] || null;
                
                const normalizeUrl = (raw) => {
                  if (!raw) return 'https://placehold.co/800x600/e2e8f0/64748b?text=No+Image';
                  if (raw.startsWith('http')) return raw;
                  const uploadsIdx = raw.indexOf('/uploads/');
                  const path = uploadsIdx >= 0
                    ? raw.substring(uploadsIdx)
                    : (raw.startsWith('/uploads') ? raw : `/uploads/${raw}`);
                  return `http://localhost:8080${path}`;
                };

                const handlePrevImage = (e) => {
                  e.stopPropagation();
                  setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
                };

                const handleNextImage = (e) => {
                  e.stopPropagation();
                  setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
                };

                return (
                  <>
                    <img
                      src={normalizeUrl(currentImage)}
                      alt={`${item.title} - Image ${currentImageIndex + 1}`}
                      className="h-full w-full object-cover"
                      onError={(e) => { e.target.src = 'https://placehold.co/800x600/e2e8f0/64748b?text=No+Image'; }}
                    />
                    
                    {/* Navigation Arrows */}
                    {images.length > 1 && (
                      <>
                        <button
                          type="button"
                          onClick={handlePrevImage}
                          className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white backdrop-blur transition hover:bg-black/70"
                          aria-label="Previous image"
                        >
                          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                          </svg>
                        </button>
                        <button
                          type="button"
                          onClick={handleNextImage}
                          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white backdrop-blur transition hover:bg-black/70"
                          aria-label="Next image"
                        >
                          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                        
                        {/* Image Counter */}
                        <div className="absolute top-3 right-3 rounded-full bg-black/60 px-3 py-1 text-sm font-medium text-white backdrop-blur">
                          {currentImageIndex + 1} / {images.length}
                        </div>
                        
                        {/* Dot Indicators */}
                        <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
                          {images.map((_, index) => (
                            <button
                              key={index}
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setCurrentImageIndex(index);
                              }}
                              className={`h-2 w-2 rounded-full transition-all ${
                                index === currentImageIndex
                                  ? 'w-6 bg-white'
                                  : 'bg-white/50 hover:bg-white/75'
                              }`}
                              aria-label={`Go to image ${index + 1}`}
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </>
                );
              })()}
            </div>
            
            {/* Thumbnail Navigation */}
            {(() => {
              const images = item.images && item.images.length > 0 ? item.images : [item.imageUrl].filter(Boolean);
              const normalizeUrl = (raw) => {
                if (!raw) return 'https://placehold.co/800x600/e2e8f0/64748b?text=No+Image';
                if (raw.startsWith('http')) return raw;
                const uploadsIdx = raw.indexOf('/uploads/');
                const path = uploadsIdx >= 0
                  ? raw.substring(uploadsIdx)
                  : (raw.startsWith('/uploads') ? raw : `/uploads/${raw}`);
                return `http://localhost:8080${path}`;
              };
              
              if (images.length <= 1) return null;
              
              return (
                <div className="border-t border-slate-100 px-4 py-3">
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    {images.map((img, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => setCurrentImageIndex(index)}
                        className={`h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 transition-all ${
                          index === currentImageIndex
                            ? 'border-primary-500 ring-2 ring-primary-200'
                            : 'border-slate-200 hover:border-primary-300'
                        }`}
                      >
                        <img
                          src={normalizeUrl(img)}
                          alt={`Thumbnail ${index + 1}`}
                          className="h-full w-full object-cover"
                          onError={(e) => { e.target.src = 'https://placehold.co/100x100/e2e8f0/64748b?text=' + (index + 1); }}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              );
            })()}
            
            <div className="grid gap-4 p-6 text-sm text-slate-600 md:grid-cols-2">
              <div>
                <div className="text-xs font-medium text-slate-500">Category</div>
                <div className="mt-1 capitalize text-slate-900">{item.category ?? 'N/A'}</div>
              </div>
              <div>
                <div className="text-xs font-medium text-slate-500">Minimum bid</div>
                <div className="mt-1 text-slate-900">₹{formatInr(item.minimumBid ?? 0)}</div>
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
                    <span className="font-medium text-slate-900">₹{formatInr(b.amount)}</span>
                    <span className="text-slate-500">{formatDateTime(b.timestamp)}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Seller Contact Information */}
          <SellerContactCard seller={seller} item={item} />
        </div>

        <aside className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Auction</h2>
          <div className="mt-2 text-sm text-slate-600">Current highest bid</div>
          <div className="mt-1 text-3xl font-bold text-slate-900">₹{formatInr(item.currentBid ?? item.minimumBid ?? 0)}</div>
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
              <label className="text-sm font-medium text-slate-700">Your bid (in ₹)</label>
              <input
                type="number"
                min={minimumBidInr + 1}
                step="1"
                value={bidAmount}
                onChange={(e) => setBidAmount(e.target.value)}
                disabled={isEnded}
                className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-2 text-sm"
                placeholder={`Minimum: ₹${minimumBidInr.toFixed(2)}`}
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
