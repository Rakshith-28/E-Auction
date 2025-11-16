import { Link } from 'react-router-dom';
import { UserPlus, Search, Trophy, Zap, Shield, Clock, TrendingUp } from 'lucide-react';

const HomePage = () => {
  return (
    <div className="bg-gradient-to-br from-white via-indigo-50/30 to-purple-50/30">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute left-1/4 top-20 h-72 w-72 animate-float-slow rounded-full bg-gradient-to-br from-indigo-200/40 to-purple-200/40 blur-3xl" />
          <div className="absolute right-1/4 top-40 h-96 w-96 animate-pulse-soft rounded-full bg-gradient-to-br from-blue-200/30 to-indigo-200/30 blur-3xl" />
        </div>

        <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-4 py-20 md:flex-row md:items-center md:py-32">
          <div className="md:w-1/2 animate-fadeIn">
            <span className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-100 to-purple-100 px-4 py-2 text-sm font-semibold text-indigo-700 shadow-sm">
              <Zap className="h-4 w-4" />
              Modern Online Bidding Platform
            </span>
            <h1 className="mt-8 text-5xl font-bold leading-tight tracking-tight text-slate-900 sm:text-6xl lg:text-7xl">
              Discover, Bid & Win
              <span className="mt-2 block gradient-text">
                Exclusive Items
              </span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-slate-600">
              Join thousands of buyers and sellers in the most trusted online auction marketplace. 
              Experience real-time bidding, secure payments, and instant notifications.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                to="/items"
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-4 text-base font-semibold text-white shadow-xl transition hover:shadow-2xl hover:scale-105"
              >
                Browse Auctions
                <Search className="h-5 w-5 transition group-hover:translate-x-1" />
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-indigo-200 bg-white px-8 py-4 text-base font-semibold text-indigo-700 transition hover:border-indigo-300 hover:bg-indigo-50"
              >
                <UserPlus className="h-5 w-5" />
                Get Started Free
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="mt-12 flex flex-wrap items-center gap-6 text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-green-600" />
                <span>100% Secure</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-blue-600" />
                <span>24/7 Support</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-purple-600" />
                <span>Growing Daily</span>
              </div>
            </div>
          </div>

          <div className="md:w-1/2 animate-fadeIn" style={{ animationDelay: '0.2s' }}>
            <div className="relative">
              {/* Decorative circles */}
              <div className="absolute -left-4 -top-4 h-24 w-24 rounded-full bg-gradient-to-br from-yellow-200 to-orange-200 opacity-70 blur-xl" />
              <div className="absolute -bottom-4 -right-4 h-32 w-32 rounded-full bg-gradient-to-br from-blue-200 to-indigo-200 opacity-70 blur-xl" />
              
              <div className="relative rounded-3xl border border-white/60 bg-white/80 p-8 shadow-2xl backdrop-blur-sm">
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { icon: '🎯', title: 'Smart Bidding', desc: 'Real-time updates' },
                    { icon: '💎', title: 'Premium Items', desc: 'Verified sellers' },
                    { icon: '⚡', title: 'Instant Alerts', desc: 'Never miss a bid' },
                    { icon: '🔒', title: 'Secure Payment', desc: 'Protected transactions' }
                  ].map((feature, i) => (
                    <div 
                      key={feature.title} 
                      className="hover-lift rounded-2xl border border-indigo-100 bg-gradient-to-br from-white to-indigo-50/50 p-5 transition"
                      style={{ animationDelay: `${0.1 * i}s` }}
                    >
                      <div className="mb-3 text-3xl">{feature.icon}</div>
                      <p className="font-semibold text-slate-900">{feature.title}</p>
                      <p className="mt-1 text-xs text-slate-600">{feature.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="mx-auto w-full max-w-6xl px-4 py-20">
        <div className="mb-12 text-center">
          <h2 className="text-4xl font-bold tracking-tight text-slate-900">
            How It Works
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            Start bidding in three simple steps
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {[
            { icon: UserPlus, step: 1, title: 'Create Account', desc: 'Sign up as a buyer or seller in seconds. Choose your role and start your journey.' },
            { icon: Search, step: 2, title: 'Browse & Bid', desc: 'Explore active auctions and place bids on items you love. Track everything in real-time.' },
            { icon: Trophy, step: 3, title: 'Win & Complete', desc: 'Win auctions, receive instant notifications, and complete secure transactions.' }
          ].map(({ icon: Icon, step, title, desc }, i) => (
            <div 
              key={step} 
              className="group relative overflow-hidden rounded-3xl border-2 border-indigo-100 bg-white p-8 shadow-lg transition hover:border-indigo-300 hover:shadow-2xl hover:-translate-y-2"
              style={{ animationDelay: `${0.15 * i}s` }}
            >
              <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 opacity-0 blur-2xl transition group-hover:opacity-100" />
              
              <div className="relative">
                <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-xl">
                  <Icon className="h-8 w-8 text-white" />
                </div>
                
                <div className="mb-3 flex items-center gap-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">Step {step}</span>
                  <div className="h-px flex-1 bg-gradient-to-r from-indigo-200 to-transparent" />
                </div>
                
                <h3 className="mb-3 text-xl font-bold text-slate-900">
                  {title}
                </h3>
                
                <p className="text-sm leading-relaxed text-slate-600">
                  {desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-700 py-20">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30" />
        
        <div className="relative mx-auto max-w-4xl px-4 text-center">
          <h2 className="mb-6 text-4xl font-bold text-white sm:text-5xl">
            Ready to Start Bidding?
          </h2>
          <p className="mb-10 text-lg text-indigo-100">
            Join thousands of satisfied users and discover amazing deals today
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link
              to="/register"
              className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-white bg-white px-8 py-4 font-semibold text-indigo-700 shadow-2xl transition hover:scale-105"
            >
              <UserPlus className="h-5 w-5" />
              Create Free Account
            </Link>
            <Link
              to="/items"
              className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-white/30 bg-white/10 px-8 py-4 font-semibold text-white backdrop-blur transition hover:bg-white/20"
            >
              Explore Auctions
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
