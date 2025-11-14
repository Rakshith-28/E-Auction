import { useEffect, useState } from 'react';
import PageContainer from '../components/Common/PageContainer.jsx';
import Loader from '../components/Common/Loader.jsx';
import { getItemsByStatus } from '../services/itemService.js';

const SoldItemsPage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      const [page, err] = await getItemsByStatus('SOLD', { page: 0, size: 50 });
      if (err) setError(err); else setItems(page?.content || []);
      setLoading(false);
    };
    load();
  }, []);

  if (loading) {
    return (
      <PageContainer title="Sold items">
        <Loader label="Loading sold items" />
      </PageContainer>
    );
  }

  return (
    <PageContainer title="Sold items" subtitle="Auctions that ended with a winner.">
      {error && <p className="text-sm text-red-600">{error}</p>}
      {items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center text-slate-600">
          <p className="text-lg font-semibold text-slate-700">No sold items yet</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((i) => (
            <article key={i.id} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900">{i.title}</h3>
              <p className="mt-1 text-sm text-slate-600">Final price: ${i.currentBid?.toFixed?.(2) ?? i.currentBid}</p>
              <p className="mt-1 text-xs text-slate-500">Bids received: {i.totalBids ?? 0}</p>
              <p className="mt-2 inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-700">Sold</p>
            </article>
          ))}
        </div>
      )}
    </PageContainer>
  );
};

export default SoldItemsPage;
