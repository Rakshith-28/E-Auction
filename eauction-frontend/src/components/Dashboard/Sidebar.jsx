import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  ChevronDown,
  ChevronUp,
  ShoppingBag,
  Gavel,
  Trophy,
  History,
  Heart,
  Store,
  Plus,
  List,
  DollarSign,
  CheckCircle,
  BarChart2,
  User,
  Settings,
  Bell as BellIcon,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { addRole } from '../../services/userService';
import Toast from '../Common/Toast';

const Section = ({ title, icon: Icon, isOpen, onToggle, children }) => (
  <div className="rounded-xl border border-slate-200 bg-white/90 shadow-sm">
    <button
      onClick={onToggle}
      className="flex w-full items-center justify-between px-4 py-3 text-left"
    >
      <span className="flex items-center gap-3 text-sm font-semibold text-slate-800">
        <span className="grid h-8 w-8 place-items-center rounded-full bg-primary-50 text-primary-600">
          <Icon className="h-4 w-4" />
        </span>
        {title}
      </span>
      {isOpen ? <ChevronUp className="h-4 w-4 text-slate-500" /> : <ChevronDown className="h-4 w-4 text-slate-500" />}
    </button>
    <div
      className={`overflow-hidden transition-[max-height] duration-300 ${isOpen ? 'max-h-96' : 'max-h-0'}`}
    >
      <div className="border-t border-slate-200 px-2 py-2">
        {children}
      </div>
    </div>
  </div>
);

const MenuItem = ({ to, icon: Icon, label, active, onClick, disabled, badgeCount }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition ${
      active
        ? 'bg-primary-50 font-semibold text-primary-700'
        : 'text-slate-700 hover:bg-slate-100'
    } ${disabled ? 'cursor-not-allowed opacity-60' : ''}`}
  >
    <Icon className="h-4 w-4" />
    <span className="relative inline-block">
      {label}
      {badgeCount > 0 && (
        <span
          className="absolute -right-2 -top-2 grid h-5 w-5 place-items-center rounded-full bg-red-500 text-[11px] font-bold text-white shadow animate-pulse"
          aria-label={`${badgeCount} pending payments`}
        >
          {badgeCount}
        </span>
      )}
    </span>
  </button>
);

const Sidebar = ({ wonUnpaid = 0 }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isBuyer, isSeller, user, roles } = useAuth();
  const [open, setOpen] = useState({ buy: true, sell: isSeller });
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const timer = toast ? setTimeout(() => setToast(null), 3500) : null;
    return () => timer && clearTimeout(timer);
  }, [toast]);

  const activePath = location.pathname;

  const onlyBuyer = isBuyer && !isSeller;
  const onlySeller = isSeller && !isBuyer;

  const handleAddRole = async (role) => {
    const [data, error] = await addRole(role);
    if (error) {
      setToast({ type: 'error', title: 'Role update failed', message: error });
    } else {
      setToast({ type: 'success', title: 'Role added', message: `You are now a ${role}.` });
      // Reload page or let parent refresh user context on next API call
      setTimeout(() => window.location.reload(), 800);
    }
  };

  const buyItems = useMemo(() => ([
    { to: '/dashboard?tab=buy', icon: ShoppingBag, label: 'Dashboard (Buy)' },
    { to: '/items', icon: ShoppingBag, label: 'Browse Items' },
    { to: '/my-bids', icon: Gavel, label: 'My Active Bids' },
    { to: '/won-items', icon: Trophy, label: 'Won Items' },
    { to: '/bid-history', icon: History, label: 'Bid History' },
    { to: '/watchlist', icon: Heart, label: 'Watchlist' },
  ]), []);

  const sellItems = useMemo(() => ([
    { to: '/dashboard?tab=sell', icon: Store, label: 'Dashboard (Sell)' },
    { to: '/sell/create', icon: Plus, label: 'Create Listing' },
    { to: '/sell/listings', icon: List, label: 'My Listings' },
    { to: '/sell/bids', icon: DollarSign, label: 'Received Bids' },
    { to: '/sell/sold', icon: CheckCircle, label: 'Sold Items' },
    { to: '/sell/analytics', icon: BarChart2, label: 'Analytics', disabled: true },
  ]), []);

  // Removed Profile section as per new design

  const renderMenu = (items) => (
    <ul className="space-y-1">
      {items.map((item) => (
        <li key={item.label}>
          <MenuItem
            to={item.to}
            icon={item.icon}
            label={item.label}
            badgeCount={item.label === 'Won Items' ? wonUnpaid : 0}
            active={
              item.to.startsWith('/dashboard?tab=')
                ? (activePath === '/dashboard' && location.search.includes(item.to.split('=')[1]))
                : activePath === item.to
            }
            disabled={item.disabled}
            onClick={() => (item.action ? item.action() : navigate(item.to))}
          />
        </li>
      ))}
    </ul>
  );

  return (
    <aside className="w-64 shrink-0">
      <div className="sticky top-24 space-y-3 rounded-2xl border border-white/60 bg-white/90 p-3 shadow-lg backdrop-blur">
        <div className="mb-2 border-b border-slate-200 pb-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Navigation</p>
          <p className="mt-1 text-sm text-slate-700">Welcome, {user?.name}</p>
        </div>

        {isBuyer && (
          <Section
            title="Buy"
            icon={ShoppingBag}
            isOpen={open.buy}
            onToggle={() => setOpen((s) => ({ ...s, buy: !s.buy }))}
          >
            {renderMenu(buyItems)}
          </Section>
        )}

        {isSeller && (
          <Section
            title="Sell"
            icon={Store}
            isOpen={open.sell}
            onToggle={() => setOpen((s) => ({ ...s, sell: !s.sell }))}
          >
            {renderMenu(sellItems)}
          </Section>
        )}

      </div>

      {toast && <Toast type={toast.type} title={toast.title} message={toast.message} />}
    </aside>
  );
};

export default Sidebar;
