import { useState } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from './AdminLayout.jsx';
import { useStore } from '../../store.jsx';

const STATUS_STYLES = {
  Active: 'bg-success text-cream',
  Completed: 'bg-navy text-cream',
  Lead: 'bg-warn text-cream',
};

const AVATAR_COLORS = ['#1B3A5C', '#7A8B5C', '#8B7AA6', '#C65D3B', '#6B8CA6'];

function initials(name) {
  return name.split(/[^A-Za-z]+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase();
}

function lifetime(invoices, clientId) {
  return invoices
    .filter((i) => i.client_id === clientId && i.status === 'Paid')
    .reduce((s, i) => s + i.amount, 0);
}

export default function AdminClients() {
  const { mock, invoices } = useStore();
  const [q, setQ] = useState('');

  const rows = mock.clients.filter((c) =>
    c.full_name.toLowerCase().includes(q.toLowerCase())
  );

  const row = (c, i) => (
    <Link
      key={c.id}
      to={`/admin/clients/${c.id}`}
      className="card flex flex-wrap items-center gap-3 !p-3 hover:shadow-elev1"
    >
      <span
        className="flex h-12 w-12 items-center justify-center rounded-pill font-head text-lg font-bold text-cream"
        style={{ backgroundColor: AVATAR_COLORS[i % AVATAR_COLORS.length] }}
        aria-hidden="true"
      >
        {initials(c.full_name)}
      </span>
      <span className="min-w-[8rem] font-bold text-navy">{c.full_name}</span>
      <span className={`rounded-pill px-3 py-1 text-sm font-bold ${STATUS_STYLES[c.status] || 'bg-charcoal/10'}`}>
        {c.status}
      </span>
      <span className="text-charcoal/80">Last visit: {c.last_visit_date}</span>
      <span className="font-semibold">${lifetime(invoices, c.id)}</span>
      <span className="text-charcoal/80">{c.tier || '—'}</span>
    </Link>
  );

  return (
    <AdminLayout title="Clients">
      <label htmlFor="search" className="sr-only">Search clients</label>
      <input
        id="search"
        className="field mb-4 max-w-md"
        placeholder="Search clients..."
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />

      {/* cards (mobile-first); on desktop they read as dense rows */}
      <div className="flex flex-col gap-2">
        <div className="hidden grid-cols-[3rem_1fr_6rem_8rem_6rem_6rem] items-center gap-3 px-3 text-sm font-bold text-charcoal/60 md:grid">
          <span></span><span>Name</span><span>Status</span><span>Last Visit</span><span>Lifetime</span><span>Tier</span>
        </div>
        {rows.map(row)}
        {rows.length === 0 && <p className="text-charcoal/70">No clients match "{q}".</p>}
      </div>
    </AdminLayout>
  );
}
