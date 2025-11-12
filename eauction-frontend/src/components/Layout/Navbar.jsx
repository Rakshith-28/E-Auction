import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const filteredLinks = NAV_LINKS.filter((link) => {
    if (!link.roles) return true;
    return link.roles.includes(user?.role);
  });

  return (
    <header className="bg-white shadow">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-4">
          <button
            type="button"
            className="rounded-md p-2 text-slate-600 md:hidden"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label="Toggle navigation"
          >
            <span className="sr-only">Toggle navigation</span>
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <Link to="/" className="text-lg font-semibold text-indigo-600">
            eAuction
          </Link>
        </div>

        <nav className={`${menuOpen ? 'flex' : 'hidden'} absolute left-0 top-full z-10 w-full flex-col gap-2 bg-white px-4 pb-4 pt-2 shadow-md md:static md:flex md:w-auto md:flex-row md:items-center md:gap-6 md:bg-transparent md:p-0 md:shadow-none`}>
          {filteredLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `rounded px-3 py-2 text-sm font-medium transition hover:bg-indigo-50 hover:text-indigo-600 ${
                  isActive ? 'bg-indigo-100 text-indigo-700' : 'text-slate-700'
                }`
              }
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {isAuthenticated && <NotificationBell />}
          {!isAuthenticated ? (
            <div className="flex items-center gap-2">
              <Link to="/login" className="rounded-md px-3 py-2 text-sm font-medium text-slate-600 hover:text-indigo-600">
                Login
              </Link>
              <Link to="/register" className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-700">
                Register
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/profile" className="rounded-md px-3 py-2 text-sm font-medium text-slate-600 hover:text-indigo-600">
                {user?.name ?? 'Profile'}
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-md bg-slate-100 px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-200"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
