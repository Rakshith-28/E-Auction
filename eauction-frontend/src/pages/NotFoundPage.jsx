import { Link } from 'react-router-dom';
import { Home, Search } from 'lucide-react';

const NotFoundPage = () => (
  <div className="flex min-h-[80vh] items-center justify-center bg-gradient-to-br from-slate-50 to-white px-4">
    <div className="w-full max-w-lg text-center animate-fadeIn">
      {/* 404 Illustration */}
      <div className="mb-8 inline-flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br from-indigo-100 to-purple-100">
        <span className="text-6xl font-bold gradient-text">404</span>
      </div>

      <h1 className="mb-4 text-4xl font-bold text-slate-900">Oops! Page Not Found</h1>
      <p className="mb-8 text-lg text-slate-600">
        The page you're looking for doesn't exist or has been moved.
      </p>

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Link
          to="/"
          className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3 font-semibold text-white shadow-lg transition hover:shadow-xl hover:scale-105"
        >
          <Home className="h-5 w-5" />
          Go to Homepage
        </Link>
        <Link
          to="/items"
          className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-indigo-200 bg-white px-6 py-3 font-semibold text-indigo-700 transition hover:border-indigo-300 hover:bg-indigo-50"
        >
          <Search className="h-5 w-5" />
          Browse Auctions
        </Link>
      </div>
    </div>
  </div>
);

export default NotFoundPage;
