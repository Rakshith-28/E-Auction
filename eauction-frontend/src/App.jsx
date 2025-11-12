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
import MyBidsPage from './pages/MyBidsPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import AdminDashboardPage from './pages/AdminDashboardPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';

const App = () => (
  <Routes>
    <Route element={<MainLayout />}>
      <Route index element={<HomePage />} />
      <Route path="auctions" element={<AuctionsPage />} />
      <Route path="auctions/:id" element={<AuctionDetailsPage />} />

      <Route element={<ProtectedRoute />}>
        <Route path="profile" element={<ProfilePage />} />
        <Route path="bids" element={<MyBidsPage />} />
      </Route>

      <Route element={<ProtectedRoute roles={['SELLER', 'ADMIN']} />}>
        <Route path="items/create" element={<CreateItemPage />} />
        <Route path="items/mine" element={<MyItemsPage />} />
        <Route path="items/:id/edit" element={<EditItemPage />} />
      </Route>

      <Route element={<ProtectedRoute roles={['ADMIN']} />}>
        <Route path="admin" element={<AdminDashboardPage />} />
      </Route>
    </Route>

    <Route path="login" element={<LoginPage />} />
    <Route path="register" element={<RegisterPage />} />
    <Route path="logout" element={<Navigate to="/" replace />} />
    <Route path="*" element={<NotFoundPage />} />
  </Routes>
);

export default App;
