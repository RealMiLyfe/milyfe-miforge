import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../../store.jsx';

export default function FamilyLogin() {
  const { mock, setFamilySession } = useStore();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [err, setErr] = useState('');
  const op = mock.meta.operator;

  const loginAs = (persona) => {
    setFamilySession({
      name: persona.name,
      level: persona.level,
      client: persona.client,
      client_relation: persona.client_relation,
    });
    navigate('/family');
  };

  const submit = (e) => {
    e.preventDefault();
    const p = mock.family_portal.personas.find(
      (x) => x.email.toLowerCase() === email.trim().toLowerCase()
    );
    if (p) loginAs(p);
    else setErr("We couldn't find that email. Questions? Call John.");
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-cream px-6 text-center">
      <p className="font-head text-5xl font-bold text-navy">MiForge Family Access</p>

      <form onSubmit={submit} className="w-full max-w-md">
        <label htmlFor="femail" className="mb-2 block text-left text-2xl font-semibold text-navy">
          Enter the email John gave you
        </label>
        <input
          id="femail"
          type="email"
          required
          className="field"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => { setEmail(e.target.value); setErr(''); }}
        />
        {err && <p className="mt-2 text-left font-semibold text-danger">{err}</p>}
        <button type="submit" className="btn-rust mt-6 w-full">Log In</button>
      </form>

      <p className="text-[24px] font-semibold text-navy">
        Questions?{' '}
        <a href={op.tel} className="underline">Call John: {op.phone}</a>
      </p>

      {/* dev demo personas */}
      <div className="mt-4 w-full max-w-md rounded-card border-2 border-dashed border-charcoal/30 p-4 text-left">
        <p className="mb-2 text-sm font-bold text-charcoal/60">demo: log in as</p>
        {mock.family_portal.personas.map((p) => (
          <button
            key={p.email}
            type="button"
            onClick={() => loginAs(p)}
            className="mb-2 min-h-touch w-full rounded-btn border-2 border-navy px-4 py-2 text-left font-semibold text-navy"
          >
            {p.name} ({p.relationship}) — {p.level}
          </button>
        ))}
      </div>

      <p className="text-sm text-charcoal/50">
        <Link to="/" className="underline">client portal</Link> ·{' '}
        <Link to="/family/concern" className="underline">raise a concern</Link>
      </p>
    </main>
  );
}
