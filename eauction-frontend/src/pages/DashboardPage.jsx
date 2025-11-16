import { useEffect, useState } from 'react';
import { Package, Gavel, TrendingUp, Store, ShoppingBag } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { Link, useSearchParams } from 'react-router-dom';
import Sidebar from '../components/Dashboard/Sidebar';
import { getUserStats } from '../services/userService';
import { getMyBids, getBidsOnMyItems } from '../services/bidService';
import { getMyItems } from '../services/itemService';
import { getPaymentSummary } from '../services/paymentService';

const ProfileDashboardPage = () => {
  const { isBuyer, isSeller, user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState('buy');
  const [loading, setLoading] = useState(true);
  const [buyData, setBuyData] = useState({ activeBids: null, wonAuctions: null, totalSpent: null });
  const [sellData, setSellData] = useState({ activeListings: null, totalBidsReceived: null, revenue: null });
  const canBuy = !!isBuyer;
  const canSell = !!isSeller;

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'sell' && canSell) setActiveTab('sell');
    else setActiveTab('buy');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, canSell]);

  const switchTab = (tab) => {
    if (tab === 'sell' && !canSell) return;
    setActiveTab(tab);
    setSearchParams(tab === 'buy' ? { tab: 'buy' } : { tab: 'sell' }, { replace: true });
  };

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      try {
        const promises = [];
        // Common stats
        promises.push(getUserStats());
        // Buy-side
        if (canBuy) {
          promises.push(getMyBids());
        } else {
          promises.push(Promise.resolve([null, null]));
        }
        // Sell-side
        if (canSell) {
          promises.push(getBidsOnMyItems());
          promises.push(getMyItems());
        } else {
          promises.push(Promise.resolve([null, null]));
          promises.push(Promise.resolve([null, null]));
        }
        // Payment summary for totals
        if (user?.id) {
          promises.push(getPaymentSummary(user.id));
        } else {
          promises.push(Promise.resolve([null, null]));
        }
        const [statsRes, myBidsRes, bidsOnMyItemsRes, myItemsRes, paymentSummaryRes] = await Promise.all(promises);
        const [stats] = statsRes || [];
        const [myBids] = myBidsRes || [];
        const [bidsOnMyItems] = bidsOnMyItemsRes || [];
        const [myItems] = myItemsRes || [];
        const [summary] = paymentSummaryRes || [];

        if (!mounted) return;

        // Derive counts with safe fallbacks
        const activeBids = Array.isArray(myBids) ? myBids.length : 0;
        const wonAuctions = stats?.itemsWon ?? 0;
        const totalSpent = typeof summary?.totalSpent === 'number' ? summary.totalSpent : null;

        const activeListings = Array.isArray(myItems)
          ? myItems.filter(it => (it.status || '').toString().toUpperCase() === 'ACTIVE').length
          : 0;
        const totalBidsReceived = Array.isArray(bidsOnMyItems) ? bidsOnMyItems.length : 0;
        const revenue = typeof summary?.revenue === 'number' ? summary.revenue : null;

        setBuyData({ activeBids, wonAuctions, totalSpent });
        setSellData({ activeListings, totalBidsReceived, revenue });
      } finally {
        mounted && setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, [canBuy, canSell, user?.id]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-surface via-white to-primary-50">
      <div className="mx-auto flex max-w-7xl gap-6 px-4 py-8">
        <Sidebar />

        {/* Main Content */}
        <main className="flex-1">
          {/* Breadcrumbs */}
          <nav className="mb-3 text-sm text-slate-500">
            <span className="text-slate-600">Dashboard</span>
            <span className="mx-2">/</span>
            <span className="font-medium text-slate-800">{activeTab === 'sell' ? 'Sell' : 'Buy'}</span>
          </nav>

          {/* Tab Switcher */}
          <div className="mb-6 rounded-2xl border border-white/60 bg-white/90 p-2 shadow-lg backdrop-blur">
            <div className="flex gap-2">
              <TabButton
                label="Buy"
                active={activeTab === 'buy'}
                onClick={() => switchTab('buy')}
              />
              <TabButton
                label="Sell"
                active={activeTab === 'sell'}
                onClick={() => switchTab('sell')}
                disabled={!canSell}
              />
            </div>
          </div>

          {/* Tab Content */}
          <div className="relative">
            <div className={`${activeTab === 'buy' ? 'opacity-100' : 'pointer-events-none absolute inset-0 opacity-0'} transition-opacity duration-300`}>
              {canBuy && (
                loading ? (
                  <SkeletonDashboard type="buy" />
                ) : (
                  <BuySection
                    activeBids={buyData.activeBids}
                    wonAuctions={buyData.wonAuctions}
                    totalSpent={buyData.totalSpent}
                  />
                )
              )}
            </div>
            <div className={`${activeTab === 'sell' ? 'opacity-100' : 'pointer-events-none absolute inset-0 opacity-0'} transition-opacity duration-300`}>
              {canSell && (
                loading ? (
                  <SkeletonDashboard type="sell" />
                ) : (
                  <SellSection
                    activeListings={sellData.activeListings}
                    totalBidsReceived={sellData.totalBidsReceived}
                    revenue={sellData.revenue}
                  />
                )
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

const BuySection = ({ activeBids = 0, wonAuctions = 0, totalSpent = null }) => (
  <div className="space-y-6">
    <header className="rounded-2xl border border-white/60 bg-white/90 p-6 shadow-lg backdrop-blur">
      <h1 className="text-2xl font-semibold text-slate-900">Buy Dashboard</h1>
      <p className="mt-2 text-sm text-slate-600">Track your bids, explore auctions, and manage your purchases.</p>
    </header>

    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <StatCard icon={Gavel} label="Active Bids" value={activeBids} />
      <StatCard icon={Package} label="Won Auctions" value={wonAuctions} />
      <StatCard icon={TrendingUp} label="Total Spent" value={totalSpent} format="currency" />
    </div>

    <section className="rounded-2xl border border-white/60 bg-white/90 p-6 shadow-lg backdrop-blur">
      <h2 className="text-lg font-semibold text-slate-900">Quick Actions</h2>
      <div className="mt-4 flex flex-wrap gap-3">
        <Link
          to="/items"
          className="inline-flex items-center gap-2 rounded-full bg-primary-600 px-5 py-2 text-sm font-semibold text-white shadow-lg transition hover:bg-primary-700"
        >
          <ShoppingBag className="h-4 w-4" />
          Browse Items
        </Link>
        <Link
          to="/bids"
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-2 text-sm font-semibold text-slate-700 transition hover:border-primary-200 hover:text-primary-600"
        >
          <Gavel className="h-4 w-4" />
          My Bids
        </Link>
      </div>
    </section>

    <section className="rounded-2xl border border-white/60 bg-white/90 p-6 shadow-lg backdrop-blur">
      <h2 className="text-lg font-semibold text-slate-900">Recent Activity</h2>
      <p className="mt-4 text-sm text-slate-600">No recent activity to display.</p>
    </section>
  </div>
);

const SellSection = ({ activeListings = 0, totalBidsReceived = 0, revenue = null }) => (
  <div className="space-y-6">
    <header className="rounded-2xl border border-white/60 bg-white/90 p-6 shadow-lg backdrop-blur">
      <h1 className="text-2xl font-semibold text-slate-900">Sell Dashboard</h1>
      <p className="mt-2 text-sm text-slate-600">Manage your listings, track auction performance, and analyze sales.</p>
    </header>

    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <StatCard icon={Package} label="Active Listings" value={activeListings} />
      <StatCard icon={Gavel} label="Total Bids Received" value={totalBidsReceived} />
      <StatCard icon={TrendingUp} label="Revenue" value={revenue} format="currency" />
    </div>

    <section className="rounded-2xl border border-white/60 bg-white/90 p-6 shadow-lg backdrop-blur">
      <h2 className="text-lg font-semibold text-slate-900">Quick Actions</h2>
      <div className="mt-4 flex flex-wrap gap-3">
        <Link
          to="/items/create"
          className="inline-flex items-center gap-2 rounded-full bg-primary-600 px-5 py-2 text-sm font-semibold text-white shadow-lg transition hover:bg-primary-700"
        >
          <Store className="h-4 w-4" />
          Create Listing
        </Link>
        <Link
          to="/items/mine"
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-2 text-sm font-semibold text-slate-700 transition hover:border-primary-200 hover:text-primary-600"
        >
          <Package className="h-4 w-4" />
          My Listings
        </Link>
      </div>
    </section>

    <section className="rounded-2xl border border-white/60 bg-white/90 p-6 shadow-lg backdrop-blur">
      <h2 className="text-lg font-semibold text-slate-900">Recent Listings</h2>
      <p className="mt-4 text-sm text-slate-600">You have not created any listings yet.</p>
    </section>
  </div>
);

const TabButton = ({ label, active, onClick, disabled }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`relative flex-1 rounded-xl px-5 py-3 text-sm font-semibold transition ${
      active
        ? 'bg-gradient-to-r from-primary-600 to-secondary text-white shadow'
        : 'text-slate-600 hover:bg-slate-100'
    } ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}
  >
    {label}
  </button>
);

const StatCard = ({ icon: Icon, label, value, format }) => {
  const isAvailable = typeof value === 'number' && !Number.isNaN(value);
  return (
    <article className="group rounded-2xl border border-white/60 bg-white/90 p-6 shadow-lg backdrop-blur">
      <div className="flex items-center gap-3">
        <div className="grid h-12 w-12 place-items-center rounded-full bg-primary-100 text-primary-600">
          <Icon className="h-6 w-6" />
        </div>
        <div>
          <p className="text-xs font-medium text-slate-500">{label}</p>
          <p className="mt-1 text-2xl font-semibold text-slate-900">
            {isAvailable ? (
              <CountUp to={value} format={format} />
            ) : (
              <span className="relative">
                —
                <span className="pointer-events-none absolute -top-8 left-1/2 hidden -translate-x-1/2 whitespace-nowrap rounded bg-slate-800 px-2 py-1 text-xs text-white shadow group-hover:block">
                  Coming soon
                </span>
              </span>
            )}
          </p>
        </div>
      </div>
    </article>
  );
};

const CountUp = ({ to = 0, duration = 600, format }) => {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let raf;
    const start = performance.now();
    const from = 0;
    const animate = (t) => {
      const elapsed = t - start;
      const p = Math.min(1, elapsed / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      const current = from + (to - from) * eased;
      setVal(current);
      if (p < 1) raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [to, duration]);

  const display = format === 'currency'
    ? `$${Number(val).toFixed(2)}`
    : Math.round(val).toString();

  return <span>{display}</span>;
};

const Skeleton = ({ className = '' }) => (
  <div className={`animate-pulse rounded-lg bg-slate-200/60 ${className}`} />
);

const SkeletonDashboard = ({ type }) => (
  <div className="space-y-6">
    <header className="rounded-2xl border border-white/60 bg-white/90 p-6 shadow-lg backdrop-blur">
      <div className="h-6 w-40 rounded bg-slate-200/70" />
      <div className="mt-2 h-4 w-64 rounded bg-slate-200/60" />
    </header>

    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <div className="rounded-2xl border border-white/60 bg-white/90 p-6 shadow-lg backdrop-blur">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-full bg-slate-200/70" />
          <div className="flex-1">
            <div className="h-3 w-24 rounded bg-slate-200/60" />
            <div className="mt-2 h-6 w-16 rounded bg-slate-200/70" />
          </div>
        </div>
      </div>
      <div className="rounded-2xl border border-white/60 bg-white/90 p-6 shadow-lg backdrop-blur">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-full bg-slate-200/70" />
          <div className="flex-1">
            <div className="h-3 w-24 rounded bg-slate-200/60" />
            <div className="mt-2 h-6 w-16 rounded bg-slate-200/70" />
          </div>
        </div>
      </div>
      <div className="rounded-2xl border border-white/60 bg-white/90 p-6 shadow-lg backdrop-blur">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-full bg-slate-200/70" />
          <div className="flex-1">
            <div className="h-3 w-24 rounded bg-slate-200/60" />
            <div className="mt-2 h-6 w-16 rounded bg-slate-200/70" />
          </div>
        </div>
      </div>
    </div>

    <section className="rounded-2xl border border-white/60 bg-white/90 p-6 shadow-lg backdrop-blur">
      <div className="h-5 w-40 rounded bg-slate-200/70" />
      <div className="mt-4 h-4 w-56 rounded bg-slate-200/60" />
    </section>
  </div>
);

export default ProfileDashboardPage;
