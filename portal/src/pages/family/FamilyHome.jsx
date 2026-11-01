import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useStore } from '../../store.jsx';

const LEVEL_BADGE = {
  'Full View': 'bg-success text-cream',
  'Limited View': 'bg-warn text-cream',
  'Decision Partner': 'bg-purple text-cream',
};

export default function FamilyHome() {
  const { mock, familySession } = useStore();
  const [params] = useSearchParams();
  const level = params.get('level') || familySession?.level || 'Full View';
  const [decision, setDecision] = useState(null); // 'approved' | 'declined' | 'call'

  const clientId = mock.meta.default_client_id;
  const client = mock.clients.find((c) => c.id === clientId);
  const visits = mock.visits
    .filter((v) => v.client_id === clientId)
    .sort((a, b) => b.visit_date.localeCompare(a.visit_date))
    .slice(0, 3);
  const tools = mock.tools.filter((t) => t.client_id === clientId);
  const d = mock.admin.decision;

  const isDecision = level === 'Decision Partner';
  const isLimited = level === 'Limited View';

  return (
    <main className="min-h-screen bg-cream px-6 pb-10 text-[18px]">
      <header className="border-b border-navy/20 py-4 text-center">
        <p className="font-head text-4xl font-bold text-navy">MiForge Family Access</p>
      </header>

      <div className="mx-auto mt-6 w-full max-w-2xl">
        {/* relationship header */}
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="font-head text-3xl text-navy">
            {familySession?.client || client.full_name + ' Scher'} — {familySession?.client_relation || 'your family member'}
          </h1>
          <span className={`rounded-pill px-3 py-1 text-sm font-bold ${LEVEL_BADGE[level] || LEVEL_BADGE['Full View']}`}>
            {level}
          </span>
        </div>
        <p className="mt-2">Last visit: {visits[0] ? `${visits[0].visit_date} (${visits[0].duration_hours} hrs)` : '—'}</p>
        <p>Next visit: Not scheduled</p>

        <p className="mt-2 text-sm text-charcoal/60">
          Viewing as: {familySession?.name} ·{' '}
          <Link to="/family/login" className="underline">switch account</Link> ·{' '}
          <Link to="/family/concern" className="underline">raise a concern</Link>
        </p>

        {/* Decision Partner: pending decision banner */}
        {isDecision && d.pending > 0 && (
          <section className="card mt-6 !border-purple !p-5">
            <h2 className="font-head text-2xl text-navy">🔔 {d.pending} Decision Waiting for Your OK</h2>
            <p className="mt-2 text-xl">
              John wants to build {d.client} a {d.title.toLowerCase()} — {d.project}, ${d.amount}.
            </p>
            {decision === null ? (
              <div className="mt-4 flex flex-wrap gap-3">
                <button type="button" onClick={() => setDecision('approved')} className="min-h-touch rounded-btn bg-success px-5 py-2 font-bold text-cream">Approve</button>
                <button type="button" onClick={() => setDecision('declined')} className="min-h-touch rounded-btn bg-danger px-5 py-2 font-bold text-cream">Decline</button>
                <a href={mock.meta.operator.tel} className="min-h-touch rounded-btn border-2 border-navy px-5 py-2 font-bold text-navy">Call John First</a>
              </div>
            ) : (
              <p className="mt-4 font-bold text-navy">
                {decision === 'approved' && '✓ Approved — John has been notified.'}
                {decision === 'declined' && '✗ Declined — John has been notified.'}
                {decision === 'call' && '📞 Calling John...'}
              </p>
            )}
          </section>
        )}

        {/* Recent visits */}
        <section className="mt-8">
          <h2 className="font-head text-2xl text-navy">Recent Visits</h2>
          <div className="mt-3 flex flex-col gap-3">
            {visits.map((v) => (
              <article key={v.id} className="card !p-4">
                <p className="font-bold text-navy">{v.visit_date} — {v.title}</p>
                <p className="mt-1">{v.summary}</p>
                {!isLimited && <p className="mt-1 text-charcoal/70">{v.duration_hours} hrs · ${v.amount_due} · {v.amount_paid >= v.amount_due && v.amount_due > 0 ? 'Paid' : 'Free'}</p>}
              </article>
            ))}
          </div>
        </section>

        {/* Current tools — full view only */}
        {!isLimited && (
          <section className="mt-8">
            <h2 className="font-head text-2xl text-navy">Current Tools</h2>
            <div className="mt-3 flex flex-col gap-3">
              {tools.map((t) => (
                <div key={t.id} className="card !p-4">
                  <p className="font-bold text-navy">{t.icon} {t.name}</p>
                  <p className="mt-1">{t.description}</p>
                  <p className="mt-1 text-sm text-charcoal/60">View only — no links.</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Activity log — full view only */}
        {!isLimited && (
          <section className="mt-8">
            <h2 className="font-head text-2xl text-navy">Activity Log</h2>
            <div className="mt-3 flex flex-col gap-2">
              {mock.family_portal.activity.map((a, i) => (
                <div key={i} className="card flex items-baseline gap-3 border-l-4 border-l-navy !p-3">
                  <span className="shrink-0 font-mono text-sm text-charcoal/60">{a.date}, {a.time}</span>
                  <span>{a.text}{level !== 'Full View' ? '' : ''}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {isLimited && (
          <p className="mt-8 text-charcoal/70">
            Limited View shows visit dates and one-line summaries only — no tools, invoices, or activity detail.
          </p>
        )}

        <p className="mt-10">
          <a href={mock.meta.operator.tel} className="btn-rust inline-flex w-full">📞 Call John: {mock.meta.operator.phone}</a>
        </p>
      </div>
    </main>
  );
}
