import { useEffect, useMemo, useState } from 'react';
import { X, Loader2, CreditCard, CheckCircle2 } from 'lucide-react';
import { confirmPayment } from '../../services/paymentService';
import Toast from '../Common/Toast';
import PaymentSuccessModal from './PaymentSuccessModal';
import { formatInr } from '../../utils/currencyUtils.js';

// Note: This is a mock payment UI for demonstration only. No real processing.
const PaymentModal = ({ isOpen, onClose, auction, user, onSuccess }) => {
  const [cardNumber, setCardNumber] = useState('');
  const [cardholder, setCardholder] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [done, setDone] = useState(false);
  const [successData, setSuccessData] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);

  // ✅ MOVE ALL HOOKS TO THE TOP - BEFORE ANY RETURNS
  // Backend amount is already in INR
  const bidAmountInr = Number(auction?.winningBid || 0);
  const feeInr = useMemo(() => bidAmountInr * 0.02, [bidAmountInr]);
  const totalInr = useMemo(() => bidAmountInr + feeInr, [bidAmountInr, feeInr]);

  const cardType = useMemo(() => {
    const first = cardNumber.replace(/\s+/g, '')[0];
    if (first === '4') return 'visa';
    if (first === '5') return 'mastercard';
    return 'card';
  }, [cardNumber]);

  useEffect(() => {
    if (!isOpen) {
      setCardNumber('');
      setCardholder('');
      setExpiry('');
      setCvv('');
      setLoading(false);
      setDone(false);
    }
  }, [isOpen]);

  // ✅ NOW IT'S SAFE TO DO EARLY RETURN AFTER ALL HOOKS
  if (!isOpen) return null;

  const formatCardNumber = (value) => {
    return value.replace(/\D/g, '').slice(0, 16).replace(/(\d{4})(?=\d)/g, '$1 ').trim();
  };

  const onCardNumberChange = (e) => setCardNumber(formatCardNumber(e.target.value));
  const onExpiryChange = (e) => {
    const v = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (v.length <= 2) setExpiry(v);
    else setExpiry(`${v.slice(0,2)}/${v.slice(2)}`);
  };
  const onCvvChange = (e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 3));

  const validate = () => {
    const num = cardNumber.replace(/\s+/g, '');
    if (num.length !== 16) return 'Card number must be 16 digits';
    if (!cardholder.trim()) return 'Cardholder name is required';
    if (!/^\d{2}\/\d{2}$/.test(expiry)) return 'Expiry must be MM/YY';
    const [mm, yy] = expiry.split('/').map(Number);
    if (mm < 1 || mm > 12) return 'Invalid expiry month';
    if (cvv.length !== 3) return 'CVV must be 3 digits';
    return null;
  };

  const handleConfirm = async () => {
    const error = validate();
    if (error) {
      setToast({ type: 'error', title: 'Invalid Details', message: error });
      return;
    }
    // Resolve identifiers with fallbacks (_id for Mongo style, localStorage backup)
    const resolvedAuctionId = auction?.auctionId || auction?.id || auction?._id || null;
    const resolvedItemId = auction?.itemId || auction?.item?.id || auction?.item?._id || null;
    const resolvedUserId = user?.id || user?._id || (() => {
      try {
        const raw = localStorage.getItem('user');
        if (raw) {
          const parsed = JSON.parse(raw);
          return parsed?.id || parsed?._id;
        }
        return localStorage.getItem('userId');
      } catch (e) {
        return null;
      }
    })();

    if (!resolvedUserId) {
      setToast({ type: 'error', title: 'Missing User', message: 'Cannot resolve user ID for payment.' });
      console.error('[PaymentModal] Missing userId. user object:', user);
      return;
    }
    if (!resolvedAuctionId && !resolvedItemId) {
      setToast({ type: 'error', title: 'Missing Auction', message: 'Cannot resolve auction or item ID.' });
      console.error('[PaymentModal] Missing auctionId/itemId. auction context:', auction);
      return;
    }

    setLoading(true);
    await new Promise(r => setTimeout(r, 1200)); // simulate
    const payload = {
      auctionId: resolvedAuctionId,
      itemId: resolvedItemId,
      userId: resolvedUserId,
      amount: totalInr, // include fee in INR
      paymentMethod: 'mock_card'
    };
    console.log('[PaymentModal] Sending payment payload:', payload);
    const [data, apiError] = await confirmPayment(payload);
    setLoading(false);
    if (apiError) {
      setToast({ type: 'error', title: 'Payment Failed', message: apiError });
      console.error('[PaymentModal] Payment API error:', apiError);
      return;
    }
    setDone(true);
    setSuccessData(data);
    setShowSuccess(true);
    setToast({ type: 'success', title: 'Payment Successful', message: 'Item will be shipped soon.' });
    try { localStorage.setItem('dashboardRefresh', String(Date.now())); } catch {}
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div
        className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl transition-all duration-200 animate-in zoom-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900">Complete Payment</h2>
          <button onClick={onClose} className="rounded p-1 text-slate-500 hover:bg-slate-100"><X className="h-5 w-5" /></button>
        </div>

        {/* Order Summary */}
        <div className="mb-5 rounded-xl border border-slate-200 bg-gradient-to-br from-white to-primary-50 p-4">
          <div className="flex gap-3">
            {auction?.itemImage ? (
              <img src={auction.itemImage} alt={auction?.itemName} className="h-16 w-16 rounded object-cover" />
            ) : (
              <div className="h-16 w-16 rounded bg-slate-200" />
            )}
            <div className="flex-1">
              <p className="font-semibold text-slate-900">{auction?.itemName || 'Auction Item'}</p>
              <p className="text-sm text-slate-600">Winning Bid: ₹{formatInr(bidAmountUsd)}</p>
              <p className="text-sm text-slate-600">Processing Fee (2%): ₹{feeInr.toFixed(2)}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-500">Total</p>
              <p className="text-lg font-semibold text-slate-900">₹{totalInr.toFixed(2)}</p>
            </div>
          </div>
        </div>

        {/* Payment Form */}
        <div className="space-y-3">
          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">Card Number</label>
            <div className="relative">
              <input
                value={cardNumber}
                onChange={onCardNumberChange}
                placeholder="1234 5678 9012 3456"
                className="h-12 w-full rounded-lg border border-slate-200 px-4 pr-12 text-sm focus:border-primary-500 focus:outline-none focus:ring-4 focus:ring-primary-100"
              />
              <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                {cardType === 'visa' && <span className="text-xs font-semibold">VISA</span>}
                {cardType === 'mastercard' && <span className="text-xs font-semibold">MC</span>}
                {cardType === 'card' && <CreditCard className="h-5 w-5" />}
              </div>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-semibold text-slate-700">Cardholder Name</label>
              <input
                value={cardholder}
                onChange={(e) => setCardholder(e.target.value)}
                placeholder="John Doe"
                className="h-12 w-full rounded-lg border border-slate-200 px-4 text-sm focus:border-primary-500 focus:outline-none focus:ring-4 focus:ring-primary-100"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold text-slate-700">Expiry (MM/YY)</label>
              <input
                value={expiry}
                onChange={onExpiryChange}
                placeholder="MM/YY"
                className="h-12 w-full rounded-lg border border-slate-200 px-4 text-sm focus:border-primary-500 focus:outline-none focus:ring-4 focus:ring-primary-100"
              />
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-semibold text-slate-700">CVV</label>
              <input
                value={cvv}
                onChange={onCvvChange}
                placeholder="•••"
                type="password"
                className="h-12 w-full rounded-lg border border-slate-200 px-4 text-sm focus:border-primary-500 focus:outline-none focus:ring-4 focus:ring-primary-100"
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 rounded-full border-2 border-slate-200 bg-white px-6 py-3 font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={loading}
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-primary-600 to-secondary px-6 py-3 font-semibold text-white shadow-lg transition hover:shadow-xl disabled:opacity-60"
          >
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <CheckCircle2 className="h-5 w-5" />}
            {loading ? 'Processing...' : 'Confirm Payment'}
          </button>
        </div>

        {done && (
          <div className="pointer-events-none mt-4 grid place-items-center">
            <div className="h-12 w-12 rounded-full bg-green-100 text-green-600 grid place-items-center animate-in zoom-in">
              <CheckCircle2 className="h-7 w-7" />
            </div>
          </div>
        )}

        {toast && <Toast type={toast.type} title={toast.title} message={toast.message} />}
      </div>

      {showSuccess && (
        <PaymentSuccessModal
          isOpen={showSuccess}
          onClose={() => { setShowSuccess(false); onClose?.(); onSuccess?.(successData); }}
          data={successData}
          item={{ itemImage: auction?.itemImage, itemName: auction?.itemName }}
          onGoDashboard={() => { setShowSuccess(false); onClose?.(); window.location.href = '/dashboard'; }}
        />
      )}
    </div>
  );
};

export default PaymentModal;