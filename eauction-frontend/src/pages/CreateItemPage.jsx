import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageContainer from '../components/Common/PageContainer.jsx';
import { createItem } from '../services/itemService.js';

const INITIAL_FORM = {
  title: '',
  description: '',
  category: '',
  imageUrl: '',
  minimumBid: '',
  auctionStartTime: '',
  auctionEndTime: '',
};

const CreateItemPage = () => {
  const navigate = useNavigate();
  const [formState, setFormState] = useState(INITIAL_FORM);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const payload = {
      ...formState,
      minimumBid: Number.parseFloat(formState.minimumBid),
      auctionStartTime: formState.auctionStartTime ? new Date(formState.auctionStartTime).toISOString() : null,
      auctionEndTime: formState.auctionEndTime ? new Date(formState.auctionEndTime).toISOString() : null,
    };

    if (payload.auctionStartTime && payload.auctionEndTime) {
      if (new Date(payload.auctionEndTime) <= new Date(payload.auctionStartTime)) {
        setLoading(false);
        setError('Auction end time must be after the start time.');
        return;
      }
    }

    const [item, createError] = await createItem(payload);

    setLoading(false);

    if (createError) {
      setError(createError);
      return;
    }

    if (item?.id) {
      navigate(`/auctions/${item.auctionId ?? ''}`);
    } else {
      navigate('/items/mine');
    }
  };

  return (
    <PageContainer
      title="List a new item"
      subtitle="Provide auction details to publish your item."
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
            disabled={loading}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? 'Publishing…' : 'Publish item'}
          </button>
        </div>
      </form>
    </PageContainer>
  );
};

export default CreateItemPage;
