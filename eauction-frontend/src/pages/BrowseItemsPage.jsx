import { useEffect, useMemo, useState } from 'react';
import PageContainer from '../components/Common/PageContainer.jsx';
import Loader from '../components/Common/Loader.jsx';
import ItemCard from '../components/Item/ItemCard.jsx';
import { getActiveItems } from '../services/itemService.js';

const CATEGORIES = ['All', 'Electronics', 'Fashion', 'Home', 'Sports'];
const SORTS = [
  { value: 'auctionEndTime,asc', label: 'Ending soon' },
  { value: 'auctionEndTime,desc', label: 'Ending latest' },
  { value: 'createdAt,desc', label: 'Newest' },
  { value: 'currentBid,asc', label: 'Price: Low to High' },
  { value: 'currentBid,desc', label: 'Price: High to Low' },
];

const BrowseItemsPage = () => {
  const [itemsPage, setItemsPage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [category, setCategory] = useState('All');
  const [sort, setSort] = useState(SORTS[0].value);
  const [page, setPage] = useState(0);
  const size = 12;

  const params = useMemo(() => {
    const p = { page, size, sort };
    // Category filtering would need backend support; for now, include as a hint param
    if (category && category !== 'All') p.category = category;
    return p;
  }, [category, sort, page]);

  const fetchItems = async () => {
    setLoading(true);
    const [data, fetchError] = await getActiveItems(params);
    if (fetchError) {
      setError(fetchError);
      setItemsPage(null);
    } else {
      setError(null);
      setItemsPage(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.page, params.size, params.sort, params.category]);

  const items = itemsPage?.content ?? [];
  const totalPages = itemsPage?.totalPages ?? 0;

  return (
    <PageContainer title="Browse Items" subtitle="Discover active auctions and place your bids.">
      <div className="grid gap-6 md:grid-cols-[280px_1fr]">
        <aside className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-900">Filters</h2>
          <div className="mt-4 space-y-4">
            <div>
              <label className="text-xs font-medium text-slate-600">Category</label>
              <select
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                value={category}
                onChange={(e) => { setCategory(e.target.value); setPage(0); }}
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-600">Sort</label>
              <select
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                value={sort}
                onChange={(e) => { setSort(e.target.value); setPage(0); }}
              >
                {SORTS.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>
            <button
              onClick={() => fetchItems()}
              className="w-full rounded-lg bg-primary-600 px-3 py-2 text-sm font-semibold text-white hover:bg-primary-700"
            >
              Apply Filters
            </button>
          </div>
        </aside>

        <div>
          {loading ? (
            <Loader label="Loading items" />
          ) : error ? (
            <p className="text-sm text-red-600">{error}</p>
          ) : items.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center text-slate-600">
              <p className="text-lg font-semibold text-slate-700">No auctions available right now</p>
            </div>
          ) : (
            <>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {items.map((it) => (
                  <ItemCard key={it.id} item={it} />
                ))}
              </div>

              {totalPages > 1 && (
                <div className="mt-6 flex items-center justify-center gap-2">
                  <button
                    className="rounded-lg border border-slate-200 px-3 py-1 text-sm disabled:opacity-50"
                    onClick={() => setPage((p) => Math.max(0, p - 1))}
                    disabled={page === 0}
                  >
                    Previous
                  </button>
                  <span className="text-sm text-slate-600">Page {page + 1} of {totalPages}</span>
                  <button
                    className="rounded-lg border border-slate-200 px-3 py-1 text-sm disabled:opacity-50"
                    onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                    disabled={page + 1 >= totalPages}
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </PageContainer>
  );
};

export default BrowseItemsPage;
