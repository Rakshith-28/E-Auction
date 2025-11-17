import { useState } from 'react';
import { Mail, Phone, Calendar, User, Eye, EyeOff } from 'lucide-react';
import { formatDateTime } from '../../utils/dateUtils.js';

const SellerContactCard = ({ seller, item }) => {
  const [showFullEmail, setShowFullEmail] = useState(false);
  const [showFullPhone, setShowFullPhone] = useState(false);

  if (!seller) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-purple-50 p-6 shadow-sm">
        <div className="border-l-4 border-purple-400 pl-4">
          <h3 className="text-lg font-semibold text-slate-900">Seller Information</h3>
          <p className="mt-2 text-sm text-slate-600">Seller details not available</p>
        </div>
      </div>
    );
  }

  const maskEmail = (email) => {
    if (!email) return 'Not provided';
    if (showFullEmail) return email;
    const [username, domain] = email.split('@');
    if (username.length <= 3) return email;
    return `${username.slice(0, 3)}***@${domain}`;
  };

  const maskPhone = (phone) => {
    if (!phone) return 'Not provided';
    if (showFullPhone) return phone;
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length < 10) return phone;
    return `+91 XXXXX XX${cleaned.slice(-3)}`;
  };

  const handleEmailClick = () => {
    if (seller.email) {
      window.location.href = `mailto:${seller.email}?subject=Inquiry about ${item?.title || 'your auction item'}`;
    }
  };

  const handlePhoneClick = () => {
    if (seller.phone) {
      window.location.href = `tel:${seller.phone}`;
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-gray-50 to-purple-50 p-6 shadow-sm">
      <div className="border-l-4 border-gradient-to-b from-purple-500 to-blue-500 pl-4">
        <div className="flex items-start justify-between">
          <h3 className="text-lg font-semibold text-slate-900">Seller Information</h3>
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-blue-500 text-white shadow-md">
            <User className="h-5 w-5" />
          </div>
        </div>

        <div className="mt-4 space-y-3">
          {/* Seller Name */}
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white shadow-sm">
              <User className="h-4 w-4 text-purple-600" />
            </div>
            <div className="flex-1">
              <div className="text-xs font-medium text-slate-500">Name</div>
              <div className="text-sm font-semibold text-slate-900">
                {seller.firstName && seller.lastName 
                  ? `${seller.firstName} ${seller.lastName}`
                  : seller.username || 'Anonymous Seller'}
              </div>
            </div>
          </div>

          {/* Email */}
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white shadow-sm">
              <Mail className="h-4 w-4 text-blue-600" />
            </div>
            <div className="flex-1">
              <div className="text-xs font-medium text-slate-500">Email</div>
              <div className="flex items-center gap-2">
                <div className="text-sm font-medium text-slate-900">
                  {maskEmail(seller.email)}
                </div>
                {seller.email && (
                  <button
                    onClick={() => setShowFullEmail(!showFullEmail)}
                    className="text-purple-600 hover:text-purple-700"
                    title={showFullEmail ? 'Hide email' : 'Show full email'}
                  >
                    {showFullEmail ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Phone */}
          {seller.phone && (
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white shadow-sm">
                <Phone className="h-4 w-4 text-green-600" />
              </div>
              <div className="flex-1">
                <div className="text-xs font-medium text-slate-500">Phone</div>
                <div className="flex items-center gap-2">
                  <div className="text-sm font-medium text-slate-900">
                    {maskPhone(seller.phone)}
                  </div>
                  <button
                    onClick={() => setShowFullPhone(!showFullPhone)}
                    className="text-purple-600 hover:text-purple-700"
                    title={showFullPhone ? 'Hide phone' : 'Show full phone'}
                  >
                    {showFullPhone ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Member Since */}
          {seller.createdAt && (
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white shadow-sm">
                <Calendar className="h-4 w-4 text-amber-600" />
              </div>
              <div className="flex-1">
                <div className="text-xs font-medium text-slate-500">Member since</div>
                <div className="text-sm font-medium text-slate-900">
                  {formatDateTime(seller.createdAt)}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-5 flex gap-2">
          {seller.email && (
            <button
              onClick={handleEmailClick}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-purple-200 bg-white px-4 py-2.5 text-sm font-semibold text-purple-700 shadow-sm transition hover:border-purple-300 hover:bg-purple-50"
            >
              <Mail className="h-4 w-4" />
              Contact Seller
            </button>
          )}
          {seller.phone && (
            <button
              onClick={handlePhoneClick}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-blue-200 bg-white px-4 py-2.5 text-sm font-semibold text-blue-700 shadow-sm transition hover:border-blue-300 hover:bg-blue-50"
            >
              <Phone className="h-4 w-4" />
              Call
            </button>
          )}
        </div>

        {/* Privacy Notice */}
        <div className="mt-4 rounded-lg border border-purple-200 bg-purple-50/50 p-3">
          <p className="text-xs text-purple-800">
            <span className="font-semibold">Privacy:</span> Contact information is masked by default. 
            Click the eye icon to reveal full details. Use responsibly.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SellerContactCard;
