const SkeletonCard = () => (
  <div className="animate-pulse rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
    <div className="mb-4 h-48 rounded-xl bg-slate-200" />
    <div className="mb-2 h-4 w-3/4 rounded bg-slate-200" />
    <div className="mb-4 h-3 w-1/2 rounded bg-slate-200" />
    <div className="flex items-center justify-between">
      <div className="h-3 w-20 rounded bg-slate-200" />
      <div className="h-8 w-24 rounded-full bg-slate-200" />
    </div>
  </div>
);

export default SkeletonCard;
