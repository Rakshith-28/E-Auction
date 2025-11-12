import { useEffect, useState } from 'react';
import { getNotifications, markAsRead } from '../../services/notificationService.js';

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const unreadCount = notifications.filter((notification) => !notification.read).length;

  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true);
      const [data, fetchError] = await getNotifications();

      if (fetchError) {
        setError(fetchError);
      } else if (data) {
        setNotifications(data);
      }

      setLoading(false);
    };

    fetchNotifications();
  }, []);

  const handleMarkAllRead = async () => {
    const unread = notifications.filter((notification) => !notification.read);

    if (unread.length === 0) return;

    try {
      await Promise.all(unread.map((notification) => markAsRead(notification.id)));
      setNotifications((prev) => prev.map((notification) => ({ ...notification, read: true })));
    } catch (markError) {
      setError(markError.message ?? 'Failed to update notifications');
    }
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
    <div className="relative">
      <button
        type="button"
        onClick={handleMarkAllRead}
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
    </div>
  );
};

export default NotificationBell;
