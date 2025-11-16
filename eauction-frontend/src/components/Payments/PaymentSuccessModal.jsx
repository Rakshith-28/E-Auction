import { useEffect, useMemo, useRef, useState } from 'react';
import { CheckCircle2, Download, LayoutDashboard, X } from 'lucide-react';

const formatAmount = (n) => `$${Number(n || 0).toFixed(2)}`;

const Confetti = () => {
  // Lightweight CSS-based confetti
  const pieces = Array.from({ length: 40 });
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {pieces.map((_, i) => (
        <span
          key={i}
          className="absolute h-2 w-1 rounded-sm"
          style={{
            left: `${(i * 73) % 100}%`,
            top: `-${Math.random() * 20 + 5}%`,
            background: `hsl(${(i * 47) % 360} 90% 60%)`,
            transform: `rotate(${(i * 17) % 360}deg)`,
            animation: `fall ${2.5 + (i % 10) * 0.1}s ease-in forwards`,
            animationDelay: `${(i % 10) * 0.05}s`,
          }}
        />
      ))}
      <style>{`@keyframes fall { to { transform: translateY(110vh) rotate(360deg); opacity: 0.9; } }`}</style>
    </div>
  );
};

const PaymentSuccessModal = ({ isOpen, onClose, data, item, onGoDashboard }) => {
  const [countdown, setCountdown] = useState(5);
  const downloadRef = useRef(null);

  const ts = useMemo(() => {
    const d = data?.timestamp ? new Date(data.timestamp) : new Date();
    return {
      dt: d,
      label: d.toLocaleString(),
      eta: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString(), // mock ETA +5 days
    };
  }, [data?.timestamp]);

  useEffect(() => {
    if (!isOpen) return;
    setCountdown(5);
    const id = setInterval(() => setCountdown((c) => (c > 0 ? c - 1 : 0)), 1000);
    const to = setTimeout(() => onClose?.(), 5000);
    return () => { clearInterval(id); clearTimeout(to); };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleReceipt = () => {
    // Minimal mock receipt download as a text blob
    const blob = new Blob([
      `eAuction Payment Receipt\n\nTransaction ID: ${data?.paymentId}\nAmount: ${formatAmount(data?.amount)}\nMethod: ${data?.paymentMethod}\nDate: ${ts.label}\n\nItem: ${item?.itemName || item?.title || 'Auction Item'}`
    ], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `receipt-${data?.paymentId || 'payment'}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-[140] flex items-center justify-center bg-black/60 p-4" onClick={onClose}>
      <div
        className="relative w-full max-w-2xl overflow-hidden rounded-3xl bg-white p-8 shadow-2xl animate-in zoom-in"
        onClick={(e) => e.stopPropagation()}
      >
        <Confetti />
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-extrabold bg-gradient-to-r from-green-600 to-primary-600 bg-clip-text text-transparent">Payment Successful!</h2>
          <button onClick={onClose} className="rounded p-1 text-slate-500 hover:bg-slate-100"><X className="h-5 w-5" /></button>
        </div>

        <div className="grid gap-6 md:grid-cols-[1fr_1.2fr]">
          <div className="flex flex-col items-center justify-center rounded-2xl bg-gradient-to-br from-green-50 to-primary-50 p-6">
            <div className="grid h-20 w-20 place-items-center rounded-full bg-green-100 text-green-600 shadow">
              <CheckCircle2 className="h-12 w-12" />
            </div>
            <div className="mt-4 grid place-items-center text-center">
              {item?.itemImage || item?.imageUrl ? (
                <img src={item.itemImage || item.imageUrl} alt={item?.itemName || item?.title} className="h-24 w-24 rounded-xl object-cover shadow" />
              ) : (
                <div className="h-24 w-24 rounded-xl bg-slate-200" />
              )}
              <p className="mt-2 text-sm font-semibold text-slate-900">{item?.itemName || item?.title || 'Auction Item'}</p>
              <p className="text-xs text-slate-500">Your item will be shipped soon!</p>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 p-6">
            <h3 className="text-sm font-semibold text-slate-700">Payment Details</h3>
            <dl className="mt-3 grid grid-cols-3 gap-y-2 text-sm">
              <dt className="text-slate-500">Transaction ID</dt>
              <dd className="col-span-2 font-mono text-slate-900">{data?.paymentId}</dd>

              <dt className="text-slate-500">Amount Paid</dt>
              <dd className="col-span-2 font-semibold text-green-600">{formatAmount(data?.amount)}</dd>

              <dt className="text-slate-500">Payment Method</dt>
              <dd className="col-span-2 text-slate-900 capitalize">{data?.paymentMethod || 'card'}</dd>

              <dt className="text-slate-500">Date & Time</dt>
              <dd className="col-span-2 text-slate-900">{ts.label}</dd>

              <dt className="text-slate-500">Estimated Delivery</dt>
              <dd className="col-span-2 text-slate-900">{ts.eta}</dd>
            </dl>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button onClick={handleReceipt} className="inline-flex items-center gap-2 rounded-full border-2 border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
                <Download className="h-4 w-4" /> View Receipt
              </button>
              <button onClick={onGoDashboard} className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary-600 to-secondary px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:shadow-xl">
                <LayoutDashboard className="h-4 w-4" /> Go to Dashboard
              </button>
              <span className="ml-auto text-xs text-slate-500">Closing in {countdown}s…</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessModal;
