import { useState } from 'react';
import { Link } from 'react-router-dom';
import SystemNav from './SystemNav.jsx';
import { useStore } from '../../store.jsx';

export default function SystemFlow() {
  const { mock } = useStore();
  const steps = mock.system.flow_steps;
  const [i, setI] = useState(0);
  const s = steps[i];

  return (
    <SystemNav title="A Day in the Life — Margaret's visit, end to end">
      <div className="card !p-6">
        <p className="text-sm font-bold text-charcoal/60">Step {i + 1} of {steps.length}</p>
        <p className="mt-2 text-5xl" aria-hidden="true">{s.icon}</p>
        <h2 className="mt-2 font-head text-3xl text-navy">{s.title}</h2>
        <p className="measure mt-2 text-lg">{s.text}</p>

        {/* mock "screenshot" placeholder */}
        <div className="mt-4 flex h-40 w-full max-w-md items-center justify-center rounded-card border-2 border-dashed border-charcoal/40 bg-charcoal/10 text-charcoal/70">
          {s.visual}
        </div>

        <div className="mt-6 flex items-center gap-3">
          <button
            type="button"
            onClick={() => setI((x) => Math.max(0, x - 1))}
            disabled={i === 0}
            className="min-h-touch rounded-btn border-2 border-navy px-5 py-2 font-semibold text-navy disabled:opacity-40"
          >
            ← Back
          </button>
          <button
            type="button"
            onClick={() => setI((x) => Math.min(steps.length - 1, x + 1))}
            disabled={i === steps.length - 1}
            className="btn-rust !text-xl disabled:opacity-40"
          >
            Next →
          </button>
          <div className="ml-2 flex gap-1" aria-hidden="true">
            {steps.map((_, d) => (
              <span key={d} className={`h-3 w-3 rounded-pill ${d === i ? 'bg-rust' : 'bg-charcoal/20'}`}></span>
            ))}
          </div>
        </div>
      </div>

      <p className="mt-4">
        <Link to="/system" className="font-semibold text-navy underline">← architecture diagram</Link>
      </p>
    </SystemNav>
  );
}
