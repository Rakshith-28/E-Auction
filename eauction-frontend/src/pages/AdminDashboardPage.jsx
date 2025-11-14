import { useEffect, useState } from 'react';
import PageContainer from '../components/Common/PageContainer.jsx';
import Loader from '../components/Common/Loader.jsx';
import { useAuth } from '../hooks/useAuth.js';
import { deleteUser, getDashboard, getUsers } from '../services/adminService.js';

const AdminDashboardPage = () => {
  const { user: currentUser } = useAuth();
  const [metrics, setMetrics] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [deletingUserId, setDeletingUserId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const [dashboardData, dashboardError] = await getDashboard();
      const [usersData, usersError] = await getUsers();

      if (dashboardError || usersError) {
        setError(dashboardError ?? usersError);
      } else {
        setMetrics(dashboardData);
        setUsers(usersData ?? []);
      }

      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <PageContainer title="Admin dashboard">
        <Loader label="Loading dashboard" />
      </PageContainer>
    );
  }

  const handleUserDelete = async (id) => {
    if (!window.confirm('Delete this user? This action cannot be undone.')) return;

    setError(null);
    setDeletingUserId(id);
    const [, deleteError] = await deleteUser(id);
    setDeletingUserId(null);

    if (deleteError) {
      setError(deleteError);
      return;
    }

    setUsers((prev) => prev.filter((user) => user.id !== id));
  };

  return (
    <PageContainer
      title="Admin dashboard"
      subtitle="Monitor platform activity and manage users."
    >
      {error && <p className="text-sm text-red-600">{error}</p>}

      {metrics && (
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: 'Total users', value: metrics.totalUsers },
            { label: 'Total items', value: metrics.totalItems },
            { label: 'Active auctions', value: metrics.activeAuctions },
            { label: 'Total revenue', value: `$${(metrics.totalRevenue ?? 0).toLocaleString()}` },
          ].map((card) => (
            <article key={card.label} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-medium text-slate-500">{card.label}</p>
              <p className="mt-4 text-2xl font-semibold text-slate-900">{card.value ?? '—'}</p>
            </article>
          ))}
        </section>
      )}

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <header className="flex flex-col gap-2 pb-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Registered users</h2>
          <p className="text-sm text-slate-500">{users.length} accounts</p>
        </header>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Roles</th>
                <th className="px-4 py-3">Joined</th>
                <th className="px-4 py-3" aria-label="User actions" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-600">
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="px-4 py-3 font-medium text-slate-900">{user.name}</td>
                  <td className="px-4 py-3">{user.email}</td>
                  <td className="px-4 py-3">
                    {Array.isArray(user.roles) && user.roles.length
                      ? user.roles.join(', ')
                      : user.role ?? '—'}
                  </td>
                  <td className="px-4 py-3">{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '—'}</td>
                  <td className="px-4 py-3">
                    {currentUser?.id === user.id ? (
                      <span className="text-xs uppercase tracking-wide text-slate-400">This is you</span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleUserDelete(user.id)}
                        disabled={deletingUserId === user.id}
                        className="rounded-md border border-red-200 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-red-600 transition hover:border-red-300 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {deletingUserId === user.id ? 'Deleting…' : 'Delete'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </PageContainer>
  );
};

export default AdminDashboardPage;
