import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  Menu,
  ShoppingCart,
  User,
  LogOut,
  LogIn,
  UserPlus,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import NotificationBell from '../Notifications/NotificationBell';

const NAV_LINKS = [
  { to: '/auctions', label: 'Auctions' },
  { to: '/items/create', label: 'Sell Item', roles: ['SELLER', 'ADMIN'] },
  { to: '/admin', label: 'Admin', roles: ['ADMIN'] },
];

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    setDropdownOpen(false);
    logout();
    navigate('/');
  };

  const filteredLinks = NAV_LINKS.filter((link) => (!link.roles ? true : link.roles.includes(user?.role)));

  return (
    <header className="sticky top-0 z-40 border-b border-white/20 bg-white/70 backdrop-blur-xl shadow-glass">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <div className="flex items-center gap-4">
          <button
            type="button"
            className="rounded-xl p-2 text-slate-600 transition hover:bg-white/60 md:hidden"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label="Toggle navigation"
          >
            <Menu className="h-6 w-6" />
          </button>
          <Link to="/" className="flex items-center gap-2 text-xl font-semibold text-primary-600">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-primary-500 to-secondary text-white shadow-lg">
              🔨
            </span>
            <span className="tracking-tight">eAuction</span>
          </Link>
        </div>

        <nav
          className={`${
            menuOpen ? 'flex' : 'hidden'
          } absolute left-0 top-full z-30 w-full flex-col gap-2 bg-white/95 px-4 pb-4 pt-2 shadow-lg backdrop-blur md:static md:flex md:w-auto md:flex-row md:items-center md:gap-8 md:bg-transparent md:p-0 md:shadow-none`}
        >
          {filteredLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                  isActive ? 'bg-primary-500/10 text-primary-600' : 'text-slate-700 hover:text-primary-600'
                }`
              }
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </NavLink>
          ))}

          {!isAuthenticated && (
            <div className="flex flex-col gap-2 md:hidden">
              <Link
                to="/login"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/60 bg-white/60 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-primary-200 hover:text-primary-600"
                onClick={() => setMenuOpen(false)}
              >
                <LogIn className="h-4 w-4" />
                Login
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-primary-500 to-secondary px-5 py-2 text-sm font-semibold text-white shadow-lg transition hover:shadow-xl"
                onClick={() => setMenuOpen(false)}
              >
                <UserPlus className="h-4 w-4" />
                Register
              </Link>
            </div>
          )}
        </nav>

        <div className="flex items-center gap-3">
          <button
            type="button"
            className="relative hidden h-10 w-10 items-center justify-center rounded-full border border-white/60 bg-white/60 text-slate-600 transition hover:border-primary-200 hover:text-primary-600 md:flex"
            aria-label="Future cart feature"
          >
            <ShoppingCart className="h-5 w-5" />
            <span className="absolute -right-1 -top-1 inline-flex h-4 w-4 items-center justify-center rounded-full bg-primary-500 text-[10px] font-bold text-white">
              0
            </span>
          </button>
          {isAuthenticated && <NotificationBell />}
          {!isAuthenticated ? (
            <div className="hidden items-center gap-2 md:flex">
              <Link
                to="/login"
                className="inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/60 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-primary-200 hover:text-primary-600"
              >
                <LogIn className="h-4 w-4" />
                Login
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary-500 to-secondary px-5 py-2 text-sm font-semibold text-white shadow-lg transition hover:shadow-xl"
              >
                <UserPlus className="h-4 w-4" />
                Register
              </Link>
            </div>
          ) : (
            <div className="relative">
              <button
                type="button"
                onClick={() => setDropdownOpen((prev) => !prev)}
                className="inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/60 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-primary-200 hover:text-primary-600"
              >
                <span className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-r from-primary-500 to-secondary text-white">
                  {user?.name?.[0]?.toUpperCase() ?? <User className="h-4 w-4" />}
                </span>
                <span className="hidden md:inline">{user?.name ?? 'Account'}</span>
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-3 w-56 rounded-2xl border border-white/40 bg-white/90 p-2 text-sm shadow-xl backdrop-blur">
                  <Link
                    to="/profile"
                    className="flex items-center gap-2 rounded-xl px-3 py-2 text-slate-600 transition hover:bg-primary-500/10 hover:text-primary-600"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <User className="h-4 w-4" />
                    Profile
                  </Link>
                  {user?.role === 'SELLER' && (
                    <Link
                      to="/items/mine"
                      className="flex items-center gap-2 rounded-xl px-3 py-2 text-slate-600 transition hover:bg-primary-500/10 hover:text-primary-600"
                      onClick={() => setDropdownOpen(false)}
                    >
                      My Items
                    </Link>
                  )}
                  {user?.role === 'BUYER' && (
                    <Link
                      to="/bids"
                      className="flex items-center gap-2 rounded-xl px-3 py-2 text-slate-600 transition hover:bg-primary-500/10 hover:text-primary-600"
                      onClick={() => setDropdownOpen(false)}
                    >
                      My Bids
                    </Link>
                  )}
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-danger transition hover:bg-danger/10"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
