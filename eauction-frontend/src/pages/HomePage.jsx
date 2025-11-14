import { Link } from 'react-router-dom';
import { UserPlus, Search, Trophy } from 'lucide-react';

const HomePage = () => (
  <div className="bg-gradient-to-b from-white via-surface to-white">
    <section className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-4 py-16 md:flex-row md:items-center">
      <div className="md:w-1/2">
        <span className="inline-flex items-center rounded-full bg-indigo-100 px-3 py-1 text-sm font-medium text-indigo-700">
          Modern online bidding platform
        </span>
        <h1 className="mt-6 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
          Discover, bid, and win exclusive items in real time.
        </h1>
        <p className="mt-6 text-lg leading-8 text-slate-600">
          eAuction connects buyers and sellers through transparent auctions, secure payments, and instant notifications.
          Join the marketplace to list your items or compete for unique deals.
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            to="/auctions"
            className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
          >
            Browse live auctions
          </Link>
          <Link
            to="/register"
            className="inline-flex items-center justify-center rounded-md border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-indigo-200 hover:text-indigo-600"
          >
            Create your account
          </Link>
        </div>
      </div>

      <div className="md:w-1/2">
        <div className="relative rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-indigo-100">
          <div className="grid grid-cols-2 gap-4">
            {['Authenticated bidding', 'Real-time updates', 'Seller analytics', 'Secure payouts'].map((feature) => (
              <div key={feature} className="rounded-xl border border-slate-100 bg-surface p-4 text-sm text-slate-600">
                <p className="font-semibold text-slate-900">{feature}</p>
                <p className="mt-1 text-slate-500">Designed to streamline every auction workflow.</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>

    {/* How It Works Section */}
    <section className="mx-auto w-full max-w-6xl px-4 py-12">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-indigo-100 md:p-10">
        <div className="text-center">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            How It Works
          </h2>
          <p className="mt-3 text-base text-slate-600">
            Get started in three simple steps
          </p>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {/* Step 1: Create Account */}
          <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-lg transition-all duration-300 hover:shadow-xl hover:shadow-indigo-100">
            <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-gradient-to-br from-indigo-100 to-indigo-50 opacity-50 blur-2xl transition-all duration-300 group-hover:opacity-100" />
            
            <div className="relative">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 shadow-lg shadow-indigo-200">
                <UserPlus className="h-6 w-6 text-white" />
              </div>
              
              <div className="mb-2 flex items-center gap-2">
                <span className="text-xs font-bold text-indigo-600">Step 1</span>
              </div>
              
              <h3 className="mb-2 text-lg font-semibold text-slate-900">
                Create Account
              </h3>
              
              <p className="text-xs leading-relaxed text-slate-600">
                Sign up as a buyer or seller in seconds. Choose your role and start your auction journey.
              </p>
            </div>
          </div>

          {/* Step 2: Browse & Bid */}
          <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-lg transition-all duration-300 hover:shadow-xl hover:shadow-indigo-100">
            <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-gradient-to-br from-indigo-100 to-indigo-50 opacity-50 blur-2xl transition-all duration-300 group-hover:opacity-100" />
            
            <div className="relative">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 shadow-lg shadow-indigo-200">
                <Search className="h-6 w-6 text-white" />
              </div>
              
              <div className="mb-2 flex items-center gap-2">
                <span className="text-xs font-bold text-indigo-600">Step 2</span>
              </div>
              
              <h3 className="mb-2 text-lg font-semibold text-slate-900">
                Browse & Bid
              </h3>
              
              <p className="text-xs leading-relaxed text-slate-600">
                Explore active auctions and place bids on items you love. Track bids in real-time.
              </p>
            </div>
          </div>

          {/* Step 3: Win & Complete */}
          <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-lg transition-all duration-300 hover:shadow-xl hover:shadow-indigo-100">
            <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-gradient-to-br from-indigo-100 to-indigo-50 opacity-50 blur-2xl transition-all duration-300 group-hover:opacity-100" />
            
            <div className="relative">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 shadow-lg shadow-indigo-200">
                <Trophy className="h-6 w-6 text-white" />
              </div>
              
              <div className="mb-2 flex items-center gap-2">
                <span className="text-xs font-bold text-indigo-600">Step 3</span>
              </div>
              
              <h3 className="mb-2 text-lg font-semibold text-slate-900">
                Win & Complete
              </h3>
              
              <p className="text-xs leading-relaxed text-slate-600">
                Win auctions, receive notifications, and complete secure transactions seamlessly.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
);

export default HomePage;
