import { useState } from 'react';
import { Link } from 'react-router-dom';
import Wordmark from '../components/Wordmark.jsx';
import { useStore } from '../store.jsx';

function formatDate(iso) {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  });
}

export default function Visits() {
  const { visits, invoices } = useStore();
  const [openReceipt, setOpenReceipt] = useState(null);

  const newestFirst = [...visits].sort((a, b) => b.visit_date.localeCompare(a.visit_date));

  return (
    <main className="min-h-screen bg-cream px-6 pb-10">
      <Wordmark />
      <div className="mx-auto mt-8 w-full max-w-2xl">
        <h1 className="text-4xl">Next Visit</h1>

        {/* Calendly embed placeholder */}
        <div className="mt-6 flex h-[300px] w-full flex-col items-center justify-center gap-2 rounded-card border-2 border-dashed border-charcoal/40 bg-charcoal/10 text-charcoal/70">
          <p className="text-2xl font-semibold">Calendly embed goes here</p>
          <p className="text-xl">Book your next visit</p>
        </div>

        <h2 className="mt-10 text-3xl">Visit history</h2>
        <div className="mt-4 space-y-4">
          {newestFirst.map((v) => {
            const inv = v.invoice_number ? invoices.find((i) => i.invoice_number === v.invoice_number) : null;
            const open = openReceipt === v.id;
            return (
              <article key={v.id} className="card">
                <h3 className="text-2xl">{formatDate(v.visit_date)} — {v.title}</h3>
                <p className="mt-2 text-[22px]">{v.summary}</p>
                <p className="mt-2 text-xl">
                  {v.duration_hours} hours · ${v.amount_due} ·{' '}
                  <span className={v.amount_paid >= v.amount_due && v.amount_due > 0 ? 'font-bold text-success' : 'font-semibold'}>
                    {v.amount_due > 0 ? (v.amount_paid >= v.amount_due ? 'Paid' : 'Unpaid') : 'Free'}
                  </span>
                  {v.payment_method ? ` · ${v.payment_method}` : ''}
                </p>
                {inv && (
                  <button
                    type="button"
                    onClick={() => setOpenReceipt(open ? null : v.id)}
                    className="mt-3 min-h-touch rounded-btn border-2 border-navy px-4 py-2 font-semibold text-navy"
                    aria-expanded={open}
                  >
                    {open ? 'Hide receipt' : 'View receipt'}
                  </button>
                )}
                {open && inv && (
                  <div className="mt-3 rounded-btn border border-navy/30 bg-cream p-4" aria-live="polite">
                    <p className="text-xl font-bold">Receipt {inv.invoice_number}</p>
                    <p className="text-lg">Issued {formatDate(inv.issue_date)} · Due {formatDate(inv.due_date)}</p>
                    <p className="text-lg">Amount: ${inv.amount} {inv.currency} · Status: {inv.status}</p>
                    {inv.payment_method && <p className="text-lg">Paid by: {inv.payment_method}{inv.paid_date ? ` on ${formatDate(inv.paid_date)}` : ''}</p>}
                    <p className="mt-1 text-lg text-charcoal/70">{inv.notes}</p>
                  </div>
                )}
              </article>
            );
          })}
        </div>

        <p className="mt-10">
          <Link to="/" className="text-xl font-semibold text-navy underline">Back to Home</Link>
        </p>
      </div>
    </main>
  );
}
