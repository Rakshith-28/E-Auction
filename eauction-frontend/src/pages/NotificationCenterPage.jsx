import { useEffect, useState, useCallback } from 'react';
import { getNotifications, markAsRead, markAsUnread, deleteNotification, clearReadNotifications } from '../services/notificationService.js';
import { formatDateTime } from '../utils/dateUtils.js';
import { Bell, Filter, X, Trash2, RefreshCw } from 'lucide-react';

const typeGroups = [
  { label: 'All', value: '' },
  { label: 'Bids', value: 'NEW_BID_ON_ITEM' },
  { label: 'Outbid', value: 'OUTBID' },
  { label: 'Wins', value: 'AUCTION_WON' },
  { label: 'Losses', value: 'AUCTION_LOST' },
  { label: 'Sales', value: 'ITEM_SOLD' },
  { label: 'Ending Soon', value: 'AUCTION_ENDING_SOON' },
];

const pageSize = 12;

const NotificationCenterPage = () => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [typeFilter, setTypeFilter] = useState('');
  const [readFilter, setReadFilter] = useState(null); // null, true, false
  const [refreshKey, setRefreshKey] = useState(0);

  const fetch = useCallback(async () => {
    setLoading(true);
    const [resp, err] = await getNotifications({ page, size: pageSize, type: typeFilter || undefined, read: readFilter });
    if (err) {
      setError(err.message || 'Failed to load notifications');
    } else if (resp) {
      if (resp.content) {
        setData(resp.content);
        setTotal(resp.totalElements);
      } else {
        // fallback for non-page structure
        setData(resp);
        setTotal(resp.length);
      }
    }
    setLoading(false);
  }, [page, typeFilter, readFilter]);

  useEffect(() => { fetch(); }, [fetch, refreshKey]);

  const totalPages = Math.ceil(total / pageSize);

  const onToggleRead = async (n) => {
    if (n.read) {
      await markAsUnread(n.id);
      setData(d => d.map(x => x.id === n.id ? { ...x, read: false } : x));
    } else {
      await markAsRead(n.id);
      setData(d => d.map(x => x.id === n.id ? { ...x, read: true } : x));
    }
  };

  const onDelete = async (n) => {
    await deleteNotification(n.id);
    setData(d => d.filter(x => x.id !== n.id));
    setTotal(t => t - 1);
  };

  const clearRead = async () => {
    await clearReadNotifications();
    setData(d => d.filter(x => !x.read));
    setTotal(t => data.filter(x => !x.read).length);
  };

  const resetFilters = () => {
    setTypeFilter('');
    setReadFilter(null);
    setPage(0);
    setRefreshKey(k => k + 1);
  };

  const relativeTime = (iso) => {
    if (!iso) return '';
    const date = new Date(iso);
    const diff = Date.now() - date.getTime();
    const sec = Math.floor(diff / 1000);
    if (sec < 60) return sec + 's ago';
    const min = Math.floor(sec / 60);
    if (min < 60) return min + 'm ago';
    const hr = Math.floor(min / 60);
    if (hr < 24) return hr + 'h ago';
    const d = Math.floor(hr / 24);
    if (d < 7) return d + 'd ago';
    return formatDateTime(iso);
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2"><Bell className="h-6 w-6 text-indigo-600" /> Notification Center</h1>
          <p className="mt-1 text-sm text-slate-600">Stay up to date with your auctions, bids, and sales.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setRefreshKey(k => k + 1)} className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"><RefreshCw className="h-4 w-4" /> Refresh</button>
          <button onClick={clearRead} className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"><Trash2 className="h-4 w-4" /> Clear Read</button>
          <button onClick={resetFilters} className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"><X className="h-4 w-4" /> Reset</button>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500"><Filter className="h-4 w-4" /> Filters:</div>
        {typeGroups.map(t => (
          <button
            key={t.value || 'all'}
            onClick={() => { setTypeFilter(t.value); setPage(0); }}
            className={`rounded-full border px-3 py-1 text-sm ${typeFilter === t.value ? 'border-indigo-600 bg-indigo-50 text-indigo-700 font-semibold' : 'border-slate-200 text-slate-600 hover:bg-slate-100'}`}
          >{t.label}</button>
        ))}
        <div className="ml-2 flex gap-1">
          <button onClick={() => { setReadFilter(null); setPage(0); }} className={`rounded-full px-3 py-1 text-sm border ${readFilter===null?'border-indigo-600 bg-indigo-50 text-indigo-700 font-semibold':'border-slate-200 text-slate-600 hover:bg-slate-100'}`}>All</button>
          <button onClick={() => { setReadFilter(false); setPage(0); }} className={`rounded-full px-3 py-1 text-sm border ${readFilter===false?'border-indigo-600 bg-indigo-50 text-indigo-700 font-semibold':'border-slate-200 text-slate-600 hover:bg-slate-100'}`}>Unread</button>
          <button onClick={() => { setReadFilter(true); setPage(0); }} className={`rounded-full px-3 py-1 text-sm border ${readFilter===true?'border-indigo-600 bg-indigo-50 text-indigo-700 font-semibold':'border-slate-200 text-slate-600 hover:bg-slate-100'}`}>Read</button>
        </div>
      </div>

      <div className="mt-8">
        {loading && (
          <div className="rounded-xl border border-slate-200 p-6 text-center text-sm text-slate-500">Loading notifications...</div>
        )}
        {error && !loading && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-sm text-red-600">{error}</div>
        )}
        {!loading && !error && data.length === 0 && (
          <div className="rounded-xl border border-dashed border-slate-200 p-10 text-center">
            <p className="text-sm font-medium text-slate-700">You're all caught up!</p>
            <p className="mt-2 text-xs text-slate-500">No notifications match your filters.</p>
          </div>
        )}
        <ul className="space-y-3">
          {data.map(n => (
            <li key={n.id} className={`group flex gap-4 rounded-xl border p-4 transition ${n.read ? 'border-slate-200 bg-white' : 'border-indigo-300 bg-indigo-50'}`}>
              <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                <Bell className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h2 className={`text-sm font-semibold ${n.read ? 'text-slate-800' : 'text-indigo-700'}`}>{n.title}</h2>
                  <span className="text-xs text-slate-400">{relativeTime(n.createdAt)}</span>
                </div>
                <p className="mt-1 text-sm text-slate-600">{n.message}</p>
                {n.itemTitle && (
                  <p className="mt-1 text-xs text-slate-500">Item: {n.itemTitle}</p>
                )}
                <div className="mt-3 flex flex-wrap gap-2">
                  <button onClick={() => onToggleRead(n)} className={`rounded-md border px-2 py-1 text-xs font-medium transition ${n.read ? 'border-slate-200 text-slate-600 hover:border-indigo-200 hover:text-indigo-600' : 'border-indigo-400 bg-indigo-600 text-white hover:bg-indigo-700'}`}>{n.read ? 'Mark Unread' : 'Mark Read'}</button>
                  <button onClick={() => onDelete(n)} className="rounded-md border border-slate-200 px-2 py-1 text-xs font-medium text-slate-500 hover:border-red-300 hover:text-red-600">Delete</button>
                  {n.actionUrl && (
                    <a href={n.actionUrl} className="rounded-md border border-slate-200 px-2 py-1 text-xs font-medium text-indigo-600 hover:border-indigo-300 hover:bg-indigo-50" onClick={(e)=>{ /* allow navigation */ }}>
                      View Item
                    </a>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
        {totalPages > 1 && (
          <div className="mt-8 flex items-center justify-center gap-2">
            <button disabled={page===0} onClick={()=> setPage(p=>p-1)} className="rounded-lg border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600 disabled:opacity-40">Prev</button>
            <div className="text-xs font-medium text-slate-600">Page {page+1} / {totalPages}</div>
            <button disabled={page>=totalPages-1} onClick={()=> setPage(p=>p+1)} className="rounded-lg border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600 disabled:opacity-40">Next</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationCenterPage;
