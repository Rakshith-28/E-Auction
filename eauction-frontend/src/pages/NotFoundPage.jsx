import { Link } from 'react-router-dom';
import PageContainer from '../components/Common/PageContainer.jsx';

const NotFoundPage = () => (
  <PageContainer title="Page not found" subtitle="The page you are looking for does not exist.">
    <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
      <p className="text-sm text-slate-600">Please check the URL or return to the homepage.</p>
      <Link
        to="/"
        className="mt-6 inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700"
      >
        Go home
      </Link>
    </div>
  </PageContainer>
);

export default NotFoundPage;
