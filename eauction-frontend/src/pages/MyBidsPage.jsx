import { useEffect, useState } from 'react';
import PageContainer from '../components/Common/PageContainer.jsx';
import Loader from '../components/Common/Loader.jsx';
import { getMyBids } from '../services/bidService.js';

const MyBidsPage = () => {
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBids = async () => {
      setLoading(true);
      const [data, fetchError] = await getMyBids();

      if (fetchError) {
        setError(fetchError);
      } else if (data) {
        setBids(data);
      }

      setLoading(false);
    };

    fetchBids();
  }, []);

  if (loading) {
    return (
      <PageContainer title="My bids">
        <Loader label="Loading bids" />
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title="My bids"
      subtitle="Track the auctions where you are participating."
    >
      {error && <p className="text-sm text-red-600">{error}</p>}
      {bids.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center text-slate-600">
          <p className="text-lg font-semibold text-slate-700">You have not placed any bids yet.</p>
          <p className="mt-2 text-sm">Explore live auctions and place your first bid.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {bids.map((bid) => (
            <article key={bid.id} className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:flex-row md:items-center">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">{bid.auction?.item?.title ?? 'Auction'}</h2>
                <p className="mt-2 text-sm text-slate-600">
                  Bid amount:{' '}
                  <span className="font-semibold text-slate-900">
                    ${Number.isFinite(bid.amount) ? bid.amount.toFixed(2) : '0.00'}
                  </span>
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Placed on {bid.timestamp ? new Date(bid.timestamp).toLocaleString() : 'Unknown date'}
                </p>
              </div>
              <p className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-600">
                Status: {bid.status ?? 'PENDING'}
              </p>
            </article>
          ))}
        </div>
      )}
    </PageContainer>
  );
};

export default MyBidsPage;
