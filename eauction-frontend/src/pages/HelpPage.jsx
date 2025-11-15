import { HelpCircle, Mail, MessageCircle } from 'lucide-react';
import PageContainer from '../components/Common/PageContainer';

const HelpPage = () => (
  <PageContainer
    title="Help & Support"
    subtitle="Find answers to common questions and get assistance"
  >
    <div className="grid gap-6 md:grid-cols-2">
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="grid h-10 w-10 place-items-center rounded-full bg-primary-100 text-primary-600">
            <HelpCircle className="h-5 w-5" />
          </div>
          <h2 className="text-lg font-semibold text-slate-900">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-slate-900">How do I place a bid?</h3>
            <p className="mt-1 text-sm text-slate-600">Browse items, select one you like, enter your bid amount (must be higher than current bid), and click "Place Bid".</p>
          </div>

          <div>
            <h3 className="font-semibold text-slate-900">How do I create a listing?</h3>
            <p className="mt-1 text-sm text-slate-600">You need a SELLER role. Go to "Sell Item" in the navigation, fill in item details, set minimum bid and auction end time, then submit.</p>
          </div>

          <div>
            <h3 className="font-semibold text-slate-900">When do auctions end?</h3>
            <p className="mt-1 text-sm text-slate-600">Each auction has a countdown timer. When it reaches zero, the auction ends and the highest bidder wins.</p>
          </div>

          <div>
            <h3 className="font-semibold text-slate-900">How do I track my bids?</h3>
            <p className="mt-1 text-sm text-slate-600">Visit "My Bids" to see all your active bids, won items, and bid history.</p>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="grid h-10 w-10 place-items-center rounded-full bg-primary-100 text-primary-600">
            <MessageCircle className="h-5 w-5" />
          </div>
          <h2 className="text-lg font-semibold text-slate-900">Contact Support</h2>
        </div>

        <p className="text-sm text-slate-600 mb-4">Need more help? Our support team is here to assist you.</p>

        <div className="space-y-3">
          <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-surface p-4">
            <Mail className="h-5 w-5 text-primary-600" />
            <div>
              <p className="text-sm font-semibold text-slate-900">Email Support</p>
              <a href="mailto:support@eauction.com" className="text-sm text-primary-600 hover:underline">
                support@eauction.com
              </a>
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-surface p-4">
            <p className="text-sm font-semibold text-slate-900 mb-2">Business Hours</p>
            <p className="text-sm text-slate-600">Monday - Friday: 9:00 AM - 6:00 PM</p>
            <p className="text-sm text-slate-600">Saturday: 10:00 AM - 4:00 PM</p>
            <p className="text-sm text-slate-600">Sunday: Closed</p>
          </div>
        </div>
      </section>

      <section className="md:col-span-2 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Getting Started</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-lg border border-slate-200 bg-surface p-4">
            <div className="text-lg font-bold text-primary-600 mb-2">1</div>
            <h3 className="font-semibold text-slate-900 mb-1">Create Account</h3>
            <p className="text-sm text-slate-600">Sign up and select your role: Buyer, Seller, or both.</p>
          </div>

          <div className="rounded-lg border border-slate-200 bg-surface p-4">
            <div className="text-lg font-bold text-primary-600 mb-2">2</div>
            <h3 className="font-semibold text-slate-900 mb-1">Browse or List</h3>
            <p className="text-sm text-slate-600">Browse items to bid on, or create your own listings to sell.</p>
          </div>

          <div className="rounded-lg border border-slate-200 bg-surface p-4">
            <div className="text-lg font-bold text-primary-600 mb-2">3</div>
            <h3 className="font-semibold text-slate-900 mb-1">Win & Enjoy</h3>
            <p className="text-sm text-slate-600">Place bids, win auctions, and enjoy your purchases!</p>
          </div>
        </div>
      </section>
    </div>
  </PageContainer>
);

export default HelpPage;
