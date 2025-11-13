import { Link } from 'react-router-dom';
import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone, Twitter } from 'lucide-react';

const QUICK_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'Active Auctions', to: '/auctions' },
  { label: 'How to Bid', to: '/auctions' },
  { label: 'Terms & Conditions', to: '/terms' },
  { label: 'Privacy Policy', to: '/privacy' },
];

const SOCIAL_LINKS = [
  { label: 'Facebook', icon: Facebook, href: '#' },
  { label: 'Twitter', icon: Twitter, href: '#' },
  { label: 'Instagram', icon: Instagram, href: '#' },
  { label: 'LinkedIn', icon: Linkedin, href: '#' },
];

const FOOTER_ITEMS = [
  {
    title: 'About eAuction',
    content: (
      <p className="text-sm leading-relaxed text-white/70">
        eAuction is a premium online bidding platform connecting discerning buyers with trusted sellers through secure, real-time auctions.
      </p>
    ),
  },
  {
    title: 'Quick Links',
    content: (
      <ul className="space-y-2 text-sm">
        {QUICK_LINKS.map((item) => (
          <li key={item.label}>
            <Link to={item.to} className="transition hover:text-white">
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    ),
  },
  {
    title: 'Contact',
    content: (
      <ul className="space-y-3 text-sm text-white/70">
        <li className="flex items-center gap-2">
          <Mail className="h-4 w-4 text-white/60" />
          support@eauction.com
        </li>
        <li className="flex items-center gap-2">
          <Phone className="h-4 w-4 text-white/60" />
          +1 (800) 555-9020
        </li>
        <li className="flex items-start gap-2">
          <MapPin className="mt-0.5 h-4 w-4 text-white/60" />
          500 Market Street, Suite 210, San Francisco, CA
        </li>
      </ul>
    ),
  },
  {
    title: 'Stay Connected',
    content: (
      <div className="space-y-4">
        <p className="text-sm text-white/70">Join our newsletter for exclusive auction invites.</p>
        <form className="flex gap-2">
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full rounded-xl border border-white/10 bg-white/10 px-4 py-2 text-sm text-white placeholder:text-white/50 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500/40"
          />
          <button
            type="submit"
            className="rounded-xl bg-gradient-to-r from-primary-500 to-secondary px-4 py-2 text-sm font-medium text-white shadow-lg transition hover:shadow-xl"
          >
            Subscribe
          </button>
        </form>
        <div className="flex gap-3">
          {SOCIAL_LINKS.map(({ label, icon: Icon, href }) => (
            <a
              key={label}
              href={href}
              aria-label={label}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition hover:border-white/30 hover:bg-white/10"
            >
              <Icon className="h-4 w-4" />
            </a>
          ))}
        </div>
      </div>
    ),
  },
];

const Footer = () => (
  <footer className="bg-gradient-to-b from-abyss via-midnight to-black text-white">
    <div className="mx-auto max-w-6xl px-4 py-16">
      <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
        {FOOTER_ITEMS.map((item) => (
          <div key={item.title} className="space-y-4">
            <h3 className="text-lg font-semibold text-white">{item.title}</h3>
            {item.content}
          </div>
        ))}
      </div>
      <div className="mt-12 border-t border-white/10 pt-6 text-center text-sm text-white/60">
        <p>© {new Date().getFullYear()} eAuction. All rights reserved.</p>
      </div>
    </div>
  </footer>
);

export default Footer;
