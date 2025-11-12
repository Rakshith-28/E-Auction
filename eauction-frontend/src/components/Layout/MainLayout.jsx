import { Outlet } from 'react-router-dom';
import Navbar from './Navbar.jsx';

const MainLayout = () => (
  <div className="flex min-h-screen flex-col bg-surface text-slate-900">
    <Navbar />
    <main className="flex-1">
      <Outlet />
    </main>
    <footer className="border-t border-slate-200 bg-white py-6">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">
        <p>&copy; {new Date().getFullYear()} eAuction. All rights reserved.</p>
        <p className="flex items-center gap-1">
          Built with
          <span aria-hidden>⚡</span>
          by the eAuction team
        </p>
      </div>
    </footer>
  </div>
);

export default MainLayout;
