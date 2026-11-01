import { useState } from 'react';
import { useStore } from '../store.jsx';

const KEY = 'miforge_welcomed';

// First-time welcome - shown once per browser (localStorage), dismissable.
export default function WelcomeOverlay() {
  const { client, mock } = useStore();
  const [show, setShow] = useState(() => !localStorage.getItem(KEY));

  if (!show) return null;

  const dismiss = () => {
    localStorage.setItem(KEY, '1');
    setShow(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/50 p-6" role="dialog" aria-modal="true" aria-labelledby="welcome-h">
      <div className="card w-full max-w-lg p-8">
        <h1 id="welcome-h" className="text-4xl">Welcome to MiForge Founder Services, {client.full_name}!</h1>
        <p className="mt-4 text-2xl">This is your home screen. Tap any button to get started.</p>
        <p className="mt-4 text-2xl">The teal button calls John. The blue button books a visit.</p>
        <p className="mt-4 text-2xl">
          Got questions?{' '}
          <a href={mock.meta.operator.tel} className="font-semibold text-navy underline">
            Call {mock.meta.operator.phone}
          </a>
          .
        </p>
        <button type="button" onClick={dismiss} className="btn-rust mt-8 w-full">
          Got it!
        </button>
      </div>
    </div>
  );
}
