import { useEffect, useMemo, useState } from 'react';
import PageContainer from '../components/Common/PageContainer.jsx';
import Loader from '../components/Common/Loader.jsx';
import ItemCard from '../components/Item/ItemCard.jsx';
import SkeletonCard from '../components/Common/SkeletonCard.jsx';
import EmptyState from '../components/Common/EmptyState.jsx';
import { getActiveItems } from '../services/itemService.js';
import { Filter, ChevronDown, X, SlidersHorizontal, Clock, Tag, AlertCircle, RefreshCw } from 'lucide-react';

// Primary filter options
const CATEGORIES = ['All', 'Electronics', 'Fashion', 'Home', 'Sports'];
const SORTS = [
  { value: 'auctionEndTime,asc', label: 'Ending soon' },
  { value: 'auctionEndTime,desc', label: 'Ending latest' },
  { value: 'createdAt,desc', label: 'Newest' },
  { value: 'currentBid,asc', label: 'Price: Low to High' },
  { value: 'currentBid,desc', label: 'Price: High to Low' },
];

// Advanced filters (frontend only demonstration)
const STATUS_OPTIONS = ['Any', 'With Bids', 'No Bids'];
const TIME_BUCKETS = ['Any', '<1h', '<6h', '<24h', '>24h'];

const BrowseItemsPage = () => {
  // Data state
  const [itemsPage, setItemsPage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Filters
  const [category, setCategory] = useState('All');
  const [sort, setSort] = useState(SORTS[0].value);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(5000);
  const [showPrice, setShowPrice] = useState(false);
  const [statusFilter, setStatusFilter] = useState('Any');
  const [timeFilter, setTimeFilter] = useState('Any');
  const [advancedOpen, setAdvancedOpen] = useState(false);

  // Mobile bottom sheet
  const [mobileSheetOpen, setMobileSheetOpen] = useState(false);

  // Pagination
  const [page, setPage] = useState(0);
  const size = 12;

  // Params for backend fetch (only those supported today)
  const params = useMemo(() => {
    const p = { page, size, sort };
    if (category && category !== 'All') p.category = category;
    return p;
  }, [category, sort, page]);

  const itemsRaw = (itemsPage?.content ?? itemsPage) || [];
  const totalPages = itemsPage?.totalPages ?? 1;

  // Frontend filtering (advanced + price)
  const items = itemsRaw.filter((it) => {
    // Price filter
    const price = it.currentBid ?? it.price ?? 0;
    if (price < minPrice || price > maxPrice) return false;

    // Status filter (heuristic using totalBids or currentBid)
    if (statusFilter === 'With Bids' && (it.totalBids ?? it.currentBid ?? 0) <= 0) return false;
    if (statusFilter === 'No Bids' && (it.totalBids ?? it.currentBid ?? 0) > 0) return false;

    // Time remaining (requires auctionEndTime)
    if (timeFilter !== 'Any' && it.auctionEndTime) {
      const end = new Date(it.auctionEndTime).getTime();
      const now = Date.now();
      const diffHrs = (end - now) / (1000 * 60 * 60);
      switch (timeFilter) {
        case '<1h': if (diffHrs >= 1) return false; break;
        case '<6h': if (diffHrs >= 6) return false; break;
        case '<24h': if (diffHrs >= 24) return false; break;
        case '>24h': if (diffHrs <= 24) return false; break;
        default: break;
      }
    }
    return true;
  });

  const fetchItems = async () => {
    setLoading(true);
    setError(null);
    const [data, err] = await getActiveItems(params);
    if (err) setError(err); else setItemsPage(data);
    setLoading(false);
  };

  // Auto-fetch on supported filter changes
  useEffect(() => {
    fetchItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  // Reset all filters
  const clearAll = () => {
    setCategory('All');
    setSort(SORTS[0].value);
    setMinPrice(0);
    setMaxPrice(5000);
    setStatusFilter('Any');
    setTimeFilter('Any');
    setShowPrice(false);
    setAdvancedOpen(false);
    setPage(0);
  };

  const FilterPill = ({ active, children, onClick }) => (
    <button
      type="button"
      onClick={onClick}
      className={`group relative flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition ${active
        ? 'border-indigo-600 bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-sm'
        : 'border-slate-300 bg-white text-slate-600 hover:border-indigo-400 hover:text-indigo-700'} `}
    >
      {children}
    </button>
  );

  return (
    <PageContainer title="Browse Items" subtitle="Discover active auctions and place your bids.">
      {/* Mobile trigger */}
      <div className="mb-4 flex items-center justify-between md:hidden">
        <button
          onClick={() => setMobileSheetOpen(true)}
          className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm backdrop-blur hover:bg-white"
        >
          <Filter className="h-4 w-4 text-indigo-600" /> Filters
        </button>
        {(category !== 'All' || sort !== SORTS[0].value) && (
          <button onClick={clearAll} className="text-xs font-medium text-indigo-600 hover:underline">Reset</button>
        )}
      </div>

      {/* Desktop / tablet horizontal bar */}
      <div className="hidden flex-col gap-3 md:flex">
        <div className="rounded-2xl border border-white/40 bg-white/80 px-4 py-3 shadow-sm backdrop-blur-lg">
          <div className="flex flex-wrap items-center gap-3">
            {/* Category */}
            <div className="relative">
              <FilterPill active={category !== 'All'}>
                <Tag className="h-4 w-4" />
                <select
                  value={category}
                  onChange={(e) => { setCategory(e.target.value); setPage(0); }}
                  className="bg-transparent pr-6 text-sm focus:outline-none appearance-none"
                >
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
                <ChevronDown className="pointer-events-none absolute right-2 top-2 h-4 w-4 opacity-60" />
              </FilterPill>
            </div>

            {/* Sort */}
            <div className="relative">
              <FilterPill active={sort !== SORTS[0].value}>
                <SlidersHorizontal className="h-4 w-4" />
                <select
                  value={sort}
                  onChange={(e) => { setSort(e.target.value); setPage(0); }}
                  className="bg-transparent pr-6 text-sm focus:outline-none appearance-none"
                >
                  {SORTS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                </select>
                <ChevronDown className="pointer-events-none absolute right-2 top-2 h-4 w-4 opacity-60" />
              </FilterPill>
            </div>

            {/* Price Range toggle */}
            <FilterPill active={showPrice || minPrice !== 0 || maxPrice !== 5000} onClick={() => setShowPrice((v) => !v)}>
              ₹ Price
              <ChevronDown className={`h-4 w-4 transition ${showPrice ? 'rotate-180' : ''}`} />
            </FilterPill>

            {/* Advanced toggle */}
            <FilterPill active={advancedOpen || statusFilter !== 'Any' || timeFilter !== 'Any'} onClick={() => setAdvancedOpen((v) => !v)}>
              More Filters
              <ChevronDown className={`h-4 w-4 transition ${advancedOpen ? 'rotate-180' : ''}`} />
            </FilterPill>

            {/* Clear All */}
            <div className="ms-auto">
              <button
                onClick={clearAll}
                className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-red-300 hover:text-red-600"
              >
                Clear All
              </button>
            </div>
          </div>
        </div>

        {/* Price range section */}
        {showPrice && (
          <div className="overflow-hidden rounded-2xl border border-white/40 bg-white/60 p-4 shadow-sm backdrop-blur-lg animate-[fadeIn_0.25s]
          ">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="flex-1">
                <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500">Min Price ₹{minPrice}</label>
                <input
                  type="range"
                  min={0}
                  max={5000}
                  value={minPrice}
                  onChange={(e) => setMinPrice(Number(e.target.value))}
                  className="w-full accent-indigo-600"
                />
              </div>
              <div className="flex-1">
                <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500">Max Price ₹{maxPrice}</label>
                <input
                  type="range"
                  min={0}
                  max={5000}
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-purple-600"
                />
              </div>
            </div>
          </div>
        )}

        {/* Advanced filters */}
        {advancedOpen && (
          <div className="overflow-hidden rounded-2xl border border-white/40 bg-white/60 p-4 shadow-sm backdrop-blur-xl animate-[fadeIn_0.25s]">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-500 flex items-center gap-1"><Clock className="h-3 w-3" /> Time Remaining</label>
                <div className="flex flex-wrap gap-2">
                  {TIME_BUCKETS.map((t) => (
                    <button
                      key={t}
                      onClick={() => setTimeFilter(t)}
                      className={`rounded-full px-3 py-1 text-xs font-medium transition ${timeFilter === t ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow' : 'bg-white/80 text-slate-600 hover:bg-white'}`}
                    >{t}</button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-500 flex items-center gap-1"><SlidersHorizontal className="h-3 w-3" /> Status</label>
                <div className="flex flex-wrap gap-2">
                  {STATUS_OPTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => setStatusFilter(s)}
                      className={`rounded-full px-3 py-1 text-xs font-medium transition ${statusFilter === s ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow' : 'bg-white/80 text-slate-600 hover:bg-white'}`}
                    >{s}</button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Items grid */}
      <div className="mt-6">
        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[...Array(8)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-red-200 bg-red-50/50 p-12 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-slate-900">Unable to load items</h3>
            <p className="mb-4 text-sm text-slate-600">
              {error || 'Please check your connection and try again.'}
            </p>
            <button
              onClick={fetchItems}
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:shadow-xl"
            >
              <RefreshCw className="h-4 w-4" />
              Try Again
            </button>
          </div>
        ) : items.length === 0 ? (
          <EmptyState 
            type="items"
            message="No auctions found"
            actionLabel="Clear Filters"
            onAction={clearAll}
          />
        ) : (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {items.map((it, i) => (
                <div key={it.id} className="animate-fadeIn" style={{ animationDelay: `${i * 0.05}s` }}>
                  <ItemCard item={it} />
                </div>
              ))}
            </div>
            {totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-3">
                <button
                  className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-indigo-300 hover:text-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  disabled={page === 0}
                >
                  Previous
                </button>
                <span className="text-sm font-medium text-slate-600">
                  Page <span className="font-bold text-indigo-600">{page + 1}</span> of {totalPages}
                </span>
                <button
                  className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-indigo-300 hover:text-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed"
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

      {/* Mobile bottom sheet modal */}
      {mobileSheetOpen && (
        <div className="fixed inset-0 z-40 flex flex-col">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setMobileSheetOpen(false)} />
          <div className="mt-auto rounded-t-3xl border border-white/30 bg-white/80 p-6 shadow-xl backdrop-blur-xl animate-[slideUp_0.3s_ease]">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-2"><Filter className="h-4 w-4 text-indigo-600" /> Filters</h3>
              <button onClick={() => setMobileSheetOpen(false)} className="rounded-full p-2 text-slate-500 hover:bg-white"><X className="h-4 w-4" /></button>
            </div>

            <div className="space-y-5 max-h-[55vh] overflow-y-auto pr-1">
              <div>
                <label className="text-xs font-semibold text-slate-500">Category</label>
                <select
                  value={category}
                  onChange={(e) => { setCategory(e.target.value); setPage(0); }}
                  className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm"
                >
                  {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500">Sort</label>
                <select
                  value={sort}
                  onChange={(e) => { setSort(e.target.value); setPage(0); }}
                  className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm"
                >
                  {SORTS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500">Price Range</label>
                <div className="mt-2 flex gap-4">
                  <div className="flex-1">
                    <span className="block text-[10px] font-medium text-slate-500">Min ₹{minPrice}</span>
                    <input type="range" min={0} max={5000} value={minPrice} onChange={(e) => setMinPrice(Number(e.target.value))} className="w-full accent-indigo-600" />
                  </div>
                  <div className="flex-1">
                    <span className="block text-[10px] font-medium text-slate-500">Max ₹{maxPrice}</span>
                    <input type="range" min={0} max={5000} value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))} className="w-full accent-purple-600" />
                  </div>
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500">Status</label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {STATUS_OPTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => setStatusFilter(s)}
                      className={`rounded-full px-3 py-1 text-xs font-medium transition ${statusFilter === s ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow' : 'bg-white/70 text-slate-600 border border-slate-200'}`}
                    >{s}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500">Time Remaining</label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {TIME_BUCKETS.map((t) => (
                    <button
                      key={t}
                      onClick={() => setTimeFilter(t)}
                      className={`rounded-full px-3 py-1 text-xs font-medium transition ${timeFilter === t ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow' : 'bg-white/70 text-slate-600 border border-slate-200'}`}
                    >{t}</button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center gap-3">
              <button
                onClick={() => { clearAll(); fetchItems(); }}
                className="flex-1 rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-600"
              >Reset</button>
              <button
                onClick={() => { setMobileSheetOpen(false); fetchItems(); }}
                className="flex-1 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-3 text-sm font-semibold text-white shadow"
              >Apply</button>
            </div>
          </div>
        </div>
      )}
    </PageContainer>
  );
};

export default BrowseItemsPage;
