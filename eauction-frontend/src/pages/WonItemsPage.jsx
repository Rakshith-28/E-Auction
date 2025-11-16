import { useEffect, useMemo, useState } from 'react';
import PageContainer from '../components/Common/PageContainer.jsx';
import Loader from '../components/Common/Loader.jsx';
import { getMyBids } from '../services/bidService.js';
import { useAuth } from '../hooks/useAuth.js';
import PaymentModal from '../components/Payments/PaymentModal.jsx';
import { paymentExists } from '../services/paymentService.js';
import { formatDateTime } from '../utils/dateUtils.js';

const WonItemsPage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const [paidMap, setPaidMap] = useState({});
  const [open, setOpen] = useState(false);
  const [payContext, setPayContext] = useState(null);
  const [refreshIndex, setRefreshIndex] = useState(0);

  useEffect(() => {
    let mounted = true;
    const fetchData = async () => {
      setLoading(true);
      const [data, err] = await getMyBids();
      if (!mounted) return;
      if (err) {
        setError(err);
      } else if (data) {
        const won = data.filter((b) => b.status === 'WON');
        setItems(won);
        // Check payment status per won item (by itemId)
        if (user?.id && won.length) {
          const checks = await Promise.all(
            won.map((b) => paymentExists({ itemId: b.item?.id || b.itemId, userId: user.id }))
          );
          const map = {};
          won.forEach((b, idx) => {
            const [res] = checks[idx] || [];
            map[b.item?.id || b.itemId] = !!res?.paid;
          });
          setPaidMap(map);
        } else {
          setPaidMap({});
        }
      }
      setLoading(false);
    };
    fetchData();
    return () => { mounted = false; };
  }, [user?.id, refreshIndex]);

  const paidCount = useMemo(() => items.filter((b) => paidMap[b.item?.id || b.itemId]).length, [items, paidMap]);
  const unpaidCount = useMemo(() => Math.max(0, items.length - paidCount), [items.length, paidCount]);

  if (loading) {
    return (
      <PageContainer title="Won items">
        <Loader label="Loading won items" />
      </PageContainer>
    );
  }

  return (
    <PageContainer title="Won items" subtitle="Auctions you have won.">
      {error && <p className="text-sm text-red-600">{error}</p>}
      {items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center text-slate-600">
          <p className="text-lg font-semibold text-slate-700">You haven't won any auctions yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Summary badges */}
          <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-slate-200 bg-white/90 p-4">
            <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-green-700">Paid: {paidCount}</span>
            <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-amber-700">Unpaid: {unpaidCount}</span>
            <span className="ml-auto text-xs text-slate-500">Total: {items.length}</span>
          </div>

          {items.map((b) => (
            <article key={b.id} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">{b.item?.title ?? 'Item'}</h2>
                <p className="mt-1 text-sm text-slate-600">Winning bid: ${b.amount?.toFixed?.(2) ?? b.amount}</p>
                <p className="text-xs text-slate-500">Date won: {formatDateTime(b.timestamp)}</p>
              </div>
              <div className="text-right">
                {paidMap[b.item?.id || b.itemId] ? (
                  <p className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-green-700">Paid</p>
                ) : (
                  <div className="flex items-center gap-2">
                    <p className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-amber-700">Won</p>
                    <button
                      onClick={() => {
                        // Attempt to capture auction identifiers from bid object with multiple fallbacks
                        // Only use known auction identifiers; avoid using bid id
                        const auctionId = b.auctionId || b.auction?.id || b.auction?._id || null;
                        const itemId = b.item?.id || b.item?._id || b.itemId || null;
                        setPayContext({
                          id: auctionId, // used by modal as auction.id fallback
                          auctionId,
                          itemId,
                          winningBid: Number(b.amount),
                          itemName: b.item?.title,
                          itemImage: b.item?.imageUrl,
                        });
                        setOpen(true);
                      }}
                      className="ml-2 rounded-full bg-gradient-to-r from-primary-600 to-secondary px-4 py-2 text-xs font-semibold text-white shadow-lg hover:shadow-xl"
                    >
                      Complete Payment
                    </button>
                  </div>
                )}
              </div>
            </article>
          ))}
          <PaymentModal
            isOpen={open}
            onClose={() => setOpen(false)}
            auction={payContext}
            user={user}
            onSuccess={() => {
              setOpen(false);
              setRefreshIndex((i) => i + 1);
            }}
          />
        </div>
      )}
    </PageContainer>
  );
};

export default WonItemsPage;
