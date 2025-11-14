import { useEffect, useMemo, useState } from 'react';
import PageContainer from '../components/Common/PageContainer.jsx';
import Loader from '../components/Common/Loader.jsx';
import { getMyBids } from '../services/bidService.js';
import { formatDateTime } from '../utils/dateUtils.js';

const BidHistoryPage = () => {
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState('ALL');

  useEffect(() => {
    const fetchData = async () => {
      const [data, err] = await getMyBids();
      if (err) setError(err); else setBids(data || []);
      setLoading(false);
    };
    fetchData();
  }, []);

  const filtered = useMemo(() => {
    if (status === 'ALL') return bids;
    return bids.filter((b) => b.status === status);
  }, [bids, status]);

  if (loading) {
    return (
      <PageContainer title="Bid history">
        <Loader label="Loading bid history" />
      </PageContainer>
    );
  }

  return (
    <PageContainer title="Bid history" subtitle="Your complete bidding history.">
      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="mb-3 flex flex-wrap items-center gap-2">
        <label className="text-xs font-medium text-slate-600">Status</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="rounded-lg border border-slate-200 px-2 py-1 text-sm"
        >
          {['ALL','ACTIVE','OUTBID','WON','LOST'].map((s) => <option key={s}>{s}</option>)}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center text-slate-600">
          <p className="text-lg font-semibold text-slate-700">No bids match the selected filters</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="hidden grid-cols-5 gap-4 border-b border-slate-200 bg-surface px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-600 md:grid">
            <div>Date</div>
            <div>Item</div>
            <div className="text-right">Your bid</div>
            <div className="text-right">Result</div>
            <div className="text-right">Final price</div>
          </div>
          <ul>
            {filtered.map((b) => (
              <li key={b.id} className="grid grid-cols-1 gap-2 border-t border-slate-100 px-4 py-3 text-sm md:grid-cols-5 md:items-center">
                <div className="text-slate-500">{formatDateTime(b.timestamp)}</div>
                <div className="font-medium text-slate-900">{b.item?.title ?? 'Item'}</div>
                <div className="md:text-right">${b.amount?.toFixed?.(2) ?? b.amount}</div>
                <div className="md:text-right">{b.status ?? '-'}</div>
                <div className="md:text-right">{b.status === 'WON' ? (`$${b.amount?.toFixed?.(2) ?? b.amount}`) : '-'}</div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </PageContainer>
  );
};

export default BidHistoryPage;
