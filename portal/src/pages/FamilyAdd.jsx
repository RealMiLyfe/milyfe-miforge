import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Wordmark from '../components/Wordmark.jsx';
import { useStore, ROLES } from '../store.jsx';

export default function FamilyAdd() {
  const { family, setFamily, client } = useStore();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [relationship, setRelationship] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('Limited View');

  const add = (e) => {
    e.preventDefault(); // mock: no backend
    setFamily((fs) => [
      ...fs,
      {
        id: Date.now(),
        client_id: client.id,
        name: name.trim(),
        relationship: relationship.trim() || 'Family',
        phone: phone.trim(),
        role,
      },
    ]);
    navigate('/family');
  };

  return (
    <main className="min-h-screen bg-cream px-6 pb-10">
      <Wordmark />
      <div className="mx-auto mt-8 w-full max-w-2xl">
        <h1 className="text-4xl">Add a Family Member</h1>

        <form onSubmit={add} className="card mt-6 space-y-5">
          <div>
            <label htmlFor="f-name" className="mb-1 block text-xl font-semibold">Name</label>
            <input id="f-name" className="field" required value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <label htmlFor="f-rel" className="mb-1 block text-xl font-semibold">Relationship (e.g. Daughter)</label>
            <input id="f-rel" className="field" value={relationship} onChange={(e) => setRelationship(e.target.value)} />
          </div>
          <div>
            <label htmlFor="f-phone" className="mb-1 block text-xl font-semibold">Phone</label>
            <input id="f-phone" type="tel" className="field" required value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>

          <fieldset>
            <legend className="text-xl font-bold text-navy">What can they see?</legend>
            {ROLES.map((r) => (
              <label key={r.value} className="flex min-h-touch items-start gap-3 py-2 text-[22px]">
                <input
                  type="radio"
                  name="role"
                  value={r.value}
                  checked={role === r.value}
                  onChange={() => setRole(r.value)}
                  className="mt-2 h-7 w-7 shrink-0 accent-rust"
                />
                <span>
                  <span className="font-semibold">{r.label}</span>
                  <span className="block text-lg font-normal text-charcoal/80">{r.desc}</span>
                </span>
              </label>
            ))}
            {role === 'Decision Partner' && (
              <p className="mt-2 rounded-btn bg-cream p-3 text-lg text-charcoal/80">
                A Decision Partner is someone we check with before any big project (over $300) or
                ongoing monthly work. You stay in charge — we just make sure they agree too.
              </p>
            )}
          </fieldset>

          <button type="submit" className="btn-rust w-full">Add</button>
        </form>

        <p className="mt-6 text-center">
          <Link to="/family/manage" className="text-[24px] font-semibold text-navy underline">Cancel</Link>
        </p>
      </div>
    </main>
  );
}
