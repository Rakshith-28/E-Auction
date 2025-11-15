import { useEffect, useState } from 'react';
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
import { useCart } from '../../context/CartContext';

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/auctions', label: 'Auctions' },
  { to: '/items/create', label: 'Sell Item', roles: ['SELLER', 'ADMIN'] },
  { to: '/admin', label: 'Admin', roles: ['ADMIN'] },
];

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [cartModalOpen, setCartModalOpen] = useState(false);
  const { cartCount, refreshCartCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    setDropdownOpen(false);
    logout();
    navigate('/');
  };

  const filteredLinks = NAV_LINKS.filter((link) => (!link.roles ? true : link.roles.includes(user?.role)));

  useEffect(() => {
    refreshCartCount();
  }, [isAuthenticated, refreshCartCount]);

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
            onClick={() => {
              if (!isAuthenticated) {
                setCartModalOpen(true);
              } else {
                navigate('/cart');
              }
            }}
            className="relative hidden h-10 w-10 items-center justify-center rounded-full border border-white/60 bg-white/60 text-slate-600 transition hover:border-primary-200 hover:text-primary-600 md:flex"
            aria-label="Shopping cart"
          >
            <ShoppingCart className="h-5 w-5" />
            <span className="absolute -right-1 -top-1 inline-flex h-4 min-w-[1rem] px-1 items-center justify-center rounded-full bg-primary-500 text-[10px] font-bold text-white">
              {cartCount}
            </span>
          </button>
          {isAuthenticated && <NotificationBell />}
          {isAuthenticated && (
            <Link
              to="/dashboard"
              className="hidden md:inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/60 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-primary-200 hover:text-primary-600"
            >
              Dashboard
            </Link>
          )}
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
                  {user?.roles?.includes('SELLER') && (
                    <Link
                      to="/items/mine"
                      className="flex items-center gap-2 rounded-xl px-3 py-2 text-slate-600 transition hover:bg-primary-500/10 hover:text-primary-600"
                      onClick={() => setDropdownOpen(false)}
                    >
                      My Items
                    </Link>
                  )}
                  {user?.roles?.includes('BUYER') && (
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

      {/* Cart Login Modal */}
      {cartModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm"
          onClick={() => setCartModalOpen(false)}
        >
          <div
            className="relative w-full max-w-md animate-fadeIn rounded-3xl border border-white/60 bg-white p-8 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setCartModalOpen(false)}
              className="absolute right-4 top-4 rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
              aria-label="Close modal"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="text-center">
              <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-full bg-gradient-to-br from-primary-500 to-secondary">
                <ShoppingCart className="h-8 w-8 text-white" />
              </div>

              <h3 className="mb-2 text-2xl font-semibold text-slate-900">Login Required</h3>
              <p className="mb-6 text-sm text-slate-600">
                You need to be logged in to view your cart. Please log in or create an account to continue.
              </p>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  to="/login"
                  onClick={() => setCartModalOpen(false)}
                  className="flex-1 rounded-full bg-gradient-to-r from-primary-500 to-secondary px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:shadow-xl"
                >
                  Login
                </Link>
                <button
                  type="button"
                  onClick={() => setCartModalOpen(false)}
                  className="flex-1 rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-primary-200 hover:text-primary-600"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
