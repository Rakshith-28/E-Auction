import { useState } from 'react';
import { ShoppingBag, Store, User, Package, Gavel, TrendingUp } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { Link } from 'react-router-dom';

const ProfileDashboardPage = () => {
  const { user, roles, isBuyer, isSeller } = useAuth();
  const [activeSection, setActiveSection] = useState(isBuyer ? 'buy' : isSeller ? 'sell' : 'profile');

  const sidebarItems = [
    { id: 'buy', label: 'Buy', icon: ShoppingBag, show: isBuyer },
    { id: 'sell', label: 'Sell', icon: Store, show: isSeller },
    { id: 'profile', label: 'Profile', icon: User, show: true },
  ].filter((item) => item.show);

  return (
    <div className="min-h-screen bg-gradient-to-br from-surface via-white to-primary-50">
      <div className="mx-auto flex max-w-7xl gap-6 px-4 py-8">
        {/* Left Sidebar */}
        <aside className="w-64 shrink-0">
          <div className="sticky top-24 space-y-2 rounded-2xl border border-white/60 bg-white/90 p-4 shadow-lg backdrop-blur">
            <div className="mb-4 border-b border-slate-200 pb-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Dashboard</p>
              <p className="mt-1 text-sm text-slate-700">Welcome, {user?.name}</p>
            </div>
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold transition ${
                    isActive
                      ? 'bg-primary-500/10 text-primary-600 shadow-sm'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {item.label}
                </button>
              );
            })}
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          {activeSection === 'buy' && isBuyer && <BuySection />}
          {activeSection === 'sell' && isSeller && <SellSection />}
          {activeSection === 'profile' && <ProfileSection />}
        </main>
      </div>
    </div>
  );
};

const BuySection = () => (
  <div className="space-y-6">
    <header className="rounded-2xl border border-white/60 bg-white/90 p-6 shadow-lg backdrop-blur">
      <h1 className="text-2xl font-semibold text-slate-900">Buy Dashboard</h1>
      <p className="mt-2 text-sm text-slate-600">Track your bids, explore auctions, and manage your purchases.</p>
    </header>

    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <StatCard icon={Gavel} label="Active Bids" value="0" />
      <StatCard icon={Package} label="Won Auctions" value="0" />
      <StatCard icon={TrendingUp} label="Total Spent" value="$0.00" />
    </div>

    <section className="rounded-2xl border border-white/60 bg-white/90 p-6 shadow-lg backdrop-blur">
      <h2 className="text-lg font-semibold text-slate-900">Quick Actions</h2>
      <div className="mt-4 flex flex-wrap gap-3">
        <Link
          to="/auctions"
          className="inline-flex items-center gap-2 rounded-full bg-primary-600 px-5 py-2 text-sm font-semibold text-white shadow-lg transition hover:bg-primary-700"
        >
          <ShoppingBag className="h-4 w-4" />
          Browse Auctions
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

const SellSection = () => (
  <div className="space-y-6">
    <header className="rounded-2xl border border-white/60 bg-white/90 p-6 shadow-lg backdrop-blur">
      <h1 className="text-2xl font-semibold text-slate-900">Sell Dashboard</h1>
      <p className="mt-2 text-sm text-slate-600">Manage your listings, track auction performance, and analyze sales.</p>
    </header>

    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <StatCard icon={Package} label="Active Listings" value="0" />
      <StatCard icon={Gavel} label="Total Bids Received" value="0" />
      <StatCard icon={TrendingUp} label="Revenue" value="$0.00" />
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

const ProfileSection = () => (
  <div className="space-y-6">
    <header className="rounded-2xl border border-white/60 bg-white/90 p-6 shadow-lg backdrop-blur">
      <h1 className="text-2xl font-semibold text-slate-900">Profile</h1>
      <p className="mt-2 text-sm text-slate-600">Manage your account settings and roles.</p>
    </header>

    <section className="rounded-2xl border border-white/60 bg-white/90 p-6 shadow-lg backdrop-blur">
      <h2 className="text-lg font-semibold text-slate-900">Account Details</h2>
      <div className="mt-4">
        <Link
          to="/profile"
          className="inline-flex items-center gap-2 rounded-full bg-primary-600 px-5 py-2 text-sm font-semibold text-white shadow-lg transition hover:bg-primary-700"
        >
          <User className="h-4 w-4" />
          Edit Profile
        </Link>
      </div>
    </section>
  </div>
);

const StatCard = ({ icon: Icon, label, value }) => (
  <article className="rounded-2xl border border-white/60 bg-white/90 p-6 shadow-lg backdrop-blur">
    <div className="flex items-center gap-3">
      <div className="grid h-12 w-12 place-items-center rounded-full bg-primary-100 text-primary-600">
        <Icon className="h-6 w-6" />
      </div>
      <div>
        <p className="text-xs font-medium text-slate-500">{label}</p>
        <p className="mt-1 text-2xl font-semibold text-slate-900">{value}</p>
      </div>
    </div>
  </article>
);

export default ProfileDashboardPage;
