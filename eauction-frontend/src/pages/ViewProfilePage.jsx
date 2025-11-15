import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Calendar, MapPin, Mail, Phone, Home, Edit,
  TrendingUp, Package, Gavel, Award, Shield, User as UserIcon
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { getCurrentUser, getUserById, getUserStats } from '../services/userService';
import Loader from '../components/Common/Loader';
import TypingQuote from '../components/Common/TypingQuote';
import { formatDateTime } from '../utils/dateUtils';

const ViewProfilePage = () => {
  const { userId } = useParams();
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('about');

  const isOwnProfile = !userId || userId === currentUser?.id;

  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);
      if (isOwnProfile) {
        const [userData] = await getCurrentUser();
        const [statsData] = await getUserStats();
        if (userData) setUser(userData);
        if (statsData) setStats(statsData);
      } else {
        const [userData] = await getUserById(userId);
        if (userData) setUser(userData);
      }
      setLoading(false);
    };
    loadProfile();
  }, [userId, isOwnProfile]);

  if (loading) {
    return <div className="min-h-screen bg-gradient-to-br from-surface via-white to-primary-50 px-4 py-10"><Loader label="Loading profile..." /></div>;
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-surface via-white to-primary-50 px-4 py-10">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-lg text-slate-600">User not found</p>
        </div>
      </div>
    );
  }

  const getInitials = (name) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-surface via-white to-primary-50">
      {/* Header Banner */}
        <div className="relative h-80 bg-gradient-to-r from-primary-600 via-purple-600 to-secondary overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yIDItNCA0LTRzNCАyIDQgNC0yIDQtNCA0LTQtMi00LTR6bTAtMTBjMC0yIDItNCA0LTRzNCАyIDQgNC0yIDQtNCA0LTQtMi00LTR6bTAgMTBjMC0yIDItNCA0LTRzNCAyIDQgNC0yIDQtNCA0LTQtMi00LTR6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>
          <TypingQuote className="absolute left-1/2 -translate-x-1/2 top-[28%] z-10" />
      </div>

      {/* Profile Card */}
        <div className="mx-auto max-w-5xl px-4 -mt-40">
        <div className="rounded-3xl border border-white/60 bg-white/95 p-8 shadow-2xl backdrop-blur">
          {/* Profile Picture & Name */}
          <div className="flex flex-col items-center text-center">
            <div className="relative">
              {user.profilePictureUrl ? (
                <img
                  src={user.profilePictureUrl}
                  alt={user.name}
                  className="h-40 w-40 rounded-full border-8 border-white object-cover shadow-xl"
                />
              ) : (
                <div className="grid h-40 w-40 place-items-center rounded-full border-8 border-white bg-gradient-to-br from-primary-500 to-secondary text-5xl font-bold text-white shadow-xl">
                  {getInitials(user.name)}
                </div>
              )}
            </div>

            <h1 className="mt-6 text-4xl font-bold text-slate-900">{user.name}</h1>
            
            {user.bio && (
              <p className="mt-3 max-w-2xl text-slate-600">{user.bio}</p>
            )}

            {/* Member Since & Location */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-sm text-slate-500">
              {user.createdAt && (
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>Member since {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                </div>
              )}
              {(user.city || user.country) && (
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>{[user.city, user.country].filter(Boolean).join(', ')}</span>
                </div>
              )}
            </div>

            {/* Role Badges */}
            <div className="mt-4 flex flex-wrap gap-2 justify-center">
              {user.roles?.includes('BUYER') && (
                <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-4 py-1.5 text-sm font-semibold text-blue-700">
                  <Award className="h-4 w-4" />
                  Buyer
                </span>
              )}
              {user.roles?.includes('SELLER') && (
                <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-4 py-1.5 text-sm font-semibold text-green-700">
                  <Package className="h-4 w-4" />
                  Seller
                </span>
              )}
              {user.roles?.includes('ADMIN') && (
                <span className="inline-flex items-center gap-1 rounded-full bg-purple-100 px-4 py-1.5 text-sm font-semibold text-purple-700">
                  <Shield className="h-4 w-4" />
                  Admin
                </span>
              )}
            </div>

            {/* Action Buttons */}
            {isOwnProfile && (
                <div className="mt-6 flex justify-center">
                <button
                  onClick={() => navigate('/profile/edit')}
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary-600 to-secondary px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:shadow-xl"
                >
                  <Edit className="h-4 w-4" />
                  Edit Profile
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Statistics */}
        {isOwnProfile && stats && (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard icon={Gavel} label="Total Bids" value={stats.totalBids} color="blue" />
            <StatCard icon={Package} label="Items Listed" value={stats.itemsListed} color="green" />
            <StatCard icon={Award} label="Items Won" value={stats.itemsWon} color="purple" />
            <StatCard icon={TrendingUp} label="Items Sold" value={stats.itemsSold} color="orange" />
          </div>
        )}

        {/* Tabs */}
        <div className="mt-8">
          <div className="flex gap-2 border-b border-slate-200">
            {['about', 'contact'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`rounded-t-lg px-6 py-3 text-sm font-semibold transition ${
                  activeTab === tab
                    ? 'border-b-2 border-primary-600 text-primary-600'
                    : 'text-slate-600 hover:text-primary-600'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          <div className="mt-6">
            {activeTab === 'about' && (
              <div className="space-y-6">
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h2 className="text-xl font-semibold text-slate-900 mb-4">About</h2>
                  {user.bio ? (
                    <p className="text-slate-700 leading-relaxed">{user.bio}</p>
                  ) : (
                    <p className="text-sm text-slate-500 italic">No bio provided</p>
                  )}
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h2 className="text-xl font-semibold text-slate-900 mb-4">Account Details</h2>
                  <div className="space-y-3">
                    <DetailRow icon={UserIcon} label="Account ID" value={user.id} />
                    <DetailRow icon={Calendar} label="Member Since" value={formatDateTime(user.createdAt)} />
                    <DetailRow
                      icon={Shield}
                      label="Status"
                      value={
                        <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                          {user.accountStatus || 'Active'}
                        </span>
                      }
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'contact' && (
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-xl font-semibold text-slate-900 mb-4">Contact Information</h2>
                <div className="space-y-3">
                  <DetailRow icon={Mail} label="Email" value={user.email} />
                  <DetailRow icon={Phone} label="Phone" value={user.phone || 'Not provided'} />
                  <DetailRow icon={Home} label="Address" value={user.address || 'Not provided'} />
                  {(user.city || user.country) && (
                    <DetailRow
                      icon={MapPin}
                      label="Location"
                      value={[user.city, user.country].filter(Boolean).join(', ')}
                    />
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon: Icon, label, value, color }) => {
  const colorMap = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    orange: 'bg-orange-100 text-orange-600',
  };

  return (
    <article className="rounded-2xl border border-white/60 bg-white/90 p-6 shadow-lg backdrop-blur transition hover:shadow-xl">
      <div className="flex items-center gap-4">
        <div className={`grid h-14 w-14 place-items-center rounded-full ${colorMap[color]}`}>
          <Icon className="h-7 w-7" />
        </div>
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-1 text-3xl font-bold text-slate-900">{value}</p>
        </div>
      </div>
    </article>
  );
};

const DetailRow = ({ icon: Icon, label, value }) => (
  <div className="flex items-start gap-3">
    <Icon className="mt-0.5 h-5 w-5 text-slate-400" />
    <div className="flex-1">
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p className="mt-1 text-slate-900">{value}</p>
    </div>
  </div>
);

export default ViewProfilePage;
