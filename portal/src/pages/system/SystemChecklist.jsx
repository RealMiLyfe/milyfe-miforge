import { useState } from 'react';
import SystemNav from './SystemNav.jsx';
import { useStore } from '../../store.jsx';

export default function SystemChecklist() {
  const { mock } = useStore();
  const items = mock.system.checklist;
  const [checked, setChecked] = useState(() => items.map((i) => i.done));

  const doneCount = checked.filter(Boolean).length;
  const cloudCount = items.length - items.filter((i) => i.done).length; // pre-checked = local demo done
  const pct = Math.round((doneCount / items.length) * 100);

  return (
    <SystemNav title="Launch Readiness Checklist (50 points)">
      {/* progress bar */}
      <div className="card !p-4">
        <div className="h-6 w-full overflow-hidden rounded-pill bg-charcoal/10" role="progressbar" aria-valuenow={doneCount} aria-valuemin={0} aria-valuemax={items.length}>
          <div className="h-full bg-success" style={{ width: `${pct}%` }}></div>
        </div>
        <p className="mt-2 font-bold text-navy">
          {doneCount}/50 ready for local demo · {cloudCount}/50 need cloud deployment
        </p>
        <p className="text-sm text-charcoal/70">
          Green = done in this local demo. The rest need the Oracle VM / Cloudflare / Backblaze
          deployment. Click any box to toggle it (demo).
        </p>
      </div>

      <ol className="mt-4 grid gap-2 sm:grid-cols-2">
        {items.map((item, i) => (
          <li key={i}>
            <label className={`card flex min-h-touch items-start gap-3 !p-3 ${checked[i] ? '' : 'opacity-80'}`}>
              <input
                type="checkbox"
                className="mt-1 h-6 w-6 shrink-0 accent-rust"
                checked={checked[i]}
                onChange={() => setChecked((c) => c.map((x, idx) => (idx === i ? !x : x)))}
              />
              <span className={checked[i] ? 'text-charcoal' : 'text-charcoal/70'}>
                {checked[i] ? '☑' : '☐'} {item.label}
              </span>
            </label>
          </li>
        ))}
      </ol>
    </SystemNav>
  );
}
