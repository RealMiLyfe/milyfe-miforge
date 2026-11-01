import AdminLayout from './AdminLayout.jsx';
import { useStore } from '../../store.jsx';

export default function AdminRevenue() {
  const { mock } = useStore();
  const r = mock.admin.revenue;

  return (
    <AdminLayout title="Revenue">
      {/* big number */}
      <p className="font-head text-6xl font-bold text-navy">{r.month_label}</p>

      {/* stats row */}
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          ['MRR', `$${r.mrr}`],
          ['One-time', `$${r.one_time}`],
          ['Outstanding', `$${r.outstanding}`],
          ['Lifetime', `$${r.lifetime}`],
        ].map(([k, v]) => (
          <div key={k} className="card !p-3 text-center">
            <p className="font-head text-3xl font-bold text-navy">{v}</p>
            <p className="text-charcoal/70">{k}</p>
          </div>
        ))}
      </div>

      {/* payment method breakdown: one horizontal stacked bar, no charts */}
      <section className="mt-6">
        <h2 className="mb-2 font-head text-2xl text-navy">Payment methods</h2>
        <div className="flex h-12 w-full overflow-hidden rounded-btn border border-navy/30" role="img" aria-label="Payment method breakdown: Cash 60%, CashApp 20%, Venmo 10%, Check 10%">
          {r.methods.map((m) => (
            <div
              key={m.label}
              style={{ width: `${m.pct}%`, backgroundColor: m.color }}
              className="flex items-center justify-center text-sm font-bold text-cream"
              title={`${m.label} ${m.pct}%`}
            >
              {m.pct >= 10 ? `${m.label} ${m.pct}%` : ''}
            </div>
          ))}
        </div>
        <ul className="mt-2 flex flex-wrap gap-4">
          {r.methods.map((m) => (
            <li key={m.label} className="flex items-center gap-2">
              <span className="inline-block h-4 w-4 rounded-sm" style={{ backgroundColor: m.color }} aria-hidden="true"></span>
              {m.label} {m.pct}%
            </li>
          ))}
        </ul>
      </section>

      <p className="mt-6 text-charcoal/70">No charts. Just numbers. Clean and fast.</p>
    </AdminLayout>
  );
}
