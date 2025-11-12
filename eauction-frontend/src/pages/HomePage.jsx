import { Link } from 'react-router-dom';

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
  </div>
);

export default HomePage;
