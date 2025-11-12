import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PageContainer from '../components/Common/PageContainer.jsx';
import { register as registerRequest } from '../services/authService.js';

const INITIAL_FORM_STATE = {
  name: '',
  email: '',
  password: '',
  role: 'BUYER',
  phone: '',
  address: '',
};

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formState, setFormState] = useState(INITIAL_FORM_STATE);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const [, registerError] = await registerRequest(formState);

    setLoading(false);

    if (registerError) {
      setError(registerError);
      return;
    }

    navigate('/login', { state: { registered: true } });
  };

  return (
    <PageContainer
      title="Create your account"
      subtitle="Register as a buyer or seller to participate in auctions."
    >
      <div className="mx-auto w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <form className="grid gap-6 md:grid-cols-2" onSubmit={handleSubmit}>
          <div className="md:col-span-2">
            <label htmlFor="name" className="block text-sm font-medium text-slate-700">
              Full name
            </label>
            <input
              id="name"
              name="name"
              value={formState.name}
              onChange={handleChange}
              className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formState.email}
              onChange={handleChange}
              className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-700">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={formState.password}
              onChange={handleChange}
              minLength={6}
              className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
              required
            />
          </div>

          <div>
            <label htmlFor="role" className="block text-sm font-medium text-slate-700">
              Account type
            </label>
            <select
              id="role"
              name="role"
              value={formState.role}
              onChange={handleChange}
              className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
            >
              <option value="BUYER">Buyer</option>
              <option value="SELLER">Seller</option>
            </select>
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
              className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
            />
          </div>

          <div className="md:col-span-2">
            <label htmlFor="address" className="block text-sm font-medium text-slate-700">
              Address
            </label>
            <textarea
              id="address"
              name="address"
              rows={3}
              value={formState.address}
              onChange={handleChange}
              className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
            />
          </div>

          {error && (
            <p className="md:col-span-2 text-sm text-red-600">{error}</p>
          )}

          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? 'Creating account…' : 'Create account'}
            </button>
          </div>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-indigo-600 hover:text-indigo-700">
            Sign in
          </Link>
        </p>
      </div>
    </PageContainer>
  );
};

export default RegisterPage;
