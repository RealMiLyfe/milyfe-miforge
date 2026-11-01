import { useState } from 'react';
import AdminLayout from './AdminLayout.jsx';
import { useStore } from '../../store.jsx';

const STATUS_STYLES = {
  Active: 'bg-success text-cream',
  'Awaiting Operator Access': 'bg-warn text-cream',
  Draft: 'bg-charcoal/20 text-charcoal',
};

export default function AdminTemplates() {
  const { mock, tools, setTools } = useStore();
  const [openId, setOpenId] = useState(null);
  const [pickClient, setPickClient] = useState('1');
  const [deployed, setDeployed] = useState([]);

  const deploy = (tpl) => {
    const client = mock.clients.find((c) => String(c.id) === pickClient);
    setTools((ts) => [...ts, {
      id: Date.now(), client_id: client.id, icon: '🧰',
      name: tpl.name, description: `Deployed template: ${tpl.name}`,
      status: tpl.status === 'Active' ? 'Ready' : 'Awaiting Operator Access',
      status_note: tpl.note || '',
    }]);
    setDeployed((d) => [...d, `${tpl.name} → ${client.full_name}`]);
    setOpenId(null);
  };

  return (
    <AdminLayout title="Templates">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {mock.admin.templates.map((t) => (
          <article key={t.id} className="card flex min-h-[12rem] flex-col !p-4">
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-lg font-bold text-navy">{t.name}</h2>
              <span className={`rounded-pill px-2 py-1 text-xs font-bold ${STATUS_STYLES[t.status] || STATUS_STYLES.Draft}`}>
                {t.status}
              </span>
            </div>
            <p className="mt-1 text-sm text-charcoal/70">
              {t.category} · used {t.times_used}× · difficulty {t.difficulty}
            </p>
            {t.note && <p className="mt-1 text-sm font-semibold text-warn">{t.note}</p>}
            <button
              type="button"
              onClick={() => setOpenId(openId === t.id ? null : t.id)}
              className="mt-auto min-h-touch rounded-btn bg-navy px-3 py-2 font-semibold text-cream"
              aria-expanded={openId === t.id}
            >
              Deploy to Client
            </button>
            {openId === t.id && (
              <div className="mt-2 rounded-btn border-2 border-navy/30 p-3">
                <label htmlFor={`pick-${t.id}`} className="mb-1 block text-sm font-bold">Pick a client</label>
                <select
                  id={`pick-${t.id}`}
                  className="field !min-h-touch"
                  value={pickClient}
                  onChange={(e) => setPickClient(e.target.value)}
                >
                  {mock.clients.map((c) => (
                    <option key={c.id} value={c.id}>{c.full_name}</option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => deploy(t)}
                  className="btn-rust mt-2 w-full !text-lg"
                >
                  Confirm deploy
                </button>
              </div>
            )}
          </article>
        ))}
      </div>

      {deployed.length > 0 && (
        <div className="card mt-4 !border-success !p-4">
          <p className="font-bold text-success">Deployed:</p>
          <ul className="list-disc pl-5">
            {deployed.map((d, i) => <li key={i}>{d}</li>)}
          </ul>
          <p className="mt-1 text-sm text-charcoal/70">
            The tool now appears in that client's profile → Tools tab and in their portal.
          </p>
        </div>
      )}
    </AdminLayout>
  );
}
