import { useState } from 'react';
import { Link } from 'react-router-dom';
import Wordmark from '../components/Wordmark.jsx';
import { useStore, ROLES } from '../store.jsx';

function RolePanel({ member, onChange }) {
  return (
    <fieldset className="mt-3 rounded-btn border-2 border-navy/30 p-4">
      <legend className="px-2 text-lg font-bold text-navy">Change access for {member.name}</legend>
      {ROLES.map((r) => (
        <label key={r.value} className="flex min-h-touch items-start gap-3 py-2 text-[22px]">
          <input
            type="radio"
            name={`role-${member.id}`}
            value={r.value}
            checked={member.role === r.value}
            onChange={() => onChange(member.id, r.value)}
            className="mt-2 h-7 w-7 shrink-0 accent-rust"
          />
          <span>
            <span className="font-semibold">{r.label}</span>
            <span className="block text-lg font-normal text-charcoal/80">{r.desc}</span>
          </span>
        </label>
      ))}
      {member.role === 'Decision Partner' && (
        <p className="mt-2 rounded-btn bg-cream p-3 text-lg text-charcoal/80">
          A Decision Partner is someone we check with before any big project (over $300) or ongoing
          monthly work. You stay in charge — we just make sure they agree too.
        </p>
      )}
    </fieldset>
  );
}

export default function Family() {
  const { family, setFamily } = useStore();
  const [openId, setOpenId] = useState(null);

  const changeRole = (id, role) =>
    setFamily((fs) => fs.map((f) => (f.id === id ? { ...f, role } : f)));
  const remove = (id) =>
    setFamily((fs) => fs.filter((f) => f.id !== id));

  return (
    <main className="min-h-screen bg-cream px-6 pb-10">
      <Wordmark />
      <div className="mx-auto mt-8 w-full max-w-2xl">
        <h1 className="text-4xl">Family Access</h1>
        <p className="measure mt-4 text-[22px]">
          Family Access lets people you trust see what we've done together — or help make
          decisions. You control who sees what. You can remove anyone at any time.
        </p>

        <div className="mt-6 space-y-4">
          {family.length === 0 && (
            <p className="text-2xl text-charcoal/70">No family members yet. Add one below.</p>
          )}
          {family.map((m) => (
            <article key={m.id} className="card">
              <h2 className="text-2xl">
                {m.name} ({m.relationship}) · {m.phone}
              </h2>
              <p className="mt-1 text-xl font-bold text-navy">{m.role}</p>
              <div className="mt-3 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => setOpenId(openId === m.id ? null : m.id)}
                  className="min-h-touch rounded-btn border-2 border-navy px-4 py-2 font-semibold text-navy"
                  aria-expanded={openId === m.id}
                >
                  {openId === m.id ? 'Close' : 'Change'}
                </button>
                <button
                  type="button"
                  onClick={() => remove(m.id)}
                  className="min-h-touch rounded-btn border-2 border-danger px-4 py-2 font-semibold text-danger"
                >
                  Remove
                </button>
              </div>
              {openId === m.id && <RolePanel member={m} onChange={changeRole} />}
            </article>
          ))}
        </div>

        <Link to="/family/manage/add" className="btn-navy mt-8 w-full">
          + Add a Family Member
        </Link>

        <p className="mt-8 text-center">
          <Link to="/" className="text-xl font-semibold text-navy underline">Back to Home</Link>
        </p>
      </div>
    </main>
  );
}
