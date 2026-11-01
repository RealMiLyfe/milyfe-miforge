import { Link } from 'react-router-dom';
import Wordmark from '../components/Wordmark.jsx';
import { useStore } from '../store.jsx';

const STATUS_STYLES = {
  Ready: 'bg-success text-cream',
  'Awaiting Operator Access': 'bg-warn text-cream',
};

export default function Tools() {
  const { tools } = useStore();

  return (
    <main className="min-h-screen bg-cream px-6 pb-10">
      <Wordmark />
      <div className="mx-auto mt-8 w-full max-w-2xl">
        <h1 className="text-4xl">My Tools</h1>

        <div className="mt-6 space-y-4">
          {tools.map((t) => (
            <article key={t.id} className="card">
              <p className="text-5xl" aria-hidden="true">{t.icon}</p>
              <h2 className="mt-2 text-3xl">{t.name}</h2>
              <p className="mt-2 text-[22px]">{t.description}</p>
              <p className={`mt-3 inline-block rounded-pill px-4 py-2 text-lg font-bold ${STATUS_STYLES[t.status] || 'bg-charcoal/10 text-charcoal'}`}>
                {t.status}
              </p>
              {t.status_note && (
                <p className="mt-2 text-lg text-charcoal/70">{t.status_note}</p>
              )}
            </article>
          ))}
        </div>

        {tools.length === 0 && (
          <p className="measure mt-6 text-2xl text-charcoal/70">
            More tools will appear here as we work together.
          </p>
        )}
        {tools.length > 0 && (
          <p className="measure mt-6 text-lg text-charcoal/70">
            More tools will appear here as we work together.
          </p>
        )}

        <p className="mt-10">
          <Link to="/" className="text-xl font-semibold text-navy underline">Back to Home</Link>
        </p>
      </div>
    </main>
  );
}
