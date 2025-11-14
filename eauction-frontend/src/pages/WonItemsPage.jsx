import { useEffect, useState } from 'react';
import PageContainer from '../components/Common/PageContainer.jsx';
import Loader from '../components/Common/Loader.jsx';
import { getMyBids } from '../services/bidService.js';
import { formatDateTime } from '../utils/dateUtils.js';

const WonItemsPage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const [data, err] = await getMyBids();
      if (err) {
        setError(err);
      } else if (data) {
        setItems(data.filter((b) => b.status === 'WON'));
      }
      setLoading(false);
    };
    fetchData();
  }, []);

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
          {items.map((b) => (
            <article key={b.id} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">{b.item?.title ?? 'Item'}</h2>
                <p className="mt-1 text-sm text-slate-600">Winning bid: ${b.amount?.toFixed?.(2) ?? b.amount}</p>
                <p className="text-xs text-slate-500">Date won: {formatDateTime(b.timestamp)}</p>
              </div>
              <div className="text-right">
                <p className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-amber-700">Won</p>
              </div>
            </article>
          ))}
        </div>
      )}
    </PageContainer>
  );
};

export default WonItemsPage;
