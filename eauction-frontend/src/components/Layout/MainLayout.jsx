import { Outlet } from 'react-router-dom';
import Navbar from './Navbar.jsx';
import Footer from './Footer.jsx';
import { CartProvider } from '../../context/CartContext.jsx';

const MainLayout = () => (
  <CartProvider>
    <div className="flex min-h-screen flex-col bg-surface text-slate-900">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  </CartProvider>
);

export default MainLayout;
