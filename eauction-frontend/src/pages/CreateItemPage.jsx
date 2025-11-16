import { useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageContainer from '../components/Common/PageContainer.jsx';
import { createItem } from '../services/itemService.js';
import { uploadImages } from '../services/uploadService.js';
import CreateItemConfirmationModal from '../components/Item/CreateItemConfirmationModal.jsx';
import Toast from '../components/Common/Toast.jsx';
import {
  PackagePlus,
  Type as TypeIcon,
  AlignLeft,
  Tags,
  DollarSign,
  Calendar,
  Clock,
  ImagePlus,
  Info,
  Loader2,
  CheckCircle2,
} from 'lucide-react';

const INITIAL_FORM = {
  title: '',
  description: '',
  category: '',
  minimumBid: '',
  auctionStartTime: '',
  auctionEndTime: '',
  imageUrl: '', // For testing: paste a real image URL here
};

const CATEGORIES = [
  { value: 'Electronics', label: 'Electronics' },
  { value: 'Fashion', label: 'Fashion' },
  { value: 'Collectibles', label: 'Collectibles' },
  { value: 'Home', label: 'Home' },
  { value: 'Sports', label: 'Sports' },
  { value: 'Other', label: 'Other' },
];

const CreateItemPage = () => {
  const navigate = useNavigate();
  const [formState, setFormState] = useState(INITIAL_FORM);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [errors, setErrors] = useState({});
  const [images, setImages] = useState([]); // {file, url}
  const [success, setSuccess] = useState(false);
  const dropRef = useRef(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingItem, setPendingItem] = useState(null);
  const [toast, setToast] = useState(null);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
    setErrors((e) => ({ ...e, [name]: undefined }));
  };

  const requiredFilled = useMemo(() => {
    const { title, description, category, minimumBid, auctionEndTime } = formState;
    let n = 0;
    if (title) n++; if (description) n++; if (category) n++; if (minimumBid) n++; if (auctionEndTime) n++;
    return n;
  }, [formState]);

  const progress = useMemo(() => Math.round((requiredFilled / 5) * 100), [requiredFilled]);

  const onFilesSelected = (fileList) => {
    if (!fileList?.length) return;
    const arr = Array.from(fileList).slice(0, 6);
    const next = [];
    arr.forEach((file) => {
      const url = URL.createObjectURL(file);
      next.push({ file, url });
    });
    setImages((prev) => [...prev, ...next].slice(0, 6));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const files = e.dataTransfer?.files;
    onFilesSelected(files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    // simple client validation
    const nextErrors = {};
    if (!formState.title) nextErrors.title = 'Title is required';
    if (!formState.description) nextErrors.description = 'Description is required';
    if (!formState.category) nextErrors.category = 'Category is required';
    if (!formState.minimumBid || Number(formState.minimumBid) <= 0) nextErrors.minimumBid = 'Enter a valid minimum bid';
    if (!formState.auctionEndTime) nextErrors.auctionEndTime = 'End time is required';

    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      // trigger shake on form card
      dropRef.current?.classList.add('animate-shake');
      setTimeout(() => dropRef.current?.classList.remove('animate-shake'), 400);
      return;
    }

    const startTime = formState.auctionStartTime
      ? new Date(formState.auctionStartTime).toISOString()
      : new Date().toISOString();

    const payload = {
      title: formState.title,
      description: formState.description,
      category: formState.category,
      minimumBid: Number.parseFloat(formState.minimumBid),
      auctionStartTime: startTime,
      auctionEndTime: formState.auctionEndTime ? new Date(formState.auctionEndTime).toISOString() : null,
    };

    if (payload.auctionStartTime && payload.auctionEndTime) {
      if (new Date(payload.auctionEndTime) <= new Date(payload.auctionStartTime)) {
        setError('Auction end time must be after the start time.');
        return;
      }
    }

    // Upload images if any
    if (images.length > 0) {
      setLoading(true);
      const files = images.map(img => img.file);
      const [uploadResult, uploadError] = await uploadImages(files);
      setLoading(false);
      
      if (uploadError) {
        setError('Failed to upload images: ' + uploadError);
        setToast({ type: 'error', title: 'Upload Failed', message: uploadError });
        return;
      }
      
      if (uploadResult?.urls && uploadResult.urls.length > 0) {
        payload.images = uploadResult.urls;
        payload.imageUrl = uploadResult.urls[0]; // Set first image as main
      }
    }

    // Show confirmation modal
    setPendingItem({ ...payload, previewImage: images[0]?.url });
    setConfirmOpen(true);
  };

  const confirmCreateItem = async () => {
    if (!pendingItem) return false;
    setLoading(true);
    console.log('[CreateItem] Sending payload:', pendingItem);
    const [item, createError] = await createItem(pendingItem);
    setLoading(false);

    if (createError) {
      console.error('[CreateItem] API Error:', createError);
      setError(createError);
      setToast({ type: 'error', title: 'Listing Failed', message: createError });
      setConfirmOpen(false);
      setPendingItem(null);
      return false;
    }

    setToast({ type: 'success', title: 'Listing Created', message: 'Your auction is now live!' });
    setConfirmOpen(false);
    setPendingItem(null);
    setSuccess(true);

    if (item?.id) {
      setTimeout(() => navigate(`/auctions/${item.id}`), 1200);
    } else {
      setTimeout(() => navigate('/items/mine'), 1200);
    }
    return true;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-surface via-white to-primary-50">
      <div className="mx-auto w-full max-w-4xl px-4 py-10">
        {/* Header */}
        <header className="mb-6 flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-primary-600 to-secondary text-white shadow-lg">
            <PackagePlus className="h-6 w-6" />
          </div>
          <div>
            <h1 className="bg-gradient-to-r from-primary-600 to-secondary bg-clip-text text-3xl font-extrabold text-transparent">
              List a new item
            </h1>
            <p className="text-sm text-slate-600">Provide auction details to publish your item.</p>
          </div>
        </header>

        {/* Progress */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Completion</span><span>{progress}%</span>
          </div>
          <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-slate-200/70">
            <div className="h-full rounded-full bg-gradient-to-r from-primary-600 to-secondary transition-[width] duration-300" style={{ width: `${progress}%` }} />
          </div>
        </div>

        {/* Form Card */}
        <form ref={dropRef} onSubmit={handleSubmit} className="relative mx-auto grid w-full gap-6 rounded-2xl border border-white/60 bg-white/95 p-6 shadow-xl backdrop-blur-md md:p-8">
          {/* Title */}
          <div className="grid gap-6 md:grid-cols-2">
            <div className="md:col-span-2">
              <div className={`relative ${errors.title ? 'has-error' : ''}`}>
                <TypeIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  id="title"
                  name="title"
                  value={formState.title}
                  onChange={handleChange}
                  className="peer h-12 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-sm outline-none transition focus:border-primary-500 focus:ring-4 focus:ring-primary-100"
                  placeholder=" "
                  required
                />
                <label htmlFor="title" className="pointer-events-none absolute left-9 top-1/2 -translate-y-1/2 bg-white px-1 text-xs text-slate-500 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:-top-2 peer-focus:text-xs peer-focus:text-primary-600">Item title</label>
                {errors.title && <p className="mt-1 flex items-center gap-1 text-xs text-red-600"><Info className="h-3.5 w-3.5" />{errors.title}</p>}
              </div>
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <div className={`relative ${errors.description ? 'has-error' : ''}`}>
                <AlignLeft className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <textarea
                  id="description"
                  name="description"
                  rows={5}
                  value={formState.description}
                  onChange={handleChange}
                  placeholder="Tell buyers about your item..."
                  className="mt-0 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 pt-2 text-sm outline-none transition focus:border-primary-500 focus:ring-4 focus:ring-primary-100"
                  required
                />
                <div className="mt-1 flex items-center justify-between text-xs text-slate-500">
                  <span>{formState.description.length} / 600</span>
                  <span>Be descriptive yet concise</span>
                </div>
                {errors.description && <p className="mt-1 flex items-center gap-1 text-xs text-red-600"><Info className="h-3.5 w-3.5" />{errors.description}</p>}
              </div>
            </div>

            {/* Category */}
            <div>
              <div className={`relative ${errors.category ? 'has-error' : ''}`}>
                <Tags className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <select
                  id="category"
                  name="category"
                  value={formState.category}
                  onChange={handleChange}
                  className="h-12 w-full appearance-none rounded-xl border border-slate-200 bg-white pl-9 pr-10 text-sm outline-none transition focus:border-primary-500 focus:ring-4 focus:ring-primary-100"
                  required
                >
                  <option value="" disabled>Select a category</option>
                  {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">▾</span>
                {errors.category && <p className="mt-1 flex items-center gap-1 text-xs text-red-600"><Info className="h-3.5 w-3.5" />{errors.category}</p>}
              </div>
            </div>

            {/* Minimum Bid */}
            <div>
              <div className={`relative ${errors.minimumBid ? 'has-error' : ''}`}>
                <DollarSign className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  id="minimumBid"
                  name="minimumBid"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formState.minimumBid}
                  onChange={handleChange}
                  placeholder="Minimum bid ($)"
                  className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-sm outline-none transition focus:border-primary-500 focus:ring-4 focus:ring-primary-100"
                  required
                />
                {errors.minimumBid && <p className="mt-1 flex items-center gap-1 text-xs text-red-600"><Info className="h-3.5 w-3.5" />{errors.minimumBid}</p>}
              </div>
            </div>

            {/* Start Time */}
            <div>
              <div className="relative">
                <Calendar className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  id="auctionStartTime"
                  name="auctionStartTime"
                  type="datetime-local"
                  value={formState.auctionStartTime}
                  onChange={handleChange}
                  className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-sm outline-none transition focus:border-primary-500 focus:ring-4 focus:ring-primary-100"
                />
              </div>
            </div>

            {/* End Time */}
            <div>
              <div className={`relative ${errors.auctionEndTime ? 'has-error' : ''}`}>
                <Clock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  id="auctionEndTime"
                  name="auctionEndTime"
                  type="datetime-local"
                  value={formState.auctionEndTime}
                  onChange={handleChange}
                  className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-sm outline-none transition focus:border-primary-500 focus:ring-4 focus:ring-primary-100"
                  required
                />
                {errors.auctionEndTime && <p className="mt-1 flex items-center gap-1 text-xs text-red-600"><Info className="h-3.5 w-3.5" />{errors.auctionEndTime}</p>}
              </div>
            </div>
          </div>

          {/* Upload Zone */}
          <section
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className="rounded-2xl border-2 border-dashed border-slate-300/80 bg-slate-50/60 p-5 transition hover:border-primary-300 hover:bg-primary-50/30"
          >
            <div className="flex flex-col items-center justify-center text-center">
              <ImagePlus className="h-8 w-8 text-slate-400" />
              <p className="mt-2 text-sm text-slate-600">Drag and drop images here, or</p>
              <label className="mt-2 inline-block cursor-pointer rounded-full bg-gradient-to-r from-primary-600 to-secondary px-4 py-2 text-sm font-semibold text-white shadow hover:shadow-lg">
                Upload Images
                <input type="file" className="hidden" accept="image/*" multiple onChange={(e) => onFilesSelected(e.target.files)} />
              </label>
              <p className="mt-1 text-xs text-slate-500">Up to 6 images. First image will be used as the cover.</p>
            </div>

            {images.length > 0 && (
              <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
                {images.map((img, idx) => (
                  <div key={img.url} className="group relative aspect-square overflow-hidden rounded-xl border border-slate-200 bg-white">
                    <img src={img.url} alt={`preview-${idx}`} className="h-full w-full object-cover transition group-hover:scale-105" />
                    <button
                      type="button"
                      onClick={() => setImages((prev) => prev.filter((x) => x.url !== img.url))}
                      className="absolute right-2 top-2 rounded-full bg-black/50 px-2 text-xs text-white opacity-0 transition group-hover:opacity-100"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>

          {error && <p className="-mt-2 text-sm text-red-600">{error}</p>}

          {/* Actions */}
          <div className="mt-2 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-end">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Reset / Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-primary-600 to-secondary px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
            >
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : null}
              {loading ? 'Publishing…' : 'Create Listing'}
            </button>
          </div>

          {/* Success pulse */}
          {success && (
            <div className="pointer-events-none absolute inset-0 grid place-items-center rounded-2xl bg-white/60">
              <div className="grid h-16 w-16 place-items-center rounded-full bg-green-100 text-green-600 shadow">
                <CheckCircle2 className="h-8 w-8" />
              </div>
            </div>
          )}
        </form>

        {toast && <Toast type={toast.type} title={toast.title} message={toast.message} />}

        <CreateItemConfirmationModal
          isOpen={confirmOpen}
          onClose={() => { setConfirmOpen(false); setPendingItem(null); }}
          itemData={pendingItem}
          onConfirm={confirmCreateItem}
        />
      </div>
    </div>
  );
};

export default CreateItemPage;
