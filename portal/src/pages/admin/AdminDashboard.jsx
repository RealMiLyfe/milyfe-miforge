import { Link } from 'react-router-dom';
import AdminLayout from './AdminLayout.jsx';
import { useStore } from '../../store.jsx';

function fmtToday(iso) {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });
}

const QUICK_ACTIONS = [
  { label: 'New Client', to: '/admin/clients', icon: '👤' },
  { label: 'New Visit', to: '/admin/clients', icon: '📅' },
  { label: 'New Invoice', to: '/admin/revenue', icon: '🧾' },
  { label: 'Templates', to: '/admin/templates', icon: '🧰' },
];

export default function AdminDashboard() {
  const { mock } = useStore();
  const t = mock.admin.today;

  return (
    <AdminLayout title={fmtToday(t.date)}>
      {/* top stats */}
      <p className="text-lg font-semibold text-navy">
        {mock.admin.operator_name} · {t.stats}
      </p>

      {/* Block 1 — Today's schedule */}
      <section className="mt-6">
        <h2 className="mb-2 font-head text-2xl text-navy">Today's Schedule</h2>
        <div className="grid gap-3 md:grid-cols-3">
          {t.schedule.map((s) => (
            <article key={s.visit_id} className="card !p-4">
              <p className="text-xl font-bold text-navy">{s.time} — {s.client}</p>
              <p className="text-charcoal/80">{s.tier} · {s.label}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Link
                  to={`/admin/session/${s.visit_id}`}
                  className="min-h-touch rounded-btn bg-rust px-4 py-2 font-semibold text-cream"
                >
                  Start Session
                </Link>
                <Link
                  to={`/admin/clients/${s.client_id}`}
                  className="min-h-touch rounded-btn border-2 border-navy px-4 py-2 font-semibold text-navy"
                >
                  View Profile
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Block 2 — Needs attention (red border when anything is here) */}
      <section className="mt-6">
        <h2 className="mb-2 font-head text-2xl text-navy">Needs Attention</h2>
        <div className="card !p-4 border-2 border-danger">
          <ul className="space-y-2">
            {t.attention.map((a, i) => (
              <li key={i} className="flex items-start gap-2">
                <span aria-hidden="true">{a.icon}</span>
                <span className={a.kind === 'danger' ? 'font-semibold text-danger' : ''}>{a.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Block 3 — This week */}
      <section className="mt-6">
        <h2 className="mb-2 font-head text-2xl text-navy">This Week</h2>
        <div className="card !p-4">
          <ul className="space-y-1">
            <li>{t.week.visits_booked} visits booked · ${t.week.projected} projected</li>
            <li>{t.week.followups_due} follow-ups due</li>
            <li>1 referral to call back ({t.week.referral})</li>
          </ul>
        </div>
      </section>

      {/* Quick action tiles */}
      <section className="mt-6">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {QUICK_ACTIONS.map((q) => (
            <Link
              key={q.label}
              to={q.to}
              className="card flex min-h-touch flex-col items-center gap-1 !p-3 text-center font-semibold text-navy hover:shadow-elev1"
            >
              <span className="text-3xl" aria-hidden="true">{q.icon}</span>
              {q.label}
            </Link>
          ))}
        </div>
      </section>
    </AdminLayout>
  );
}
