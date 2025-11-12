import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PageContainer from '../components/Common/PageContainer.jsx';
import Loader from '../components/Common/Loader.jsx';
import { getItem, updateItem } from '../services/itemService.js';

const EditItemPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formState, setFormState] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchItem = async () => {
      setLoading(true);
      const [data, fetchError] = await getItem(id);

      if (fetchError) {
        setError(fetchError);
      } else if (data) {
        setFormState({
          title: data.title ?? '',
          description: data.description ?? '',
          category: data.category ?? '',
          imageUrl: data.imageUrl ?? '',
          minimumBid: data.minimumBid?.toString() ?? '',
          auctionStartTime: data.auctionStartTime ? new Date(data.auctionStartTime).toISOString().slice(0, 16) : '',
          auctionEndTime: data.auctionEndTime ? new Date(data.auctionEndTime).toISOString().slice(0, 16) : '',
        });
      }

      setLoading(false);
    };

    fetchItem();
  }, [id]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState((prev) => (prev ? { ...prev, [name]: value } : prev));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!formState) return;

    setError(null);
    setSaving(true);

    const payload = {
      ...formState,
      minimumBid: Number.parseFloat(formState.minimumBid),
      auctionStartTime: formState.auctionStartTime ? new Date(formState.auctionStartTime).toISOString() : null,
      auctionEndTime: formState.auctionEndTime ? new Date(formState.auctionEndTime).toISOString() : null,
    };

    const [, updateError] = await updateItem(id, payload);

    setSaving(false);

    if (updateError) {
      setError(updateError);
      return;
    }

    navigate('/items/mine');
  };

  if (loading || !formState) {
    return (
      <PageContainer title="Update item">
        <Loader label="Loading item" />
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title="Update item"
      subtitle="Adjust the listing details before the auction goes live."
    >
      <form className="mx-auto grid w-full max-w-3xl gap-6 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm" onSubmit={handleSubmit}>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="md:col-span-2">
            <label htmlFor="title" className="block text-sm font-medium text-slate-700">
              Item title
            </label>
            <input
              id="title"
              name="title"
              value={formState.title}
              onChange={handleChange}
              className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label htmlFor="description" className="block text-sm font-medium text-slate-700">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              value={formState.description}
              onChange={handleChange}
              className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
              required
            />
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-slate-700">
              Category
            </label>
            <input
              id="category"
              name="category"
              value={formState.category}
              onChange={handleChange}
              className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
              required
            />
          </div>

          <div>
            <label htmlFor="imageUrl" className="block text-sm font-medium text-slate-700">
              Image URL
            </label>
            <input
              id="imageUrl"
              name="imageUrl"
              value={formState.imageUrl}
              onChange={handleChange}
              className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
            />
          </div>

          <div>
            <label htmlFor="minimumBid" className="block text-sm font-medium text-slate-700">
              Minimum bid ($)
            </label>
            <input
              id="minimumBid"
              name="minimumBid"
              type="number"
              min="0"
              step="0.01"
              value={formState.minimumBid}
              onChange={handleChange}
              className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
              required
            />
          </div>

          <div>
            <label htmlFor="auctionStartTime" className="block text-sm font-medium text-slate-700">
              Auction start time
            </label>
            <input
              id="auctionStartTime"
              name="auctionStartTime"
              type="datetime-local"
              value={formState.auctionStartTime}
              onChange={handleChange}
              className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
            />
          </div>

          <div>
            <label htmlFor="auctionEndTime" className="block text-sm font-medium text-slate-700">
              Auction end time
            </label>
            <input
              id="auctionEndTime"
              name="auctionEndTime"
              type="datetime-local"
              value={formState.auctionEndTime}
              onChange={handleChange}
              className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
              required
            />
          </div>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-indigo-200 hover:text-indigo-600"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {saving ? 'Updating…' : 'Save changes'}
          </button>
        </div>
      </form>
    </PageContainer>
  );
};

export default EditItemPage;
