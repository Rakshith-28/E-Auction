import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  Lock,
  Mail,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import Navbar from '../components/Layout/Navbar.jsx';
import Footer from '../components/Layout/Footer.jsx';
import Spinner from '../components/Common/Spinner.jsx';
import Toast from '../components/Common/Toast.jsx';
import { useAuth } from '../hooks/useAuth.js';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loginWithGoogle, loading, error } = useAuth();
  const [formState, setFormState] = useState({ email: '', password: '' });
  const [fieldErrors, setFieldErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [toast, setToast] = useState(null);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (location.state?.registered) {
      setToast({
        type: 'success',
        title: 'Account ready',
        message: 'Sign in with your new credentials to explore premium auctions.',
      });
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  useEffect(() => {
    if (!error) {
      return;
    }
    setToast({ type: 'error', title: 'Unable to sign in', message: error });
  }, [error]);

  useEffect(() => {
    if (!toast) {
      return undefined;
    }
    const timer = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(timer);
  }, [toast]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const validate = () => {
    const errors = {};
    if (!formState.email.trim()) {
      errors.email = 'Email is required.';
    } else if (!EMAIL_REGEX.test(formState.email.trim())) {
      errors.email = 'Enter a valid email address.';
    }

    if (!formState.password.trim()) {
      errors.password = 'Password is required.';
    }

    setFieldErrors(errors);

    if (Object.keys(errors).length) {
      setToast({
        type: 'error',
        title: 'Check your details',
        message: 'Please correct the highlighted fields to continue.',
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) {
      return;
    }

    const [data, loginError] = await login(formState);

    if (loginError) {
      setToast({
        type: 'error',
        title: 'Unable to sign in',
        message: loginError,
      });
      return;
    }

    if (rememberMe && data?.token) {
      sessionStorage.setItem('eauction_last_login', new Date().toISOString());
    }

    const redirectTo = location.state?.from?.pathname ?? '/profile';
    navigate(redirectTo, { replace: true });
  };

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  const isEmailValid = EMAIL_REGEX.test(formState.email.trim());
  const isPasswordFilled = formState.password.trim().length >= 6;

  const handleGoogleSignIn = async () => {
    setToast(null);
    setFieldErrors({});
    setGoogleLoading(true);
    const [data, googleError] = await loginWithGoogle();
    setGoogleLoading(false);

    if (googleError) {
      setToast({
        type: 'error',
        title: 'Unable to sign in',
        message: googleError,
      });
      return;
    }

    if (rememberMe && data?.token) {
      sessionStorage.setItem('eauction_last_login', new Date().toISOString());
    }

    const redirectTo = location.state?.from?.pathname ?? '/profile';
    navigate(redirectTo, { replace: true });
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-surface via-white to-primary-50 text-slate-900">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-24 top-16 h-80 w-80 rounded-full bg-primary-200/50 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-secondary/20 blur-3xl" />
      </div>

      <Navbar />
      {toast && <Toast type={toast.type} title={toast.title} message={toast.message} />}

      <main className="relative flex-1">
        <section className="mx-auto flex max-w-6xl flex-col gap-12 px-4 py-12 lg:flex-row lg:items-center lg:justify-between">
          <div
            className={`relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-600/90 via-primary-500 to-secondary/80 p-10 text-white shadow-2xl transition-all duration-700 ease-out ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'} lg:w-2/5`}
          >
            <div className="absolute -top-10 right-6 h-28 w-28 rounded-full bg-white/20 blur-2xl" />
            <div className="absolute bottom-10 left-6 h-24 w-24 rounded-full bg-secondary/40 blur-3xl" />

            <div className="relative space-y-6">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-1 text-xs font-semibold uppercase tracking-wide">
                <Sparkles className="h-4 w-4" />
                Premium Access
              </span>
              <h1 className="text-3xl font-semibold leading-tight md:text-4xl">
                Sign in to your <span className="text-white/90">exclusive auction hub</span>
              </h1>
              <p className="text-sm text-white/80">
                Manage bids, monitor live auctions, and receive real-time notifications—all within a polished and secure experience crafted for serious buyers and sellers.
              </p>
              <ul className="space-y-4 text-sm text-white/80">
                <li className="flex items-center gap-3">
                  <ShieldCheck className="h-5 w-5 text-white" />
                  Bank-grade security across every transaction.
                </li>
                <li className="flex items-center gap-3">
                  <ShieldCheck className="h-5 w-5 text-white/90" />
                  Intelligent alerts keeping you ahead of every bid.
                </li>
                <li className="flex items-center gap-3">
                  <ShieldCheck className="h-5 w-5 text-white/90" />
                  Curated marketplace with verified sellers worldwide.
                </li>
              </ul>
            </div>
          </div>

          <div
            className={`w-full max-w-md rounded-3xl border border-white/60 bg-white/90 p-8 shadow-2xl backdrop-blur-xl transition-all duration-700 ease-out ${mounted ? 'translate-y-0 opacity-100 delay-150' : 'translate-y-8 opacity-0'}`}
          >
            <form className="space-y-6" onSubmit={handleSubmit} noValidate>
              <div className="space-y-2 text-center">
                <h2 className="text-2xl font-semibold tracking-tight">Welcome back</h2>
                <p className="text-sm text-slate-600">Access your personalized dashboard to track bids, listings, and notifications.</p>
              </div>

              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={loading || googleLoading}
                className="inline-flex w-full items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 shadow-[0_12px_28px_rgba(15,23,42,0.08)] transition hover:border-primary-200 hover:text-primary-600 focus:outline-none focus:ring-4 focus:ring-primary-100 disabled:cursor-not-allowed disabled:opacity-80"
              >
                <span className="grid h-6 w-6 place-items-center rounded-full bg-slate-100 text-base font-bold text-slate-500">G</span>
                {googleLoading ? (
                  <>
                    <Spinner size={18} />
                    <span>Connecting to Google…</span>
                  </>
                ) : (
                  <span>Continue with Google</span>
                )}
              </button>

              <div className="flex items-center gap-3">
                <span className="h-px flex-1 bg-slate-200" />
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">Or sign in with email</span>
                <span className="h-px flex-1 bg-slate-200" />
              </div>

              <div className="space-y-1">
                <label htmlFor="email" className="text-sm font-semibold text-slate-700">
                  Email address
                </label>
                <div className="group relative">
                  <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 transition group-hover:text-primary-500" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={formState.email}
                    onChange={handleChange}
                    className={`w-full rounded-2xl border px-11 py-3 text-sm font-medium text-slate-900 shadow-[0_12px_30px_rgba(15,23,42,0.08)] transition focus:border-primary-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary-100 hover:border-primary-200 hover:bg-white ${
                      fieldErrors.email ? 'border-danger/60 focus:border-danger focus:ring-danger/20' : 'border-white/60 bg-white/80'
                    }`}
                    placeholder="you@example.com"
                  />
                  {isEmailValid && !fieldErrors.email && (
                    <CheckCircle2 className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-success" />
                  )}
                </div>
                {fieldErrors.email && (
                  <p className="mt-2 flex items-center gap-1 text-xs font-medium text-danger">
                    <AlertCircle className="h-3.5 w-3.5" />
                    {fieldErrors.email}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <label htmlFor="password" className="text-sm font-semibold text-slate-700">
                  Password
                </label>
                <div className="group relative">
                  <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 transition group-hover:text-primary-500" />
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    value={formState.password}
                    onChange={handleChange}
                    className={`w-full rounded-2xl border px-11 py-3 text-sm font-medium text-slate-900 shadow-[0_12px_30px_rgba(15,23,42,0.08)] transition focus:border-primary-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary-100 hover:border-primary-200 hover:bg-white ${
                      fieldErrors.password ? 'border-danger/60 focus:border-danger focus:ring-danger/20' : 'border-white/60 bg-white/80'
                    }`}
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-2 text-slate-400 transition hover:text-primary-500"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                  {isPasswordFilled && !fieldErrors.password && (
                    <CheckCircle2 className="absolute right-10 top-1/2 h-4 w-4 -translate-y-1/2 text-success" />
                  )}
                </div>
                {fieldErrors.password && (
                  <p className="mt-2 flex items-center gap-1 text-xs font-medium text-danger">
                    <AlertCircle className="h-3.5 w-3.5" />
                    {fieldErrors.password}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <label className="inline-flex items-center gap-2 text-sm font-medium text-slate-600">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={() => setRememberMe((prev) => !prev)}
                    className="h-4 w-4 rounded border-slate-300 text-primary-500 focus:ring-primary-200"
                  />
                  Remember me
                </label>
                <a
                  href="mailto:support@eauction.com"
                  className="text-sm font-semibold text-primary-600 transition hover:text-primary-500"
                >
                  Forgot password?
                </a>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="relative inline-flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-gradient-to-r from-primary-500 via-primary-600 to-secondary px-6 py-3 text-sm font-semibold text-white shadow-[0_16px_35px_rgba(124,58,237,0.35)] transition focus:outline-none focus:ring-4 focus:ring-primary-200 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-80"
              >
                <span className="relative z-10 flex items-center gap-2">
                  {loading ? <Spinner size={18} /> : null}
                  {loading ? 'Signing in…' : 'Sign in securely'}
                </span>
                <span className="absolute inset-0 bg-white/10 opacity-0 transition-opacity duration-300 hover:opacity-40" />
              </button>

              <div className="space-y-4 text-center text-sm text-slate-600">
                <p>
                  Need to get started?{' '}
                  <Link to="/register" className="font-semibold text-primary-600 transition hover:text-primary-500">
                    Create a premium account
                  </Link>
                </p>
                <p className="text-xs text-slate-400">
                  By signing in you agree to our{' '}
                  <a href="#terms" className="underline decoration-dotted underline-offset-4">
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a href="#privacy" className="underline decoration-dotted underline-offset-4">
                    Privacy Policy
                  </a>
                  .
                </p>
              </div>
            </form>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default LoginPage;
