import { Package, Search, Inbox } from 'lucide-react';

const EmptyState = ({ type = 'items', message, actionLabel, onAction }) => {
  const icons = {
    items: Package,
    bids: Search,
    notifications: Inbox,
  };

  const Icon = icons[type] || Package;

  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center rounded-3xl border-2 border-dashed border-slate-200 bg-gradient-to-br from-slate-50 to-white p-12 text-center">
      <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-indigo-50 to-purple-50">
        <Icon className="h-12 w-12 text-indigo-400" />
      </div>
      <h3 className="mb-2 text-xl font-semibold text-slate-900">
        {message || 'Nothing here yet'}
      </h3>
      <p className="mb-6 max-w-sm text-sm text-slate-600">
        Start exploring our marketplace or adjust your filters to find what you're looking for.
      </p>
      {onAction && actionLabel && (
        <button
          onClick={onAction}
          className="rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:shadow-xl"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
