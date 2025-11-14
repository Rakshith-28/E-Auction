import { useEffect, useState } from 'react';
import PageContainer from '../components/Common/PageContainer.jsx';
import Loader from '../components/Common/Loader.jsx';
import { getBidsOnMyItems } from '../services/bidService.js';
import { formatDateTime } from '../utils/dateUtils.js';

const ReceivedBidsPage = () => {
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const [data, err] = await getBidsOnMyItems();
      if (err) setError(err); else setBids(data || []);
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <PageContainer title="Bids on my items">
        <Loader label="Loading bids" />
      </PageContainer>
    );
  }

  return (
    <PageContainer title="Bids on my items" subtitle="Track all bids placed on your listings.">
      {error && <p className="text-sm text-red-600">{error}</p>}
      {bids.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center text-slate-600">
          <p className="text-lg font-semibold text-slate-700">No bids yet on your items</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="hidden grid-cols-5 gap-4 border-b border-slate-200 bg-surface px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-600 md:grid">
            <div>Time</div>
            <div>Item</div>
            <div>Bidder</div>
            <div className="text-right">Amount</div>
            <div className="text-right">Status</div>
          </div>
          <ul>
            {bids.map((b) => (
              <li key={b.id} className="grid grid-cols-1 gap-2 border-t border-slate-100 px-4 py-3 text-sm md:grid-cols-5 md:items-center">
                <div className="text-slate-500">{formatDateTime(b.timestamp)}</div>
                <div className="font-medium text-slate-900">{b.item?.title ?? 'Item'}</div>
                <div className="text-slate-700">{b.bidderName ?? 'User'}</div>
                <div className="md:text-right">${b.amount?.toFixed?.(2) ?? b.amount}</div>
                <div className="md:text-right">{b.status ?? '-'}</div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </PageContainer>
  );
};

export default ReceivedBidsPage;
