import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  Lock,
  Mail,
  MapPin,
  Phone,
  ShoppingBag,
  Sparkles,
  Store,
  User,
} from 'lucide-react';
import Navbar from '../components/Layout/Navbar.jsx';
import Footer from '../components/Layout/Footer.jsx';
import Spinner from '../components/Common/Spinner.jsx';
import Toast from '../components/Common/Toast.jsx';
import { register as registerRequest } from '../services/authService.js';
import { useAuth } from '../hooks/useAuth.js';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const INITIAL_FORM_STATE = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  roles: ['BUYER'],
  phone: '',
  address: '',
  terms: false,
};

const ACCOUNT_TYPES = [
  {
    value: 'BUYER',
    title: 'Buyer',
    description: 'Bid confidently with real-time alerts and curated premium auctions.',
    icon: ShoppingBag,
  },
  {
    value: 'SELLER',
    title: 'Seller',
    description: 'Showcase luxury listings to a global audience of verified buyers.',
    icon: Store,
  },
];

const PASSWORD_REQUIREMENTS = [
  { key: 'length', label: 'At least 8 characters' },
  { key: 'uppercase', label: 'One uppercase letter' },
  { key: 'number', label: 'One number' },
  { key: 'special', label: 'One special character' },
];

const evaluatePassword = (password) => {
  const checks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    number: /\d/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  };

  const score = Object.values(checks).filter(Boolean).length;
  const strength =
    score <= 1 ? 'Weak' : score === 2 ? 'Fair' : score === 3 ? 'Strong' : 'Exceptional';
  const barClass =
    score <= 1
      ? 'bg-danger'
      : score === 2
        ? 'bg-warning'
        : score === 3
          ? 'bg-secondary'
          : 'bg-success';

  return { checks, score, strength, barClass };
};

const RegisterPage = () => {
  const navigate = useNavigate();
  const { loginWithGoogle, loading: authLoading } = useAuth();
  const [formState, setFormState] = useState(INITIAL_FORM_STATE);
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [toast, setToast] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const redirectTimeoutRef = useRef();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!toast) {
      return undefined;
    }
    const timer = setTimeout(() => setToast(null), 4500);
    return () => clearTimeout(timer);
  }, [toast]);

  useEffect(() => () => {
    if (redirectTimeoutRef.current) {
      clearTimeout(redirectTimeoutRef.current);
    }
  }, []);

  const passwordMeta = useMemo(() => evaluatePassword(formState.password), [formState.password]);
  const confirmMatches =
    Boolean(formState.confirmPassword) && formState.password === formState.confirmPassword;

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const toggleTerms = () => {
    setFormState((prev) => ({ ...prev, terms: !prev.terms }));
    setFieldErrors((prev) => ({ ...prev, terms: undefined }));
  };

  const handleAccountTypeSelect = (value) => {
    setFormState((prev) => {
      const currentRoles = prev.roles || [];
      const isSelected = currentRoles.includes(value);
      const updatedRoles = isSelected
        ? currentRoles.filter((r) => r !== value)
        : [...currentRoles, value];
      return { ...prev, roles: updatedRoles.length ? updatedRoles : ['BUYER'] };
    });
  };

  const validate = () => {
    const errors = {};
    if (!formState.name.trim()) {
      errors.name = 'Full name is required.';
    }

    if (!formState.email.trim()) {
      errors.email = 'Email is required.';
    } else if (!EMAIL_REGEX.test(formState.email.trim())) {
      errors.email = 'Enter a valid email address.';
    }

    if (!formState.password) {
      errors.password = 'Password is required.';
    } else if (passwordMeta.score < PASSWORD_REQUIREMENTS.length) {
      errors.password = 'Please meet all password requirements.';
    }

    if (!formState.confirmPassword) {
      errors.confirmPassword = 'Confirm your password.';
    } else if (!confirmMatches) {
      errors.confirmPassword = 'Passwords do not match.';
    }

    if (!formState.terms) {
      errors.terms = 'You must agree to the terms to continue.';
    }

    setFieldErrors(errors);

    if (Object.keys(errors).length) {
      setToast({
        type: 'error',
        title: 'Missing information',
        message: 'Review the highlighted fields and try again.',
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

    setLoading(true);
    const payload = {
      name: formState.name.trim(),
      email: formState.email.trim().toLowerCase(),
      password: formState.password,
      roles: formState.roles && formState.roles.length ? formState.roles : ['BUYER'],
      phone: formState.phone.trim(),
      address: formState.address.trim(),
    };

    const [data, registerError] = await registerRequest(payload);
    setLoading(false);

    if (registerError) {
      setToast({ type: 'error', title: 'Registration failed', message: registerError });
      return;
    }

    setToast({
      type: 'success',
      title: 'Account created',
      message: 'Welcome to eAuction! Redirecting to your dashboard…',
    });

    setFormState(INITIAL_FORM_STATE);
    if (redirectTimeoutRef.current) {
      clearTimeout(redirectTimeoutRef.current);
    }
    redirectTimeoutRef.current = setTimeout(() => {
      navigate('/dashboard', { replace: true });
    }, 600);
  };

  const handleGoogleSignIn = async () => {
    setToast(null);
    setGoogleLoading(true);
    const [data, googleError] = await loginWithGoogle();
    setGoogleLoading(false);

    if (googleError) {
      setToast({ type: 'error', title: 'Google sign-in failed', message: googleError });
      return;
    }

    if (data?.token) {
      sessionStorage.setItem('eauction_last_login', new Date().toISOString());
    }
    setToast({ type: 'success', title: 'Welcome to eAuction', message: 'Google sign-in complete. Redirecting to your dashboard.' });
    if (redirectTimeoutRef.current) {
      clearTimeout(redirectTimeoutRef.current);
    }
    redirectTimeoutRef.current = setTimeout(() => {
      navigate('/dashboard', { replace: true });
    }, 600);
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-surface via-white to-primary-50 text-slate-900">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -right-32 top-10 h-96 w-96 rounded-full bg-secondary/20 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-[28rem] w-[28rem] rounded-full bg-primary-200/40 blur-3xl" />
      </div>

      <Navbar />
      {toast && <Toast type={toast.type} title={toast.title} message={toast.message} />}

      <main className="relative flex-1">
        <section className="mx-auto flex max-w-6xl flex-col-reverse gap-10 px-4 py-12 lg:flex-row lg:items-center lg:justify-between">
          <div
            className={`relative w-full rounded-3xl border border-white/50 bg-white/90 p-8 shadow-2xl backdrop-blur-xl transition-all duration-700 ease-out ${mounted ? 'translate-y-0 opacity-100 delay-150' : 'translate-y-8 opacity-0'}`}
          >
            <form className="grid gap-6" onSubmit={handleSubmit} noValidate>
              <div className="space-y-2 text-center lg:text-left">
                <h2 className="text-3xl font-semibold tracking-tight">Create your premium account</h2>
                <p className="text-sm text-slate-600">
                  Choose your role, secure your credentials, and join a curated marketplace for high-value auctions.
                </p>
              </div>

              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={authLoading || googleLoading}
                className="inline-flex w-full items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 shadow-[0_12px_28px_rgba(15,23,42,0.08)] transition hover:border-primary-200 hover:text-primary-600 focus:outline-none focus:ring-4 focus:ring-primary-100 disabled:cursor-not-allowed disabled:opacity-80"
              >
                <span className="grid h-6 w-6 place-items-center rounded-full bg-slate-100 text-base font-bold text-slate-500">G</span>
                {googleLoading ? (
                  <>
                    <Spinner size={18} />
                    <span>Authenticating with Google…</span>
                  </>
                ) : (
                  <span>Continue with Google</span>
                )}
              </button>

              <div className="flex items-center gap-3">
                <span className="h-px flex-1 bg-slate-200" />
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">Or complete the premium form</span>
                <span className="h-px flex-1 bg-slate-200" />
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div className="space-y-1 md:col-span-2">
                  <label htmlFor="name" className="text-sm font-semibold text-slate-700">
                    Full name
                  </label>
                  <div className="group relative">
                    <User className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 transition group-hover:text-primary-500" />
                    <input
                      id="name"
                      name="name"
                      value={formState.name}
                      onChange={handleChange}
                      className={`w-full rounded-2xl border px-11 py-3 text-sm font-medium text-slate-900 shadow-[0_12px_30px_rgba(15,23,42,0.08)] transition focus:border-primary-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary-100 hover:border-primary-200 hover:bg-white ${
                        fieldErrors.name ? 'border-danger/60 focus:border-danger focus:ring-danger/20' : 'border-white/60 bg-white/80'
                      }`}
                      placeholder="Enter your full name"
                    />
                    {formState.name.trim() && !fieldErrors.name && (
                      <CheckCircle2 className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-success" />
                    )}
                  </div>
                  {fieldErrors.name && (
                    <p className="mt-2 flex items-center gap-1 text-xs font-medium text-danger">
                      <AlertCircle className="h-3.5 w-3.5" />
                      {fieldErrors.name}
                    </p>
                  )}
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
                    {EMAIL_REGEX.test(formState.email.trim()) && !fieldErrors.email && (
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
                  <label htmlFor="phone" className="text-sm font-semibold text-slate-700">
                    Phone number <span className="text-xs text-slate-400">(optional)</span>
                  </label>
                  <div className="group relative">
                    <Phone className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 transition group-hover:text-primary-500" />
                    <input
                      id="phone"
                      name="phone"
                      value={formState.phone}
                      onChange={handleChange}
                      className="w-full rounded-2xl border border-white/60 bg-white/80 px-11 py-3 text-sm font-medium text-slate-900 shadow-[0_12px_30px_rgba(15,23,42,0.08)] transition focus:border-primary-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary-100 hover:border-primary-200 hover:bg-white"
                      placeholder="+1 555 0123"
                    />
                  </div>
                </div>

                <div className="space-y-1 md:col-span-2">
                  <label htmlFor="address" className="text-sm font-semibold text-slate-700">
                    Address <span className="text-xs text-slate-400">(optional)</span>
                  </label>
                  <div className="group relative">
                    <MapPin className="pointer-events-none absolute left-4 top-4 h-4 w-4 text-slate-400 transition group-hover:text-primary-500" />
                    <textarea
                      id="address"
                      name="address"
                      rows={3}
                      value={formState.address}
                      onChange={handleChange}
                      className="w-full rounded-2xl border border-white/60 bg-white/80 px-11 py-3 text-sm font-medium text-slate-900 shadow-[0_12px_30px_rgba(15,23,42,0.08)] transition focus:border-primary-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary-100 hover:border-primary-200 hover:bg-white"
                      placeholder="Suite 210, 500 Market Street, San Francisco"
                    />
                  </div>
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
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
                      value={formState.password}
                      onChange={handleChange}
                      className={`w-full rounded-2xl border px-11 py-3 text-sm font-medium text-slate-900 shadow-[0_12px_30px_rgba(15,23,42,0.08)] transition focus:border-primary-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary-100 hover:border-primary-200 hover:bg-white ${
                        fieldErrors.password ? 'border-danger/60 focus:border-danger focus:ring-danger/20' : 'border-white/60 bg-white/80'
                      }`}
                      placeholder="Create a strong password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-2 text-slate-400 transition hover:text-primary-500"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                    {passwordMeta.score === PASSWORD_REQUIREMENTS.length && !fieldErrors.password && (
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

                <div className="space-y-1">
                  <label htmlFor="confirmPassword" className="text-sm font-semibold text-slate-700">
                    Confirm password
                  </label>
                  <div className="group relative">
                    <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 transition group-hover:text-primary-500" />
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={formState.confirmPassword}
                      onChange={handleChange}
                      className={`w-full rounded-2xl border px-11 py-3 text-sm font-medium text-slate-900 shadow-[0_12px_30px_rgba(15,23,42,0.08)] transition focus:border-primary-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary-100 hover:border-primary-200 hover:bg-white ${
                        fieldErrors.confirmPassword ? 'border-danger/60 focus:border-danger focus:ring-danger/20' : 'border-white/60 bg-white/80'
                      }`}
                      placeholder="Re-enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-2 text-slate-400 transition hover:text-primary-500"
                      aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                    {confirmMatches && !fieldErrors.confirmPassword && (
                      <CheckCircle2 className="absolute right-10 top-1/2 h-4 w-4 -translate-y-1/2 text-success" />
                    )}
                  </div>
                  {fieldErrors.confirmPassword && (
                    <p className="mt-2 flex items-center gap-1 text-xs font-medium text-danger">
                      <AlertCircle className="h-3.5 w-3.5" />
                      {fieldErrors.confirmPassword}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-3 rounded-2xl border border-white/60 bg-white/80 p-5 shadow-inner">
                <div className="flex items-center justify-between text-sm font-semibold text-slate-700">
                  <span>Password strength</span>
                  <span className="text-primary-600">{passwordMeta.strength}</span>
                </div>
                <div className="h-2 rounded-full bg-slate-200">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${passwordMeta.barClass}`}
                    style={{ width: `${(passwordMeta.score / PASSWORD_REQUIREMENTS.length) * 100}%` }}
                  />
                </div>
                <ul className="grid gap-2 text-xs text-slate-600 md:grid-cols-2">
                  {PASSWORD_REQUIREMENTS.map(({ key, label }) => (
                    <li key={key} className="flex items-center gap-2">
                      <span
                        className={`grid h-5 w-5 place-items-center rounded-full text-white ${
                          passwordMeta.checks[key] ? 'bg-success' : 'bg-slate-300'
                        }`}
                      >
                        <CheckCircle2 className="h-3 w-3" />
                      </span>
                      {label}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-4">
                <p className="text-sm font-semibold text-slate-700">Account type (select one or more)</p>
                <div className="grid gap-4 sm:grid-cols-2">
                  {ACCOUNT_TYPES.map(({ value, title, description, icon: Icon }) => {
                    const isSelected = formState.roles.includes(value);
                    return (
                      <label
                        key={value}
                        className={`flex h-full cursor-pointer flex-col gap-3 rounded-2xl border px-5 py-5 transition focus-within:outline-none focus-within:ring-4 focus-within:ring-primary-100 ${
                          isSelected
                            ? 'border-primary-400 bg-primary-50/80 text-primary-900 shadow-[0_18px_40px_rgba(124,58,237,0.32)]'
                            : 'border-white/60 bg-white/70 text-slate-700 shadow-[0_12px_28px_rgba(15,23,42,0.08)] hover:border-primary-200 hover:bg-white'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleAccountTypeSelect(value)}
                            className="mt-1 h-5 w-5 rounded border-slate-300 text-primary-500 focus:ring-primary-200"
                          />
                          <span className={`rounded-full p-3 ${isSelected ? 'bg-primary-500/20 text-primary-600' : 'bg-slate-100 text-slate-500'}`}>
                            <Icon className="h-5 w-5" />
                          </span>
                        </div>
                        <div className="ml-8 space-y-1">
                          <p className="text-base font-semibold">{title}</p>
                          <p className="text-xs text-slate-500">{description}</p>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              <label className="flex items-start gap-3 rounded-2xl border border-white/60 bg-white/80 p-4 text-sm text-slate-600 shadow-inner">
                <input
                  type="checkbox"
                  checked={formState.terms}
                  onChange={toggleTerms}
                  className="mt-1 h-4 w-4 rounded border-slate-300 text-primary-500 focus:ring-primary-200"
                />
                <span>
                  I agree to the{' '}
                  <a href="#terms" className="font-semibold text-primary-600 underline decoration-dotted underline-offset-4">
                    Terms &amp; Conditions
                  </a>{' '}
                  and{' '}
                  <a href="#privacy" className="font-semibold text-primary-600 underline decoration-dotted underline-offset-4">
                    Privacy Policy
                  </a>
                  .
                </span>
              </label>
              {fieldErrors.terms && (
                <p className="-mt-3 flex items-center gap-1 text-xs font-medium text-danger">
                  <AlertCircle className="h-3.5 w-3.5" />
                  {fieldErrors.terms}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="relative inline-flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-gradient-to-r from-primary-500 via-primary-600 to-secondary px-6 py-3 text-sm font-semibold text-white shadow-[0_18px_42px_rgba(124,58,237,0.35)] transition focus:outline-none focus:ring-4 focus:ring-primary-200 hover:shadow-[0_24px_52px_rgba(59,130,246,0.35)] disabled:cursor-not-allowed disabled:opacity-80"
              >
                <span className="relative z-10 flex items-center gap-2">
                  {loading ? <Spinner size={18} /> : null}
                  {loading ? 'Creating account…' : 'Create premium account'}
                </span>
                <span className="absolute inset-0 bg-white/10 opacity-0 transition-opacity duration-300 hover:opacity-40" />
              </button>

              <p className="text-center text-sm text-slate-600">
                Already part of eAuction?{' '}
                <Link to="/login" className="font-semibold text-primary-600 transition hover:text-primary-500">
                  Sign in
                </Link>
              </p>
            </form>
          </div>

          <div
            className={`relative flex w-full flex-col justify-between rounded-3xl bg-gradient-to-br from-primary-600/95 via-primary-500 to-secondary/80 p-10 text-white shadow-2xl transition-all duration-700 ease-out ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'} lg:w-2/5`}
          >
            <div className="absolute -top-10 right-6 h-32 w-32 rounded-full bg-white/20 blur-2xl" />
            <div className="absolute bottom-8 left-6 h-24 w-24 rounded-full bg-secondary/40 blur-3xl" />
            <div className="relative space-y-6">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-1 text-xs font-semibold uppercase tracking-wide">
                <Sparkles className="h-4 w-4" />
                Luxury Marketplace
              </span>
              <h1 className="text-3xl font-semibold leading-tight md:text-4xl">
                Elevate your auctions with a <span className="text-white/90">premium profile</span>
              </h1>
              <p className="text-sm text-white/80">
                Unlock exclusive bidding rooms, curated insights, and a concierge-level experience designed for serious collectors and sellers.
              </p>
              <ul className="space-y-4 text-sm text-white/85">
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-white" />
                  Verified transactions with real-time settlement tracking.
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-white" />
                  Intelligent alerts to safeguard every bid and listing.
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-white" />
                  Dedicated support from our auction success team.
                </li>
              </ul>
            </div>
            <div className="relative mt-10 rounded-2xl border border-white/20 bg-white/10 p-6 text-sm text-white/90">
              <p className="font-semibold">Need concierge onboarding?</p>
              <p className="mt-2 text-white/75">
                Our specialists will help migrate your catalog, set bespoke bidding rules, and design tailored marketing campaigns.
              </p>
              <a
                href="mailto:concierge@eauction.com"
                className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/20 px-5 py-2 text-xs font-semibold uppercase tracking-wide text-white transition hover:bg-white/30"
              >
                Connect with concierge
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default RegisterPage;
