import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import PageContainer from '../components/Common/PageContainer.jsx';
import Loader from '../components/Common/Loader.jsx';
import { getAuction } from '../services/auctionService.js';
import { placeBid } from '../services/bidService.js';
import { formatDateTime, timeRemaining } from '../utils/dateUtils.js';

const AuctionDetailsPage = () => {
  const { id } = useParams();
  const [auction, setAuction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [bidAmount, setBidAmount] = useState('');
  const [bidError, setBidError] = useState(null);
  const [placingBid, setPlacingBid] = useState(false);

  useEffect(() => {
    const fetchAuction = async () => {
      setLoading(true);
      const [data, fetchError] = await getAuction(id);

      if (fetchError) {
        setError(fetchError);
      } else if (data) {
        setAuction(data);
      }

      setLoading(false);
    };

    fetchAuction();
  }, [id]);

  const minimumBid = useMemo(() => {
    if (!auction) return 0;
    const current = auction.currentBidAmount ?? 0;
    const minimum = auction.item?.minimumBid ?? 0;
    return Math.max(current, minimum);
  }, [auction]);

  const handleBidSubmit = async (event) => {
    event.preventDefault();
    setBidError(null);
    if (!auction?.item?.id) {
      setBidError('Item information is unavailable for this auction.');
      return;
    }
    const nextBid = Number.parseFloat(bidAmount);

    if (Number.isNaN(nextBid) || nextBid <= minimumBid) {
      setBidError(`Bid must be greater than ${minimumBid.toFixed(2)}`);
      return;
    }

    setPlacingBid(true);
    const [, placeBidError] = await placeBid({
      itemId: auction.item.id,
      bidAmount: nextBid,
    });
    setPlacingBid(false);

    if (placeBidError) {
      setBidError(placeBidError);
      return;
    }

    setBidAmount('');
    setBidError(null);

    const [updatedAuction] = await getAuction(id);
    if (updatedAuction) {
      setAuction(updatedAuction);
    }
  };

  if (loading) {
    return (
      <PageContainer title="Auction details">
        <Loader label="Loading auction" />
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer title="Auction details">
        <p className="text-sm text-red-600">{error}</p>
      </PageContainer>
    );
  }

  if (!auction) {
    return (
      <PageContainer title="Auction details">
        <p className="text-sm text-slate-600">Auction data is not available.</p>
      </PageContainer>
    );
  }

  const item = auction.item;
  const bids = auction.bids ?? [];

  return (
    <PageContainer
      title={item?.title ?? 'Auction item'}
      subtitle={item?.description}
      actions={auction.status === 'ACTIVE' ? (
        <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700">
          Active auction
        </span>
      ) : null}
    >
      <div className="grid gap-6 md:grid-cols-[2fr_1fr]">
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Auction overview</h2>
            <dl className="mt-4 grid gap-4 text-sm text-slate-500 md:grid-cols-2">
              <div>
                <dt className="font-medium text-slate-900">Category</dt>
                <dd className="mt-1 capitalize">{item?.category ?? 'N/A'}</dd>
              </div>
              <div>
                <dt className="font-medium text-slate-900">Minimum bid</dt>
                <dd className="mt-1">${(item?.minimumBid ?? 0).toFixed(2)}</dd>
              </div>
              <div>
                <dt className="font-medium text-slate-900">Start time</dt>
                <dd className="mt-1">{formatDateTime(auction.startTime)}</dd>
              </div>
              <div>
                <dt className="font-medium text-slate-900">End time</dt>
                <dd className="mt-1">
                  {formatDateTime(auction.endTime)}
                  {auction.endTime && (
                    <span className="ml-2 rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
                      {timeRemaining(auction.endTime)} remaining
                    </span>
                  )}
                </dd>
              </div>
            </dl>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Bid history</h2>
            {bids.length === 0 ? (
              <p className="mt-4 text-sm text-slate-600">No bids have been placed yet.</p>
            ) : (
              <ul className="mt-4 space-y-3">
                {bids.map((bid) => (
                  <li key={bid.id} className="flex items-center justify-between rounded-xl border border-slate-100 bg-surface px-4 py-3 text-sm">
                    <span className="font-medium text-slate-900">${bid.amount.toFixed(2)}</span>
                      <span className="text-slate-500">{formatDateTime(bid.timestamp)}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <aside className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Place a bid</h2>
          <p className="mt-2 text-sm text-slate-600">Enter an amount greater than ${minimumBid.toFixed(2)}.</p>
          <form className="mt-6 space-y-4" onSubmit={handleBidSubmit}>
            <div>
              <label htmlFor="bid" className="block text-sm font-medium text-slate-700">
                Bid amount
              </label>
              <input
                id="bid"
                type="number"
                min={minimumBid + 0.01}
                step="0.01"
                value={bidAmount}
                onChange={(event) => setBidAmount(event.target.value)}
                className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                required
              />
            </div>

            {bidError && <p className="text-sm text-red-600">{bidError}</p>}

            <button
              type="submit"
              disabled={placingBid}
              className="flex w-full items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {placingBid ? 'Placing bid…' : 'Submit bid'}
            </button>
          </form>
        </aside>
      </div>
    </PageContainer>
  );
};

export default AuctionDetailsPage;
