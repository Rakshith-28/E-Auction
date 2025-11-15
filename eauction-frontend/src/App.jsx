import { Navigate, Route, Routes } from 'react-router-dom';
import MainLayout from './components/Layout/MainLayout.jsx';
import ProtectedRoute from './components/Common/ProtectedRoute.jsx';
import HomePage from './pages/HomePage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import AuctionsPage from './pages/AuctionsPage.jsx';
import AuctionDetailsPage from './pages/AuctionDetailsPage.jsx';
import CreateItemPage from './pages/CreateItemPage.jsx';
import EditItemPage from './pages/EditItemPage.jsx';
import MyItemsPage from './pages/MyItemsPage.jsx';
import ReceivedBidsPage from './pages/ReceivedBidsPage.jsx';
import SoldItemsPage from './pages/SoldItemsPage.jsx';
import MyBidsPage from './pages/MyBidsPage.jsx';
import WonItemsPage from './pages/WonItemsPage.jsx';
import BidHistoryPage from './pages/BidHistoryPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import AdminDashboardPage from './pages/AdminDashboardPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import BrowseItemsPage from './pages/BrowseItemsPage.jsx';
import ItemDetailsPage from './pages/ItemDetailsPage.jsx';
import WatchlistPage from './pages/WatchlistPage.jsx';
import NotificationCenterPage from './pages/NotificationCenterPage.jsx';
import CartPage from './pages/CartPage.jsx';

const App = () => (
  <Routes>
    <Route element={<MainLayout />}>
      <Route index element={<HomePage />} />
      <Route path="auctions" element={<AuctionsPage />} />
      <Route path="auctions/:id" element={<AuctionDetailsPage />} />
      <Route path="items" element={<BrowseItemsPage />} />
      <Route path="items/:id" element={<ItemDetailsPage />} />

      <Route element={<ProtectedRoute />}> 
        <Route path="profile" element={<ProfilePage />} />
        <Route path="bids" element={<MyBidsPage />} />
        <Route path="my-bids" element={<MyBidsPage />} />
        <Route path="won-items" element={<WonItemsPage />} />
        <Route path="bid-history" element={<BidHistoryPage />} />
        <Route path="watchlist" element={<WatchlistPage />} />
        <Route path="notifications" element={<NotificationCenterPage />} />
        <Route path="cart" element={<CartPage />} />
      </Route>

      <Route element={<ProtectedRoute roles={['SELLER', 'ADMIN']} />}>
        <Route path="items/create" element={<CreateItemPage />} />
        <Route path="items/mine" element={<MyItemsPage />} />
        <Route path="items/:id/edit" element={<EditItemPage />} />
        {/* Seller routes aliases */}
        <Route path="sell/create" element={<CreateItemPage />} />
        <Route path="sell/listings" element={<MyItemsPage />} />
        <Route path="sell/bids" element={<ReceivedBidsPage />} />
        <Route path="sell/sold" element={<SoldItemsPage />} />
      </Route>

      <Route element={<ProtectedRoute roles={['ADMIN']} />}>
        <Route path="admin" element={<AdminDashboardPage />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route path="dashboard" element={<DashboardPage />} />
      </Route>
    </Route>

    <Route path="login" element={<LoginPage />} />
    <Route path="register" element={<RegisterPage />} />
    <Route path="logout" element={<Navigate to="/" replace />} />
    <Route path="*" element={<NotFoundPage />} />
  </Routes>
);

export default App;
