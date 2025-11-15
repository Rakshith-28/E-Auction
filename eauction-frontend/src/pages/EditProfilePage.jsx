import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User, Mail, Phone, Home, MapPin, Calendar, Save, AlertTriangle,
  Eye, EyeOff, Check, X, Loader as LoaderIcon, Plus, Shield, ArrowLeft, XIcon, Camera
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { getCurrentUser, updateProfile, changePassword, deleteAccount, addRole } from '../services/userService';
import Toast from '../components/Common/Toast';

const EditProfilePage = () => {
  const { user: authUser, logout } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [userData, setUserData] = useState(null);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    phone: '',
    address: '',
    city: '',
    country: '',
    gender: '',
    dateOfBirth: '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [deleteConfirm, setDeleteConfirm] = useState('');
  const [deletePassword, setDeletePassword] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      const [data] = await getCurrentUser();
      if (data) {
        setUserData(data);
        setFormData({
          name: data.name || '',
          bio: data.bio || '',
          phone: data.phone || '',
          address: data.address || '',
          city: data.city || '',
          country: data.country || '',
          gender: data.gender || '',
          dateOfBirth: data.dateOfBirth || '',
        });
      }
      setLoading(false);
    };
    loadProfile();
  }, []);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePasswordChange = (e) => {
    setPasswordData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCancel = () => {
    navigate('/profile');
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    const [, error] = await updateProfile(formData);
    setSaving(false);
    if (error) {
      setToast({ type: 'error', title: 'Error', message: error });
    } else {
      setToast({ type: 'success', title: 'Success', message: 'Profile updated successfully!' });
      setTimeout(() => navigate('/profile'), 1500);
    }
  };

  const handleSubmitPasswordChange = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setToast({ type: 'error', title: 'Error', message: 'Passwords do not match' });
      return;
    }
    const [, error] = await changePassword({
      currentPassword: passwordData.currentPassword,
      newPassword: passwordData.newPassword,
    });
    if (error) {
      setToast({ type: 'error', title: 'Error', message: error });
    } else {
      setToast({ type: 'success', title: 'Success', message: 'Password changed successfully!' });
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setShowPasswordModal(false);
    }
  };

  const handleAddRole = async (role) => {
    const [, error] = await addRole(role);
    if (error) {
      setToast({ type: 'error', title: 'Error', message: error });
    } else {
      setToast({ type: 'success', title: 'Success', message: `${role} role added successfully!` });
      setTimeout(() => window.location.reload(), 1500);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirm !== 'DELETE') {
      setToast({ type: 'error', title: 'Error', message: 'Please type DELETE to confirm' });
      return;
    }
    const [, error] = await deleteAccount(deletePassword);
    if (error) {
      setToast({ type: 'error', title: 'Error', message: error });
    } else {
      setToast({ type: 'success', title: 'Account Deleted', message: 'Your account has been deleted' });
      setTimeout(() => {
        logout();
        navigate('/');
      }, 2000);
    }
  };

  const getPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;
    return strength;
  };

  const passwordStrength = getPasswordStrength(passwordData.newPassword);
  const passwordRequirements = [
    { label: 'At least 8 characters', met: passwordData.newPassword.length >= 8 },
    { label: 'One lowercase letter', met: /[a-z]/.test(passwordData.newPassword) },
    { label: 'One uppercase letter', met: /[A-Z]/.test(passwordData.newPassword) },
    { label: 'One number', met: /[0-9]/.test(passwordData.newPassword) },
    { label: 'One special character', met: /[^a-zA-Z0-9]/.test(passwordData.newPassword) },
  ];

  const getInitials = (name) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U';
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-surface via-white to-primary-50">
        <LoaderIcon className="h-8 w-8 animate-spin text-primary-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-surface via-white to-primary-50 pb-20">
      {/* Fixed Header Bar */}
      <div className="sticky top-0 z-40 border-b border-slate-200 bg-white shadow-sm">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
          <button
            onClick={handleCancel}
            className="flex items-center gap-2 text-slate-600 transition hover:text-slate-900"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="font-medium">Back</span>
          </button>
          <h1 className="text-xl font-bold text-slate-900">Edit Profile</h1>
          <button
            onClick={handleCancel}
            className="text-slate-400 transition hover:text-slate-600"
          >
            <XIcon className="h-6 w-6" />
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-8">
        {/* Profile Picture Section */}
        <div className="mb-8 flex flex-col items-center">
          <div className="relative">
            {userData?.profilePictureUrl ? (
              <img
                src={userData.profilePictureUrl}
                alt={userData.name}
                className="h-48 w-48 rounded-full border-8 border-white object-cover shadow-xl"
              />
            ) : (
              <div className="grid h-48 w-48 place-items-center rounded-full border-8 border-white bg-gradient-to-br from-primary-500 to-secondary text-6xl font-bold text-white shadow-xl">
                {getInitials(userData?.name)}
              </div>
            )}
            <button className="absolute bottom-2 right-2 rounded-full bg-primary-600 p-3 text-white shadow-lg transition hover:bg-primary-700">
              <Camera className="h-5 w-5" />
            </button>
          </div>
          <button className="mt-4 text-sm font-semibold text-primary-600 transition hover:text-primary-700">
            Change Photo
          </button>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-6">
          {/* Basic Information Card */}
          <Card title="Basic Information">
            <Input
              icon={User}
              label="Full Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter your full name"
            />

            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">Bio</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows={4}
                maxLength={500}
                placeholder="Tell others about yourself..."
                className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm focus:border-primary-500 focus:outline-none focus:ring-4 focus:ring-primary-100"
              />
              <p className="mt-1 text-right text-xs text-slate-500">{formData.bio.length} / 500</p>
            </div>

            <Input
              icon={Phone}
              label="Phone Number"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+1 (555) 000-0000"
            />

            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">Address</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows={2}
                placeholder="Street address"
                className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm focus:border-primary-500 focus:outline-none focus:ring-4 focus:ring-primary-100"
              />
            </div>
          </Card>

          {/* Location Card */}
          <Card title="Location">
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                icon={MapPin}
                label="City"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="City"
              />

              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">Country</label>
                <select
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className="h-12 w-full rounded-lg border border-slate-200 px-4 text-sm focus:border-primary-500 focus:outline-none focus:ring-4 focus:ring-primary-100"
                >
                  <option value="">Select country</option>
                  <option value="United States">United States</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="Canada">Canada</option>
                  <option value="Australia">Australia</option>
                  <option value="India">India</option>
                  <option value="Germany">Germany</option>
                  <option value="France">France</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">Gender</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="h-12 w-full rounded-lg border border-slate-200 px-4 text-sm focus:border-primary-500 focus:outline-none focus:ring-4 focus:ring-primary-100"
                >
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </div>

              <Input
                icon={Calendar}
                label="Date of Birth"
                name="dateOfBirth"
                type="date"
                value={formData.dateOfBirth}
                onChange={handleChange}
              />
            </div>
          </Card>

          {/* Account Information Card */}
          <Card title="Account Information">
            <div className="space-y-3 rounded-lg bg-slate-50 p-4">
              <InfoRow
                icon={Mail}
                label="Email"
                value={
                  <div className="flex items-center gap-2">
                    <span>{userData?.email}</span>
                    {userData?.emailVerified && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-700">
                        <Check className="h-3 w-3" />
                        Verified
                      </span>
                    )}
                  </div>
                }
              />
              <InfoRow
                icon={Calendar}
                label="Member Since"
                value={new Date(userData?.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              />
              <InfoRow
                icon={Shield}
                label="Current Roles"
                value={
                  <div className="flex flex-wrap gap-2">
                    {userData?.roles?.map(role => (
                      <span
                        key={role}
                        className="inline-flex items-center gap-1 rounded-full bg-primary-100 px-3 py-1 text-xs font-semibold text-primary-700"
                      >
                        {role}
                      </span>
                    ))}
                  </div>
                }
              />
            </div>

            {/* Add Role Buttons */}
            <div className="space-y-3">
              {!userData?.roles?.includes('BUYER') && (
                <button
                  type="button"
                  onClick={() => handleAddRole('BUYER')}
                  className="flex w-full items-center gap-2 rounded-lg border-2 border-dashed border-blue-300 bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-700 transition hover:border-blue-400 hover:bg-blue-100"
                >
                  <Plus className="h-4 w-4" />
                  Add Buyer Role
                </button>
              )}

              {!userData?.roles?.includes('SELLER') && (
                <button
                  type="button"
                  onClick={() => handleAddRole('SELLER')}
                  className="flex w-full items-center gap-2 rounded-lg border-2 border-dashed border-green-300 bg-green-50 px-4 py-3 text-sm font-semibold text-green-700 transition hover:border-green-400 hover:bg-green-100"
                >
                  <Plus className="h-4 w-4" />
                  Add Seller Role
                </button>
              )}
            </div>
          </Card>

          {/* Security Card */}
          <Card title="Security">
            <button
              type="button"
              onClick={() => setShowPasswordModal(true)}
              className="w-full rounded-lg bg-slate-100 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
            >
              Change Password
            </button>
          </Card>

          {/* Danger Zone Card */}
          <Card title="Permanently Delete Account" className="border-2 border-red-200">
            <div className="rounded-lg border border-red-200 bg-red-50 p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                <div className="flex-1">
                  <h3 className="font-semibold text-red-900">Delete Account</h3>
                  <p className="mt-1 text-sm text-red-700">
                    This action cannot be undone. All your data will be permanently deleted.
                  </p>
                  <button
                    type="button"
                    onClick={() => setShowDeleteModal(true)}
                    className="mt-3 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
                  >
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          </Card>

          {/* Bottom Action Buttons */}
          <div className="sticky bottom-0 z-30 flex gap-3 border-t border-slate-200 bg-white/95 px-4 py-4 backdrop-blur sm:static sm:border-0 sm:bg-transparent sm:px-0 sm:backdrop-blur-none">
            <button
              type="button"
              onClick={handleCancel}
              className="flex-1 rounded-full border-2 border-slate-300 bg-white px-6 py-3 font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 sm:flex-initial"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-primary-600 to-secondary px-8 py-3 font-semibold text-white shadow-lg transition hover:shadow-xl disabled:opacity-60"
            >
              {saving ? <LoaderIcon className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>

      {/* Change Password Modal */}
      {showPasswordModal && (
        <Modal onClose={() => setShowPasswordModal(false)}>
          <h2 className="text-2xl font-bold text-slate-900">Change Password</h2>
          <p className="mt-2 text-sm text-slate-600">
            Enter your current password and choose a new strong password.
          </p>

          <form onSubmit={handleSubmitPasswordChange} className="mt-6 space-y-4">
            <PasswordInput
              label="Current Password"
              name="currentPassword"
              value={passwordData.currentPassword}
              onChange={handlePasswordChange}
              show={showPasswords.current}
              onToggle={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
              required
            />

            <PasswordInput
              label="New Password"
              name="newPassword"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              show={showPasswords.new}
              onToggle={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
              required
            />

            {passwordData.newPassword && (
              <div className="space-y-2">
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map(level => (
                    <div
                      key={level}
                      className={`h-2 flex-1 rounded-full transition-all ${
                        level <= passwordStrength
                          ? passwordStrength <= 2
                            ? 'bg-red-500'
                            : passwordStrength <= 4
                            ? 'bg-orange-500'
                            : 'bg-green-500'
                          : 'bg-slate-200'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-xs text-slate-600">
                  Strength: {passwordStrength <= 2 ? 'Weak' : passwordStrength <= 4 ? 'Medium' : 'Strong'}
                </p>
                <div className="space-y-1">
                  {passwordRequirements.map((req, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs">
                      {req.met ? (
                        <Check className="h-4 w-4 text-green-600" />
                      ) : (
                        <X className="h-4 w-4 text-slate-400" />
                      )}
                      <span className={req.met ? 'text-green-700' : 'text-slate-600'}>{req.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <PasswordInput
              label="Confirm New Password"
              name="confirmPassword"
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange}
              show={showPasswords.confirm}
              onToggle={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
              required
            />

            {passwordData.confirmPassword && (
              <div className="flex items-center gap-2 text-sm">
                {passwordData.newPassword === passwordData.confirmPassword ? (
                  <>
                    <Check className="h-5 w-5 text-green-600" />
                    <span className="text-green-700">Passwords match</span>
                  </>
                ) : (
                  <>
                    <X className="h-5 w-5 text-red-600" />
                    <span className="text-red-700">Passwords do not match</span>
                  </>
                )}
              </div>
            )}

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setShowPasswordModal(false)}
                className="flex-1 rounded-lg border-2 border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 rounded-lg bg-gradient-to-r from-primary-600 to-secondary px-4 py-2 text-sm font-semibold text-white transition hover:shadow-lg"
              >
                Change Password
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <Modal onClose={() => setShowDeleteModal(false)}>
          <h2 className="text-2xl font-bold text-red-900">Delete Account?</h2>
          <p className="mt-3 text-sm text-slate-700">
            This will permanently delete your account, all listings, bids, and transaction history. This action cannot be undone.
          </p>

          <div className="mt-6 space-y-4">
            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
                Type <span className="font-mono text-red-600">DELETE</span> to confirm
              </label>
              <input
                type="text"
                value={deleteConfirm}
                onChange={e => setDeleteConfirm(e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-4 py-2 text-sm focus:border-red-500 focus:outline-none focus:ring-4 focus:ring-red-100"
                placeholder="DELETE"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">Password</label>
              <input
                type="password"
                value={deletePassword}
                onChange={e => setDeletePassword(e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-4 py-2 text-sm focus:border-red-500 focus:outline-none focus:ring-4 focus:ring-red-100"
                placeholder="Enter your password"
              />
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <button
              onClick={() => setShowDeleteModal(false)}
              className="flex-1 rounded-lg border-2 border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteAccount}
              disabled={deleteConfirm !== 'DELETE' || !deletePassword}
              className="flex-1 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-50"
            >
              Delete Account
            </button>
          </div>
        </Modal>
      )}

      {toast && <Toast type={toast.type} title={toast.title} message={toast.message} />}
    </div>
  );
};

const Card = ({ title, children, className = '' }) => (
  <div className={`rounded-2xl border border-slate-200 bg-white p-6 shadow-sm ${className}`}>
    <h2 className="mb-6 text-xl font-bold text-slate-900">{title}</h2>
    <div className="space-y-4">{children}</div>
  </div>
);

const Input = ({ icon: Icon, label, ...props }) => (
  <div>
    <label className="mb-2 block text-sm font-bold text-slate-700">{label}</label>
    <div className="relative">
      {Icon && <Icon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />}
      <input
        {...props}
        className={`h-12 w-full rounded-lg border border-slate-200 ${Icon ? 'pl-10' : 'pl-4'} pr-4 text-sm focus:border-primary-500 focus:outline-none focus:ring-4 focus:ring-primary-100`}
      />
    </div>
  </div>
);

const PasswordInput = ({ label, show, onToggle, ...props }) => (
  <div>
    <label className="mb-2 block text-sm font-bold text-slate-700">{label}</label>
    <div className="relative">
      <input
        {...props}
        type={show ? 'text' : 'password'}
        className="h-12 w-full rounded-lg border border-slate-200 px-4 pr-12 text-sm focus:border-primary-500 focus:outline-none focus:ring-4 focus:ring-primary-100"
      />
      <button
        type="button"
        onClick={onToggle}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-600"
      >
        {show ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
      </button>
    </div>
  </div>
);

const InfoRow = ({ icon: Icon, label, value }) => (
  <div className="flex items-start gap-3">
    <Icon className="mt-0.5 h-5 w-5 text-slate-500" />
    <div className="flex-1">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
      <div className="mt-1 text-sm text-slate-900">{value}</div>
    </div>
  </div>
);

const Modal = ({ children, onClose }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
    <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
      {children}
    </div>
  </div>
);

export default EditProfilePage;
