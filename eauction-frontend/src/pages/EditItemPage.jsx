import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PageContainer from '../components/Common/PageContainer.jsx';
import Loader from '../components/Common/Loader.jsx';
import { getItem, updateItem } from '../services/itemService.js';

const CATEGORIES = [
  { value: 'Electronics', label: '📱 Electronics' },
  { value: 'Computers', label: '💻 Computers & Laptops' },
  { value: 'Mobile', label: '📱 Mobile Phones & Tablets' },
  { value: 'Fashion', label: '👗 Fashion & Apparel' },
  { value: 'Jewelry', label: '💍 Jewelry & Watches' },
  { value: 'Collectibles', label: '🎨 Collectibles & Art' },
  { value: 'Home', label: '🏠 Home & Garden' },
  { value: 'Furniture', label: '🛋️ Furniture' },
  { value: 'Appliances', label: '🔌 Home Appliances' },
  { value: 'Kitchen', label: '🍳 Kitchen & Dining' },
  { value: 'Sports', label: '⚽ Sports & Fitness' },
  { value: 'Outdoor', label: '🏕️ Outdoor & Camping' },
  { value: 'Music', label: '🎸 Musical Instruments' },
  { value: 'Books', label: '📚 Books & Media' },
  { value: 'Toys', label: '🧸 Toys & Games' },
  { value: 'Automotive', label: '🚗 Automotive & Vehicles' },
  { value: 'Tools', label: '🔧 Tools & Hardware' },
  { value: 'Health', label: '💊 Health & Beauty' },
  { value: 'Baby', label: '👶 Baby & Kids' },
  { value: 'Pets', label: '🐾 Pet Supplies' },
  { value: 'Office', label: '📎 Office Supplies' },
  { value: 'Groceries', label: '🛒 Daily Needs & Groceries' },
  { value: 'Other', label: '📦 Other' },
];

const EditItemPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formState, setFormState] = useState(null);
  const [originalTimes, setOriginalTimes] = useState({ start: '', end: '' });
  const [meta, setMeta] = useState({ totalBids: 0, status: '', currentBid: 0 });
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
        const startStr = data.auctionStartTime ? new Date(data.auctionStartTime).toISOString().slice(0, 16) : '';
        const endStr = data.auctionEndTime ? new Date(data.auctionEndTime).toISOString().slice(0, 16) : '';
        // Data is already in INR from backend
        const minimumBidInr = data.minimumBid ? data.minimumBid : 0;
        setFormState({
          title: data.title ?? '',
          description: data.description ?? '',
          category: data.category ?? '',
          imageUrl: data.imageUrl ?? '',
          minimumBid: minimumBidInr.toString(),
          auctionStartTime: startStr,
          auctionEndTime: endStr,
        });
        setOriginalTimes({ start: startStr, end: endStr });
        setMeta({ totalBids: data.totalBids ?? 0, status: data.status ?? '', currentBid: data.currentBid ?? 0 });
      }

      setLoading(false);
    };

    fetchItem();
  }, [id]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState((prev) => (prev ? { ...prev, [name]: value } : prev));
  };

  const auctionStarted = originalTimes.start && new Date(originalTimes.start) <= new Date();
  const bidsExist = meta.totalBids > 0;
  const canEditTimes = !auctionStarted && !bidsExist;

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!formState) return;

    setError(null);
    setSaving(true);

    // Submit INR value directly, no conversion needed
    const minimumBidInr = Number.parseFloat(formState.minimumBid);

    const payload = {
      title: formState.title,
      description: formState.description,
      category: formState.category,
      imageUrl: formState.imageUrl,
      minimumBid: minimumBidInr,
    };

    // Only include times if user changed and backend rules allow
    const startChanged = formState.auctionStartTime !== originalTimes.start;
    const endChanged = formState.auctionEndTime !== originalTimes.end;
    const includeTimes = canEditTimes && (startChanged || endChanged);
    if (includeTimes) {
      // Only send the fields that changed to avoid validation issues
      if (startChanged && formState.auctionStartTime) {
        payload.auctionStartTime = new Date(formState.auctionStartTime).toISOString();
      }
      if (endChanged && formState.auctionEndTime) {
        payload.auctionEndTime = new Date(formState.auctionEndTime).toISOString();
      }
      if (payload.auctionStartTime && payload.auctionEndTime) {
        if (new Date(payload.auctionEndTime) <= new Date(payload.auctionStartTime)) {
          setSaving(false);
          setError('Auction end time must be after the start time.');
          return;
        }
      }
    }

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
      subtitle="Adjust listing details. Auction times can only change before start and with no bids."
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
            <select
              id="category"
              name="category"
              value={formState.category}
              onChange={handleChange}
              className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
              required
            >
              <option value="">Select a category</option>
              {CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
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
              Minimum bid (₹)
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
              disabled={!canEditTimes}
              className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 disabled:cursor-not-allowed disabled:opacity-60"
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
              disabled={!canEditTimes}
              className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 disabled:cursor-not-allowed disabled:opacity-60"
              required
            />
          </div>
        </div>

        {!canEditTimes && (
          <p className="text-xs font-medium text-amber-600">Auction times are locked because the auction has started or bids already exist.</p>
        )}
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
