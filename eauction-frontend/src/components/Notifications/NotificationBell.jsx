import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getNotifications, getUnreadCount, markAsRead, markAllRead, deleteNotification } from '../../services/notificationService.js';
import { usdToInr } from '../../utils/currencyUtils.js';
import { formatDateTime } from '../../utils/dateUtils.js';

const NotificationBell = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);
  const [unreadExternal, setUnreadExternal] = useState(0);
  const unreadCountLocal = notifications.filter((n) => !n.read).length;
  const unreadCount = unreadExternal || unreadCountLocal;

  useEffect(() => {
    let active = true;
    const fetchAll = async () => {
      const [pageData] = await getNotifications({ page: 0, size: 10 });
      const [countData] = await getUnreadCount();
      if (!active) return;
      if (pageData) setNotifications(pageData.content ? pageData.content : pageData);
      if (countData) setUnreadExternal(countData.count || 0);
      setLoading(false);
    };
    setLoading(true);
    fetchAll();
    const interval = setInterval(fetchAll, 30000);
    return () => { active = false; clearInterval(interval); };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

  const handleMarkAllRead = async () => {
    try {
      await markAllRead();
      setNotifications((prev) => prev.map(n => ({ ...n, read: true })));
      setUnreadExternal(0);
    } catch (e) {
      setError(e.message || 'Failed to mark all read');
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await markAsRead(id);
      setNotifications((prev) => prev.map((notification) => (
        notification.id === id ? { ...notification, read: true } : notification
      )));
    } catch (markError) {
      setError(markError.message ?? 'Failed to update notifications');
    }
  };

  const renderMessage = (raw) => {
    const msg = raw || '';
    return msg.replace(/\$(\d+(?:\.\d+)?)/g, (_, num) => {
      const inr = usdToInr(parseFloat(num));
      return `₹${inr.toFixed(2)}`;
    });
  };

  if (error) {
    return <button type="button" className="relative rounded-full p-2 text-red-600" title={error}>
      <span className="sr-only">Notifications error</span>
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L4.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    </button>;
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex h-10 w-10 items-center justify-center rounded-full text-slate-600 transition hover:bg-slate-100"
        aria-label="Notifications"
      >
        {loading ? (
          <span className="h-5 w-5 animate-spin rounded-full border-2 border-indigo-200 border-t-indigo-600" />
        ) : (
          <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V4a2 2 0 10-4 0v1.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        )}
      </button>
      {unreadCount > 0 && (
        <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-red-500 px-1 text-xs font-semibold text-white">
          {unreadCount}
        </span>
      )}

      {open && (
        <div className="absolute right-0 z-20 mt-2 w-72 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
            <p className="text-sm font-semibold text-slate-900">Notifications</p>
            <button
              type="button"
              onClick={handleMarkAllRead}
              className="text-xs font-semibold uppercase tracking-wide text-indigo-600 hover:text-indigo-700"
            >
              Mark all read
            </button>
          </div>
          <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
            {notifications.length === 0 ? (
              <p className="px-4 py-6 text-center text-sm text-slate-500">No notifications yet.</p>
            ) : (
              notifications.map((notification) => (
                <div 
                  key={notification.id} 
                  className={`flex items-start gap-3 px-4 py-3 ${notification.actionUrl ? 'cursor-pointer hover:bg-slate-50' : ''}`}
                  onClick={() => {
                    if (notification.actionUrl) {
                      navigate(notification.actionUrl);
                      setOpen(false);
                      if (!notification.read) handleMarkAsRead(notification.id);
                    }
                  }}
                >
                  <span className={`mt-1 h-2 w-2 rounded-full shrink-0 ${notification.read ? 'bg-slate-300' : 'bg-indigo-500'}`} />
                  <div className="flex-1 text-sm text-slate-600">
                    <p className="font-medium text-slate-900">{notification.title ?? 'Update'}</p>
                    <p className="mt-1 text-slate-600">{renderMessage(notification.message ?? notification.body)}</p>
                    <p className="mt-2 text-xs text-slate-400">{formatDateTime(notification.createdAt)}</p>
                  </div>
                  <div className="flex shrink-0 gap-1" onClick={(e) => e.stopPropagation()}>
                    {!notification.read && (
                      <button
                        type="button"
                        onClick={() => handleMarkAsRead(notification.id)}
                        className="rounded-md border border-slate-200 px-2 py-1 text-xs font-semibold uppercase tracking-wide text-slate-600 transition hover:border-indigo-200 hover:text-indigo-600"
                      >
                        ✓
                      </button>
                    )}
                    {notification.read && (
                      <button
                        type="button"
                        onClick={async () => { await deleteNotification(notification.id); setNotifications(prev => prev.filter(n => n.id !== notification.id)); }}
                        className="rounded-md border border-slate-200 px-2 py-1 text-xs font-semibold uppercase tracking-wide text-slate-400 transition hover:border-red-200 hover:text-red-600"
                      >
                        ×
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="border-t border-slate-100 px-4 py-2 text-center">
            <button
              type="button"
              onClick={() => { navigate('/notifications'); setOpen(false); }}
              className="text-xs font-semibold uppercase tracking-wide text-indigo-600 hover:text-indigo-700"
            >
              View All Notifications
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
