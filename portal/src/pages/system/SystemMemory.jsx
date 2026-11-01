import SystemNav from './SystemNav.jsx';
import { useStore } from '../../store.jsx';

export default function SystemMemory() {
  const { mock } = useStore();
  const m = mock.system.memory;
  const used = m.segments.reduce((s, x) => s + x.gb, 0);
  const free = m.budget_gb - used;
  const pct = (gb) => `${(gb / m.budget_gb) * 100}%`;
  const redAt = (m.red_line_gb / m.budget_gb) * 100;

  return (
    <SystemNav title="Memory Budget — 24 GB VM">
      <p className="mb-4 max-w-measure text-charcoal/80">
        Every container has a hard memory limit. Week 1 services are solid, Week 2 lighter.
        Free space stays cream. The red line at {m.red_line_gb} GB is the "don't cross" mark —
        it leaves 2 GB for the OS.
      </p>

      {/* stacked bar */}
      <div className="relative">
        <div className="flex h-20 w-full overflow-hidden rounded-card border border-navy/30" role="img" aria-label={`Memory budget: ${used} GB used of ${m.budget_gb} GB, ${free.toFixed(2)} GB free`}>
          {m.segments.map((s) => (
            <div
              key={s.label}
              title={`${s.label}: ${s.gb} GB (week ${s.week})`}
              style={{ width: pct(s.gb), backgroundColor: s.color, opacity: s.week === 2 ? 0.45 : 1 }}
              className="flex items-center justify-center overflow-hidden"
            >
              {s.gb >= 1 && <span className="px-1 text-xs font-bold text-cream">{s.label}</span>}
            </div>
          ))}
          <div
            className="flex items-center justify-center bg-cream text-charcoal/70"
            style={{ width: pct(free) }}
            title={`Free: ${free.toFixed(2)} GB`}
          >
            free {free.toFixed(1)} GB
          </div>
        </div>
        {/* red line at 22 GB */}
        <div className="absolute -top-2 bottom-[-8px] w-0.5 bg-danger" style={{ left: `${redAt}%` }} aria-hidden="true"></div>
        <p className="mt-2 text-right text-sm font-bold text-danger">▲ {m.red_line_gb} GB — don't cross (2 GB left for OS)</p>
      </div>

      {/* legend / table */}
      <div className="mt-6 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {m.segments.map((s) => (
          <div key={s.label} className="card flex items-center gap-2 !p-3">
            <span
              className="inline-block h-4 w-4 shrink-0 rounded-sm"
              style={{ backgroundColor: s.color, opacity: s.week === 2 ? 0.45 : 1 }}
              aria-hidden="true"
            ></span>
            <span className="font-semibold">{s.label}</span>
            <span className="ml-auto text-charcoal/70">{s.gb} GB · wk {s.week}</span>
          </div>
        ))}
        <div className="card flex items-center gap-2 !p-3">
          <span className="inline-block h-4 w-4 rounded-sm bg-cream ring-1 ring-charcoal/30" aria-hidden="true"></span>
          <span className="font-semibold">free</span>
          <span className="ml-auto text-charcoal/70">{free.toFixed(2)} GB</span>
        </div>
      </div>

      <p className="mt-4 text-charcoal/70">
        Laptop dev stack (Phase 1) is a tighter ~5.3 GB of an 8 GB budget — same limits, smaller
        machine. See <code>README-LOCAL.md</code>.
      </p>
    </SystemNav>
  );
}
