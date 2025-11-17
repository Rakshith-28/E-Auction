import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PageContainer from '../components/Common/PageContainer.jsx';
import Loader from '../components/Common/Loader.jsx';
import { getActiveAuctions } from '../services/auctionService.js';
import { formatDateTime, timeRemaining } from '../utils/dateUtils.js';
import { formatInr } from '../utils/currencyUtils.js';

const AuctionsPage = () => {
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAuctions = async () => {
      setLoading(true);
      const [data, fetchError] = await getActiveAuctions();

      if (fetchError) {
        setError(fetchError);
      } else if (data) {
        setAuctions(data);
      }

      setLoading(false);
    };

    fetchAuctions();
  }, []);

  if (loading) {
    return (
      <PageContainer title="Live auctions">
        <Loader label="Loading auctions" />
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title="Live auctions"
      subtitle="Bid on items that are currently open."
    >
      {error && <p className="text-sm text-red-600">{error}</p>}
      {!error && auctions.length === 0 && (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center text-slate-600">
          <p className="text-lg font-semibold text-slate-700">No active auctions yet.</p>
          <p className="mt-2 text-sm">Check back soon or list a new item to start an auction.</p>
        </div>
      )}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {auctions.map((auction) => (
          <article key={auction.id} className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
            <h2 className="text-lg font-semibold text-slate-900">{auction.item?.title ?? 'Auction'}</h2>
            <p className="mt-2 flex-1 text-sm text-slate-600 line-clamp-3">{auction.item?.description ?? 'Item description not available.'}</p>
            <dl className="mt-4 space-y-1 text-sm text-slate-500">
              <div className="flex justify-between">
                <dt>Current bid</dt>
                <dd className="font-semibold text-slate-900">₹{formatInr(auction.currentBidAmount ?? 0)}</dd>
              </div>
              <div className="flex justify-between">
                <dt>Ends</dt>
                <dd className="text-right">
                  <span className="block text-slate-900">{auction.endTime ? formatDateTime(auction.endTime) : 'TBD'}</span>
                  {auction.endTime && (
                    <span className="text-xs text-slate-400">{timeRemaining(auction.endTime)} remaining</span>
                  )}
                </dd>
              </div>
            </dl>
            <Link
              to={`/auctions/${auction.id}`}
              className="mt-6 inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700"
            >
              View & bid
            </Link>
          </article>
        ))}
      </div>
    </PageContainer>
  );
};

export default AuctionsPage;
