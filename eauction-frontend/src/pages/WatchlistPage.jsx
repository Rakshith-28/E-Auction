import { useEffect, useState } from 'react';
import ItemCard from '../components/Item/ItemCard.jsx';
import { getWatchlist } from '../services/watchlistService.js';

const WatchlistPage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    (async () => {
      const [data, err] = await getWatchlist();
      if (!active) return;
      if (err) setError(err.message || 'Failed to load watchlist');
      else if (data) setItems(data);
      setLoading(false);
    })();
    return () => { active = false; };
  }, []);

  if (loading) {
    return <div className="mx-auto max-w-6xl px-4 py-10"><p className="text-sm text-slate-500">Loading watchlist...</p></div>;
  }

  if (error) {
    return <div className="mx-auto max-w-6xl px-4 py-10"><p className="text-sm text-red-600">{error}</p></div>;
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-2xl font-bold text-slate-900">My Watchlist</h1>
      {items.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-slate-200 p-10 text-center">
          <p className="text-sm text-slate-600">No items in watchlist.</p>
          <p className="mt-2 text-xs text-slate-500">Browse items and click the heart to add them here.</p>
        </div>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
};

export default WatchlistPage;
