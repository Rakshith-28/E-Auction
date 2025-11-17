import { useEffect, useMemo, useRef, useState } from 'react';
import PageContainer from '../components/Common/PageContainer.jsx';
import Loader from '../components/Common/Loader.jsx';
import { getMyBids } from '../services/bidService.js';
import { formatDateTime } from '../utils/dateUtils.js';
import { formatInr } from '../utils/currencyUtils.js';
import Toast from '../components/Common/Toast.jsx';

const MyBidsPage = () => {
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tab, setTab] = useState('ALL');
  const prevStatusesRef = useRef(new Map());
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const fetchBids = async () => {
      const [data, fetchError] = await getMyBids();
      if (fetchError) {
        setError(fetchError);
      } else if (data) {
        data.forEach((b) => {
          const prev = prevStatusesRef.current.get(b.id);
          if (prev && prev !== 'OUTBID' && b.status === 'OUTBID') {
            setToast({ type: 'error', title: 'You were outbid', message: b.item?.title || 'A bid was outbid.' });
          }
          prevStatusesRef.current.set(b.id, b.status);
        });
        setBids(data);
      }
      setLoading(false);
    };

    fetchBids();
    const id = setInterval(() => {
      if (document.visibilityState === 'visible') fetchBids();
    }, 10000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const t = toast ? setTimeout(() => setToast(null), 4000) : null;
    return () => t && clearTimeout(t);
  }, [toast]);

  const filtered = useMemo(() => {
    switch (tab) {
      case 'WINNING':
        return bids.filter((b) => b.status === 'ACTIVE');
      case 'OUTBID':
        return bids.filter((b) => b.status === 'OUTBID');
      case 'WON':
        return bids.filter((b) => b.status === 'WON');
      case 'LOST':
        return bids.filter((b) => b.status === 'LOST');
      default:
        return bids;
    }
  }, [bids, tab]);

  if (loading) {
    return (
      <PageContainer title="My bids">
        <Loader label="Loading bids" />
      </PageContainer>
    );
  }

  return (
    <PageContainer title="My bids" subtitle="Track the auctions where you are participating.">
      <div className="mb-4 flex flex-wrap gap-2">
        {['ALL','WINNING','OUTBID','WON','LOST'].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`rounded-full px-3 py-1 text-xs font-semibold ${tab===t? 'bg-primary-600 text-white' : 'bg-slate-100 text-slate-700'}`}
          >{t}</button>
        ))}
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center text-slate-600">
          <p className="text-lg font-semibold text-slate-700">You haven't placed any bids yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((bid) => {
            const totalBids = bid.item?.totalBids ?? 0;
            const currentBid = bid.item?.currentBid ?? bid.item?.minimumBid ?? 0;
            return (
              <article key={bid.id} className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:flex-row md:items-center">
                <div className="flex-1">
                  <h2 className="text-lg font-semibold text-slate-900">{bid.item?.title ?? 'Auction'}</h2>
                  <div className="mt-2 flex flex-wrap gap-4 text-sm text-slate-600">
                    <p>
                      Your bid: <span className="font-semibold text-slate-900">₹{formatInr(bid.amount)}</span>
                    </p>
                    <p>
                      Current bid: <span className="font-semibold text-slate-900">₹{formatInr(currentBid)}</span>
                    </p>
                    <p>
                      Total bids: <span className="font-semibold text-slate-900">{totalBids}</span>
                    </p>
                  </div>
                  <p className="mt-1 text-xs text-slate-500">Placed on {formatDateTime(bid.timestamp)}</p>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${
                  bid.status === 'ACTIVE' ? 'bg-green-100 text-green-700' :
                  bid.status === 'OUTBID' ? 'bg-rose-100 text-rose-700' :
                  bid.status === 'WON' ? 'bg-amber-100 text-amber-700' :
                  bid.status === 'LOST' ? 'bg-slate-200 text-slate-700' : 'bg-slate-100 text-slate-600'
                }`}>
                  {bid.status ?? 'PENDING'}
                </span>
              </article>
            );
          })}
        </div>
      )}

      {toast && <Toast type={toast.type} title={toast.title} message={toast.message} />}
    </PageContainer>
  );
};

export default MyBidsPage;
