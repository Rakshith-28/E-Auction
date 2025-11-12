import { useEffect, useState } from 'react';
import PageContainer from '../components/Common/PageContainer.jsx';
import Loader from '../components/Common/Loader.jsx';
import { useAuth } from '../hooks/useAuth.js';
import { updateProfile } from '../services/userService.js';

const ProfilePage = () => {
  const { user, refresh, loading } = useAuth();
  const [formState, setFormState] = useState({ name: '', phone: '', address: '' });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      setFormState({
        name: user.name ?? '',
        phone: user.phone ?? '',
        address: user.address ?? '',
      });
    }
  }, [user]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError(null);
    setMessage(null);

    const [, updateError] = await updateProfile(formState);

    setSaving(false);

    if (updateError) {
      setError(updateError);
      return;
    }

    await refresh();
    setMessage('Profile updated successfully.');
  };

  if (loading) {
    return (
      <PageContainer title="Profile">
        <Loader label="Loading profile" />
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title="Profile"
      subtitle="Manage your personal details and contact information."
    >
      <form className="mx-auto w-full max-w-2xl space-y-6 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm" onSubmit={handleSubmit}>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500">
            Account email
          </label>
          <p className="mt-1 text-sm text-slate-700">{user?.email}</p>
        </div>

        <div>
          <label htmlFor="name" className="block text-sm font-medium text-slate-700">
            Full name
          </label>
          <input
            id="name"
            name="name"
            value={formState.name}
            onChange={handleChange}
            className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
            required
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-slate-700">
            Phone number
          </label>
          <input
            id="phone"
            name="phone"
            value={formState.phone}
            onChange={handleChange}
            className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
          />
        </div>

        <div>
          <label htmlFor="address" className="block text-sm font-medium text-slate-700">
            Address
          </label>
          <textarea
            id="address"
            name="address"
            rows={3}
            value={formState.address}
            onChange={handleChange}
            className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
          />
        </div>

        {message && <p className="text-sm text-green-600">{message}</p>}
        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="flex items-center justify-end gap-3">
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {saving ? 'Saving…' : 'Save changes'}
          </button>
        </div>
      </form>
    </PageContainer>
  );
};

export default ProfilePage;
