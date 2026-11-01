import { Link, useLocation } from 'react-router-dom';
import Wordmark from '../components/Wordmark.jsx';
import { useStore } from '../store.jsx';

export default function ScreenShareEnded() {
  const location = useLocation();
  const { client } = useStore();
  const minutes = location.state?.minutes ?? 25; // spec default: 25 minutes
  const familyNotified = location.state?.familyNotified ?? true;

  return (
    <main className="min-h-screen bg-cream px-6 pb-10">
      <Wordmark />
      <div className="mx-auto mt-16 w-full max-w-2xl text-center">
        <h1 className="text-5xl">Screen sharing stopped.</h1>
        <p className="mt-6 text-3xl">Thanks for trusting us, {client.full_name}.</p>
        <p className="mt-4 text-2xl">Session lasted {minutes} minutes.</p>
        <p className="mt-2 text-2xl">{familyNotified ? 'Your family was notified.' : 'Your family was not notified.'}</p>
        <Link to="/" className="btn-green mt-10 inline-flex w-full">
          Back to Home
        </Link>
      </div>
    </main>
  );
}
