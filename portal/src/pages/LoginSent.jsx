import { Link } from 'react-router-dom';
import { useStore } from '../store.jsx';

export default function LoginSent() {
  const { mock } = useStore();
  const op = mock.meta.operator;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-cream px-6 text-center">
      <p className="font-head text-5xl font-bold text-navy">MiForge</p>
      <h1 className="text-4xl">Check your email!</h1>
      <p className="text-2xl">We sent you a link.</p>
      <p className="text-[24px] font-semibold text-navy">
        Didn't get it?{' '}
        <a href={op.tel} className="underline">
          Call {op.phone}
        </a>
        .
      </p>
      <p className="mt-6">
        <Link to="/login" className="text-2xl font-semibold text-navy underline">
          Go back
        </Link>
      </p>
      <p className="text-sm text-charcoal/50">
        <Link to="/" className="underline">demo: open the portal as Bruce</Link>
      </p>
    </main>
  );
}
