import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Wordmark from '../components/Wordmark.jsx';
import { useStore } from '../store.jsx';

// MOST IMPORTANT SCREEN - consent for remote screen sharing.
export default function ScreenShare() {
  const navigate = useNavigate();
  const { family } = useStore();
  const [notifyFamily, setNotifyFamily] = useState(true);
  const firstFamily = family[0];

  const start = () => {
    navigate('/screen-share/active', { state: { familyNotified: notifyFamily } });
  };

  return (
    <main className="min-h-screen bg-cream px-6 pb-10">
      <Wordmark />
      <div className="mx-auto mt-8 w-full max-w-2xl">
        <h1 className="text-4xl">Share Your Screen with Carnell</h1>

        <div className="card mt-6 text-[22px]">
          <p className="font-bold">When this is ON:</p>
          <p className="mt-2">✓ Carnell can see what's on your screen</p>
          <p className="mt-1">✓ Carnell can move your mouse and type for you</p>

          <p className="mt-4 font-bold">When this is OFF:</p>
          <p className="mt-2">✗ Carnell cannot see your screen</p>
          <p className="mt-1">✗ Carnell cannot control your computer</p>

          <p className="mt-4">
            Carnell will not open your banking or passwords unless you ask him to and watch him do it.
          </p>
        </div>

        {/* family notify toggle */}
        <label className="card mt-6 flex min-h-touch items-start gap-4 text-[22px] font-semibold">
          <input
            type="checkbox"
            checked={notifyFamily}
            onChange={(e) => setNotifyFamily(e.target.checked)}
            className="mt-2 h-8 w-8 shrink-0 accent-rust"
          />
          <span>
            Also notify my family that I'm sharing my screen
            {notifyFamily && firstFamily && (
              <span className="mt-1 block text-lg font-normal text-charcoal/70">
                {firstFamily.name} will be notified
              </span>
            )}
          </span>
        </label>

        {/* honesty note */}
        <p className="measure mt-6 text-lg text-charcoal/80">
          If the RustDesk app stays open on your computer after you stop sharing, Carnell could
          technically still see your screen. If you're worried, close the RustDesk app — the small
          icon near the clock in the corner of your screen.
        </p>

        {/* huge green START button */}
        <button type="button" onClick={start} className="btn-green mt-8 w-full !py-6 text-[32px]">
          START SHARING
        </button>

        <p className="mt-6 text-center">
          <Link to="/" className="text-[24px] font-semibold text-navy underline">Cancel</Link>
        </p>
      </div>
    </main>
  );
}
