import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PageContainer from '../components/Common/PageContainer.jsx';
import Loader from '../components/Common/Loader.jsx';
import { deleteItem, getMyItems } from '../services/itemService.js';

const MyItemsPage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchItems = async () => {
    setLoading(true);
    const [data, fetchError] = await getMyItems();

    if (fetchError) {
      setError(fetchError);
    } else if (data) {
      setItems(data);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    const [, deleteError] = await deleteItem(id);

    if (deleteError) {
      setError(deleteError);
      return;
    }

    fetchItems();
  };

  if (loading) {
    return (
      <PageContainer title="My listings">
        <Loader label="Loading items" />
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title="My listings"
      subtitle="Manage the items you have published for auction."
    >
      {error && <p className="text-sm text-red-600">{error}</p>}
      {items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center text-slate-600">
          <p className="text-lg font-semibold text-slate-700">You have not listed any items yet.</p>
          <p className="mt-2 text-sm">Create your first listing to start an auction.</p>
          <Link
            to="/items/create"
            className="mt-6 inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700"
          >
            List an item
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <article key={item.id} className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">{item.title}</h2>
                <p className="mt-2 max-w-2xl text-sm text-slate-600">{item.description}</p>
                <dl className="mt-3 flex flex-wrap gap-4 text-xs text-slate-500">
                  <div>
                    <dt className="font-medium text-slate-900">Category</dt>
                    <dd className="mt-1 capitalize">{item.category}</dd>
                  </div>
                  <div>
                    <dt className="font-medium text-slate-900">Minimum bid</dt>
                    <dd className="mt-1">${item.minimumBid?.toFixed?.(2) ?? '0.00'}</dd>
                  </div>
                  <div>
                    <dt className="font-medium text-slate-900">Status</dt>
                    <dd className="mt-1">{item.status ?? 'DRAFT'}</dd>
                  </div>
                </dl>
              </div>
              <div className="flex flex-col gap-2 md:items-end">
                <Link
                  to={`/items/${item.id}/edit`}
                  className="inline-flex items-center justify-center rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-indigo-200 hover:text-indigo-600"
                >
                  Edit listing
                </Link>
                <button
                  type="button"
                  onClick={() => handleDelete(item.id)}
                  className="inline-flex items-center justify-center rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 transition hover:border-red-300 hover:text-red-700"
                >
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </PageContainer>
  );
};

export default MyItemsPage;
