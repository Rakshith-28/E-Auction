import { Link } from 'react-router-dom';
import { Bell, ShoppingCart, LogOut, User, Settings } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';

const Topbar = () => {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-white/30 bg-white/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Link to="/dashboard" className="flex items-center gap-2 text-lg font-semibold text-primary-600">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-primary-500 to-secondary text-white shadow">🔨</span>
          <span className="tracking-tight">eAuction</span>
        </Link>

        <div className="flex-1"></div>

        <div className="flex items-center gap-2">
          <button className="relative grid h-10 w-10 place-items-center rounded-full border border-white/60 bg-white/60 text-slate-600 transition hover:border-primary-200 hover:text-primary-600">
            <Bell className="h-5 w-5" />
            <span className="absolute -right-1 -top-1 inline-flex h-4 w-4 items-center justify-center rounded-full bg-primary-500 text-[10px] font-bold text-white">3</span>
          </button>
          <button className="relative grid h-10 w-10 place-items-center rounded-full border border-white/60 bg-white/60 text-slate-600 transition hover:border-primary-200 hover:text-primary-600">
            <ShoppingCart className="h-5 w-5" />
            <span className="absolute -right-1 -top-1 inline-flex h-4 w-4 items-center justify-center rounded-full bg-primary-500 text-[10px] font-bold text-white">2</span>
          </button>

          <div className="relative">
            <button
              type="button"
              onClick={() => setOpen((p) => !p)}
              className="inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/60 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-primary-200 hover:text-primary-600"
            >
              <span className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-r from-primary-500 to-secondary text-white">
                {user?.name?.[0]?.toUpperCase() ?? <User className="h-4 w-4" />}
              </span>
              <span className="hidden md:inline">{user?.name ?? 'Account'}</span>
            </button>
            {open && (
              <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-white/40 bg-white/90 p-2 text-sm shadow-xl backdrop-blur">
                <Link to="/profile" className="flex items-center gap-2 rounded-xl px-3 py-2 text-slate-600 transition hover:bg-primary-500/10 hover:text-primary-600" onClick={() => setOpen(false)}>
                  <User className="h-4 w-4" />
                  View Profile
                </Link>
                <Link to="/settings" className="flex items-center gap-2 rounded-xl px-3 py-2 text-slate-600 transition hover:bg-primary-500/10 hover:text-primary-600" onClick={() => setOpen(false)}>
                  <Settings className="h-4 w-4" />
                  Settings
                </Link>
                <div className="my-1 h-px bg-slate-200" />
                <button type="button" onClick={() => { setOpen(false); logout(); }} className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-danger transition hover:bg-danger/10">
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
