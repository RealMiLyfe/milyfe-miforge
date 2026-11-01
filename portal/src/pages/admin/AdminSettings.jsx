import { useState } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from './AdminLayout.jsx';
import { useStore } from '../../store.jsx';

export default function AdminSettings() {
  const { mock } = useStore();
  const [flags, setFlags] = useState(() =>
    Object.fromEntries(mock.admin.flags.map((f) => [f.key, f.on]))
  );
  const b = mock.admin.brand;

  return (
    <AdminLayout title="Settings">
      {/* feature flags */}
      <section>
        <h2 className="mb-2 font-head text-2xl text-navy">Feature flags</h2>
        <p className="mb-3 text-charcoal/70">
          These control what the public marketing site claims. Keep them OFF until the proof exists.
        </p>
        <div className="flex flex-col gap-2">
          {mock.admin.flags.map((f) => (
            <label key={f.key} className="card flex min-h-touch items-start gap-3 !p-4">
              <input
                type="checkbox"
                className="mt-1 h-7 w-7 shrink-0 accent-rust"
                checked={!!flags[f.key]}
                onChange={() => setFlags((s) => ({ ...s, [f.key]: !s[f.key] }))}
              />
              <span>
                <span className="font-bold">{f.label}</span>
                <span className="ml-2 rounded-pill bg-charcoal/10 px-2 py-1 text-xs font-bold">
                  {flags[f.key] ? 'ON' : 'OFF'}
                </span>
                <span className="mt-1 block text-sm text-charcoal/70">{f.note}</span>
              </span>
            </label>
          ))}
        </div>
        <p className="mt-2 text-sm text-charcoal/60">
          The marketing site reads the same flags from <code>site/src/data/flags.json</code> — flip them there too when you turn one ON.
        </p>
      </section>

      {/* brand config viewer (read-only) */}
      <section className="mt-8">
        <h2 className="mb-2 font-head text-2xl text-navy">Brand config (read-only)</h2>
        <div className="card !p-4">
          <dl className="space-y-1">
            <div><dt className="inline font-bold">Brand name: </dt><dd className="inline">{b.name}</dd></div>
            <div><dt className="inline font-bold">Phone: </dt><dd className="inline">{b.phone}</dd></div>
            <div><dt className="inline font-bold">Domain: </dt><dd className="inline">{b.domain}</dd></div>
            <div>
              <dt className="inline font-bold">Colors: </dt>
              <dd className="inline-flex gap-2">
                {Object.entries(b.colors).map(([k, v]) => (
                  <span key={k} className="inline-flex items-center gap-1">
                    <span className="inline-block h-4 w-4 rounded-sm border border-charcoal/30" style={{ backgroundColor: v }} aria-hidden="true"></span>
                    {k} <code className="text-sm">{v}</code>
                  </span>
                ))}
              </dd>
            </div>
          </dl>
        </div>
      </section>

      <p className="mt-8">
        <Link to="/system" className="font-semibold text-navy underline">System overview →</Link>
      </p>
    </AdminLayout>
  );
}
