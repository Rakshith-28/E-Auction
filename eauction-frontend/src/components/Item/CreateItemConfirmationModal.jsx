import { useEffect, useState } from 'react';
import { X, Loader2, CheckCircle2, Package } from 'lucide-react';
import Toast from '../Common/Toast';
import { formatInr } from '../../utils/currencyUtils.js';

const CreateItemConfirmationModal = ({
  isOpen,
  onClose,
  itemData,
  onConfirm,
}) => {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (!isOpen) {
      setLoading(false);
      setDone(false);
      setToast(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    try {
      setLoading(true);
      const res = await onConfirm?.();
      setLoading(false);
      if (res === false) return; // parent handled error
      setDone(true);
      setTimeout(() => {
        onClose?.();
      }, 700);
    } catch (err) {
      setLoading(false);
      setToast({ type: 'error', title: 'Listing Failed', message: String(err) });
    }
  };

  const previewImage = itemData?.previewImage || itemData?.images?.[0] || itemData?.imageUrl || null;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div
        className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl transition-all duration-200 animate-in zoom-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900">Confirm Listing</h2>
          <button onClick={onClose} className="rounded p-1 text-slate-500 hover:bg-slate-100">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Item Summary */}
        <div className="mb-5 rounded-xl border border-slate-200 bg-gradient-to-br from-white to-primary-50 p-4">
          <div className="flex gap-3">
            {previewImage ? (
              <img src={previewImage} alt={itemData?.title} className="h-20 w-28 rounded object-cover sm:h-24 sm:w-32" />
            ) : (
              <div className="grid h-20 w-28 place-items-center rounded bg-slate-200 sm:h-24 sm:w-32">
                <Package className="h-8 w-8 text-slate-400" />
              </div>
            )}
            <div className="flex-1">
              <p className="font-semibold text-slate-900 line-clamp-2">{itemData?.title || 'Your Item'}</p>
              <p className="mt-1 text-xs text-slate-600 line-clamp-2">{itemData?.description || 'No description'}</p>
              <div className="mt-2 grid gap-1 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Category</span>
                  <span className="font-semibold text-slate-900">{itemData?.category || 'N/A'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Min. Bid</span>
                  <span className="font-semibold text-green-600">₹{formatInr(itemData?.minimumBid || 0)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <p className="text-sm text-slate-700">Are you sure you want to publish this listing?</p>
        <p className="mt-2 rounded-lg border border-primary-200 bg-primary-50 p-2 text-xs font-medium text-primary-700">Your auction will be live and visible to buyers immediately.</p>

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
            {loading ? 'Publishing…' : 'Confirm Listing'}
          </button>
        </div>

        {done && (
          <div className="pointer-events-none mt-4 grid place-items-center">
            <div className="grid h-12 w-12 place-items-center rounded-full bg-green-100 text-green-600 animate-in zoom-in">
              <CheckCircle2 className="h-7 w-7" />
            </div>
          </div>
        )}

        {toast && <Toast type={toast.type} title={toast.title} message={toast.message} />}
      </div>
    </div>
  );
};

export default CreateItemConfirmationModal;
