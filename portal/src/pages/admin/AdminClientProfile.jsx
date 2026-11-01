import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import AdminLayout from './AdminLayout.jsx';
import { useStore, ROLES } from '../../store.jsx';

const TABS = ['Overview', 'Visits', 'Invoices', 'Tools', 'Family', 'Jewels', 'Consent Log'];

const STATUS_STYLES = { Active: 'bg-success text-cream', Completed: 'bg-navy text-cream', Lead: 'bg-warn text-cream' };
const TOOL_STATUS = { Ready: 'bg-success text-cream', 'Awaiting Operator Access': 'bg-warn text-cream' };

export default function AdminClientProfile() {
  const { id } = useParams();
  const { mock, invoices, setInvoices, tools, setTools, family } = useStore();
  const [tab, setTab] = useState('Overview');
  const [openVisit, setOpenVisit] = useState(null);
  const [jewelPerm, setJewelPerm] = useState(() =>
    Object.fromEntries(mock.admin.jewels.map((j) => [j.id, j.permission]))
  );
  const [verified, setVerified] = useState({});
  const [famNotes, setFamNotes] = useState({});

  const client = mock.clients.find((c) => String(c.id) === String(id)) || mock.clients[0];
  const clientVisits = mock.visits.filter((v) => v.client_id === client.id)
    .sort((a, b) => b.visit_date.localeCompare(a.visit_date));
  const clientInvoices = invoices.filter((i) => i.client_id === client.id);
  const clientTools = tools.filter((t) => t.client_id === client.id);
  const clientFamily = family.filter((f) => f.client_id === client.id);
  const clientJewels = mock.admin.jewels.filter((j) => j.client_id === client.id);
  const revenue = clientInvoices.filter((i) => i.status === 'Paid').reduce((s, i) => s + i.amount, 0);

  const markPaid = (invId) =>
    setInvoices((list) => list.map((i) => (i.id === invId ? { ...i, status: 'Paid', paid_date: mock.admin.today.date } : i)));

  const addTool = () =>
    setTools((ts) => [...ts, {
      id: Date.now(), client_id: client.id, icon: '🧰', name: 'New tool (draft)',
      description: 'Added from admin — fill in name, URL, and status.', status: 'Awaiting Operator Access', status_note: '',
    }]);

  return (
    <AdminLayout title={client.full_name}>
      {/* tabs */}
      <nav className="mb-4 flex flex-wrap gap-1" aria-label="Client tabs">
        {TABS.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`min-h-touch rounded-btn px-3 py-2 font-semibold ${tab === t ? 'bg-navy text-cream' : 'border border-navy/40 text-navy'}`}
          >
            {t}
          </button>
        ))}
      </nav>

      {/* ---------------- Overview ---------------- */}
      {tab === 'Overview' && (
        <div className="grid gap-4 md:grid-cols-2">
          <div className="card !p-4">
            <div className="flex h-32 w-32 items-center justify-center rounded-card border-2 border-dashed border-charcoal/40 bg-charcoal/10 text-charcoal/60">
              Photo
            </div>
            <p className="mt-2 text-xl font-bold text-navy">{client.full_name} ({client.client_number})</p>
            <p><span className={`rounded-pill px-2 py-1 text-sm font-bold ${STATUS_STYLES[client.status]}`}>{client.status}</span>{' '}
              <span className="text-charcoal/80">{client.tier || 'No tier yet'}</span></p>
            <dl className="mt-3 space-y-1">
              <div><dt className="inline font-bold">Tech comfort: </dt><dd className="inline">{client.tech_comfort}</dd></div>
              <div><dt className="inline font-bold">Devices: </dt><dd className="inline">{client.devices}</dd></div>
              <div><dt className="inline font-bold">Phone: </dt><dd className="inline"><a href={`tel:${client.phone.replace(/[^0-9]/g, '')}`} className="underline">{client.phone}</a></dd></div>
              <div><dt className="inline font-bold">Email: </dt><dd className="inline">{client.email}</dd></div>
              <div><dt className="inline font-bold">Address: </dt><dd className="inline">{client.address}</dd></div>
              <div><dt className="inline font-bold">Family contact: </dt><dd className="inline">{clientFamily[0] ? `${clientFamily[0].name} (${clientFamily[0].relationship}) · ${clientFamily[0].phone}` : '—'}</dd></div>
            </dl>
          </div>
          <div>
            <div className="card !p-4">
              <p className="font-head text-4xl font-bold text-navy">${revenue}</p>
              <p className="text-charcoal/70">lifetime revenue</p>
              <dl className="mt-3 space-y-1">
                <div><dt className="inline font-bold">First contact: </dt><dd className="inline">Oct 10, 2025</dd></div>
                <div><dt className="inline font-bold">First visit: </dt><dd className="inline">{clientVisits[clientVisits.length - 1]?.visit_date}</dd></div>
                <div><dt className="inline font-bold">Found me via: </dt><dd className="inline">{client.source}</dd></div>
                <div><dt className="inline font-bold">Referred by: </dt><dd className="inline">{client.referred_by || '—'}</dd></div>
              </dl>
              <p className="mt-3 font-semibold text-success">✓ Data Consent: Confirmed Oct 10, 2025</p>
            </div>
            <div className="card mt-4 !border-warn !p-4">
              <p className="font-bold text-navy">Trust level notes</p>
              <p className="mt-1">{mock.admin.trust_notes[String(client.id)] || client.notes}</p>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- Visits ---------------- */}
      {tab === 'Visits' && (
        <div className="flex flex-col gap-3">
          {clientVisits.map((v) => (
            <article key={v.id} className="card !p-4">
              <button
                type="button"
                className="flex w-full flex-wrap items-center gap-2 text-left"
                onClick={() => setOpenVisit(openVisit === v.id ? null : v.id)}
                aria-expanded={openVisit === v.id}
              >
                <span className="text-lg font-bold text-navy">{v.visit_date} — {v.title}</span>
                <span className="text-charcoal/70">{v.duration_hours}h · ${v.amount_due} · {v.amount_paid >= v.amount_due && v.amount_due > 0 ? 'Paid' : v.amount_due === 0 ? 'Free' : 'Unpaid'}</span>
                <span className="ml-auto font-semibold text-navy">{openVisit === v.id ? '▾ less' : '▸ details'}</span>
              </button>
              {openVisit === v.id && (
                <dl className="mt-3 space-y-2 border-t border-navy/20 pt-3">
                  <div><dt className="font-bold">What they asked for</dt><dd>{v.asked_for || v.summary}</dd></div>
                  <div><dt className="font-bold">What I did</dt><dd>{v.did || v.notes}</dd></div>
                  <div><dt className="font-bold">What I left behind</dt><dd>{v.left_behind || '—'}</dd></div>
                  <div><dt className="font-bold">Tools used</dt><dd>{(v.tools_used || []).join(', ') || '—'}</dd></div>
                  <div><dt className="font-bold">Mood</dt><dd>{v.mood || '—'}</dd></div>
                  <div><dt className="font-bold">Follow-up</dt><dd>{v.follow_up || '—'}</dd></div>
                  <div><dt className="font-bold">Ethical checkpoint</dt><dd className="font-semibold text-success">{v.ethical || '—'}</dd></div>
                </dl>
              )}
            </article>
          ))}
        </div>
      )}

      {/* ---------------- Invoices ---------------- */}
      {tab === 'Invoices' && (
        <div className="flex flex-col gap-2">
          <div className="hidden grid-cols-[6rem_6rem_6rem_6rem_8rem_8rem] gap-2 px-2 text-sm font-bold text-charcoal/60 md:grid">
            <span>Date</span><span>Number</span><span>Amount</span><span>Method</span><span>Status</span><span></span>
          </div>
          {clientInvoices.map((i) => (
            <div key={i.id} className="card flex flex-wrap items-center gap-2 !p-3">
              <span>{i.issue_date}</span>
              <span className="font-semibold">{i.invoice_number}</span>
              <span>${i.amount} {i.currency}</span>
              <span>{i.payment_method || '—'}</span>
              <span className={`rounded-pill px-2 py-1 text-sm font-bold ${i.status === 'Paid' ? 'bg-success text-cream' : 'bg-warn text-cream'}`}>
                {i.status}
              </span>
              <span className="text-charcoal/70">{i.paid_date ? `receipt given (paid ${i.paid_date})` : 'no receipt yet'}</span>
              {i.status !== 'Paid' && (
                <button
                  type="button"
                  onClick={() => markPaid(i.id)}
                  className="ml-auto min-h-touch rounded-btn bg-success px-3 py-1 font-semibold text-cream"
                >
                  Mark Paid
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ---------------- Tools ---------------- */}
      {tab === 'Tools' && (
        <div className="flex flex-col gap-2">
          {clientTools.map((t) => (
            <div key={t.id} className="card flex flex-wrap items-center gap-3 !p-3">
              <span className="text-2xl" aria-hidden="true">{t.icon}</span>
              <span className="font-bold text-navy">{t.name}</span>
              <span className={`rounded-pill px-2 py-1 text-sm font-bold ${TOOL_STATUS[t.status] || 'bg-charcoal/10'}`}>
                {t.status}
              </span>
              <span className="text-charcoal/80">
                URL: {t.status === 'Awaiting Operator Access' ? <span className="font-semibold text-warn">Awaiting operator access</span> : 'https://tools.miforgefs.milyfe.fun/' + t.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}
              </span>
            </div>
          ))}
          <button
            type="button"
            onClick={addTool}
            className="min-h-touch w-full rounded-btn border-2 border-navy px-4 py-2 font-semibold text-navy md:w-auto"
          >
            + Add Tool
          </button>
        </div>
      )}

      {/* ---------------- Family (admin actions) ---------------- */}
      {tab === 'Family' && (
        <div className="flex flex-col gap-2">
          {clientFamily.map((f) => (
            <div key={f.id} className="card !p-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-bold text-navy">{f.name} ({f.relationship}) · {f.phone}</span>
                <span className="rounded-pill bg-navy px-2 py-1 text-sm font-bold text-cream">{f.role}</span>
              </div>
              <label className="mt-2 flex min-h-touch items-center gap-2">
                <input
                  type="checkbox"
                  className="h-6 w-6 accent-rust"
                  checked={!!verified[f.id]}
                  onChange={() => setVerified((v) => ({ ...v, [f.id]: !v[f.id] }))}
                />
                Verify identity
              </label>
              <p className="text-charcoal/70">Last contacted: {verified[f.id] ? 'today' : '—'}</p>
              <label className="mt-2 block">
                <span className="font-bold">Notes</span>
                <textarea
                  className="field mt-1"
                  rows="2"
                  placeholder="Notes about this family member..."
                  value={famNotes[f.id] || ''}
                  onChange={(e) => setFamNotes((n) => ({ ...n, [f.id]: e.target.value }))}
                />
              </label>
            </div>
          ))}
          {clientFamily.length === 0 && <p className="text-charcoal/70">No family members.</p>}
          <p className="text-sm text-charcoal/60">Roles available: {ROLES.map((r) => r.value).join(' · ')}</p>
        </div>
      )}

      {/* ---------------- Jewels ---------------- */}
      {tab === 'Jewels' && (
        <div className="flex flex-col gap-3">
          {clientJewels.map((j) => (
            <article key={j.id} className="card !p-5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-bold text-navy">{j.client}</span>
                <span className="rounded-pill bg-purple px-2 py-1 text-sm font-bold text-cream">{j.category}</span>
                <span className="text-charcoal/60">{j.date}</span>
              </div>
              <blockquote className="mt-2 font-head text-2xl leading-snug text-navy">"{j.quote}"</blockquote>
              <p className="mt-1 text-charcoal/70">{j.context}</p>
              <label className="mt-3 flex min-h-touch items-center gap-2 font-semibold">
                <input
                  type="checkbox"
                  className="h-6 w-6 accent-rust"
                  checked={!!jewelPerm[j.id]}
                  onChange={() => setJewelPerm((p) => ({ ...p, [j.id]: !p[j.id] }))}
                />
                Permission to Share
              </label>
              {!jewelPerm[j.id] && (
                <p className="text-sm font-semibold text-danger">
                  Nothing is shared without this toggle ON.
                </p>
              )}
            </article>
          ))}
          {clientJewels.length === 0 && <p className="text-charcoal/70">No jewels captured yet.</p>}
        </div>
      )}

      {/* ---------------- Consent Log (read-only, append-only look) ---------------- */}
      {tab === 'Consent Log' && (
        <div className="flex flex-col gap-2">
          <p className="mb-1 text-sm font-semibold text-charcoal/60">
            Read-only. Append-only — entries can never be edited or deleted from here.
          </p>
          {mock.admin.consent_entries.map((e, i) => (
            <div key={i} className="card flex items-baseline gap-3 border-l-4 border-l-success !p-3">
              <span className="shrink-0 font-mono text-sm text-charcoal/60">{e.date} · {e.time}</span>
              <span>{e.text}</span>
            </div>
          ))}
          <p className="mt-2">
            <Link to="/admin/clients" className="font-semibold text-navy underline">← all clients</Link>
          </p>
        </div>
      )}
    </AdminLayout>
  );
}
