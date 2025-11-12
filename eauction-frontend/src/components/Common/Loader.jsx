const Loader = ({ label = 'Loading' }) => (
  <div className="flex items-center justify-center py-12">
    <span className="sr-only">{label}</span>
    <span className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />
  </div>
);

export default Loader;
