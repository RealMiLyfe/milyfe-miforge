import { useNavigate, Link } from 'react-router-dom';
import { useOnline } from '../App.jsx';
import { useStore } from '../store.jsx';

export default function Login() {
  const navigate = useNavigate();
  const { setOffline } = useOnline();
  const { mock } = useStore();
  const op = mock.meta.operator;

  const sendLink = (e) => {
    e.preventDefault(); // mock: no email is actually sent
    navigate('/login-sent');
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-cream px-6">
      <p className="font-head text-5xl font-bold text-navy">MiForge</p>

      <form onSubmit={sendLink} className="w-full max-w-md">
        <label htmlFor="email" className="mb-2 block text-2xl font-semibold text-navy">
          Enter your email
        </label>
        <input
          id="email"
          type="email"
          required
          autoComplete="email"
          className="field"
          placeholder="you@example.com"
        />
        <button type="submit" className="btn-rust mt-6 w-full">
          Send Login Link
        </button>
      </form>

      <p className="text-center text-[24px] font-semibold text-navy">
        Can't log in?{' '}
        <a href={op.tel} className="underline">
          Call MiForge: {op.phone}
        </a>
      </p>
      <p className="measure text-center text-lg text-charcoal/80">
        If you don't have email, we set this up with you in person.
      </p>

      <p className="text-sm text-charcoal/50">
        <Link to="/" className="underline">demo: open the portal as Bruce</Link>
        {' · '}
        <button type="button" onClick={() => setOffline(true)} className="underline">
          dev: simulate offline
        </button>
      </p>
    </main>
  );
}
