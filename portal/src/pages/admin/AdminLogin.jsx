import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../../store.jsx';

// Operator-only back office. Mock auth: password comes from mock.admin.password
// ("miforge-admin"). No magic link, no "forgot password" — this is for you only.
export default function AdminLogin() {
  const { mock, setAdminAuthed } = useStore();
  const navigate = useNavigate();
  const [pw, setPw] = useState('');
  const [err, setErr] = useState('');

  const submit = (e) => {
    e.preventDefault();
    if (pw === mock.admin.password) {
      setAdminAuthed(true);
      navigate('/admin');
    } else {
      setErr('Wrong password. This area is for the operator only.');
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-navy px-6 text-cream">
      <p className="font-head text-5xl font-bold">MiForge Operator</p>
      <p className="text-xl text-cream/80">Back office. Operator only.</p>

      <form onSubmit={submit} className="w-full max-w-sm">
        <label htmlFor="pw" className="mb-2 block text-xl font-semibold">
          Password
        </label>
        <input
          id="pw"
          type="password"
          autoComplete="current-password"
          className="field"
          value={pw}
          onChange={(e) => { setPw(e.target.value); setErr(''); }}
        />
        {err && <p className="mt-2 font-semibold text-[#ffb3a6]">{err}</p>}
        <button type="submit" className="btn-rust mt-4 w-full">Log In</button>
      </form>

      <p className="text-sm text-cream/60">local dev password: miforge-admin</p>
      <p className="text-sm">
        <Link to="/" className="text-cream/80 underline">← back to client portal</Link>
        {' · '}
        <Link to="/family/login" className="text-cream/80 underline">family portal</Link>
      </p>
    </main>
  );
}
