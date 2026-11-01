import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function fmt(sec) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

export default function ScreenShareActive() {
  const navigate = useNavigate();
  const location = useLocation();
  const familyNotified = location.state?.familyNotified ?? true;
  const [seconds, setSeconds] = useState(0);
  const startRef = useRef(Date.now());

  useEffect(() => {
    const t = setInterval(() => setSeconds(Math.floor((Date.now() - startRef.current) / 1000)), 1000);
    return () => clearInterval(t);
  }, []);

  const stop = () => {
    const minutes = Math.max(1, Math.round((Date.now() - startRef.current) / 60000));
    navigate('/screen-share/ended', { state: { familyNotified, minutes: Math.min(minutes, 25) } });
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 bg-[#B34040] px-6 text-center text-cream">
      <p className="text-[28px] font-semibold" aria-live="polite">
        Sharing for {fmt(seconds)}
      </p>

      <p className="text-2xl font-bold">
        {familyNotified ? 'Family notified ✓' : 'Family not notified'}
      </p>

      {/* huge red STOP button, 200x200 minimum */}
      <button
        type="button"
        onClick={stop}
        className="flex h-[200px] w-[200px] items-center justify-center rounded-card border-4 border-cream bg-danger text-[28px] font-bold text-cream shadow-elev1"
      >
        STOP SHARING
      </button>

      <p className="measure text-lg text-cream/90">
        To close the connection completely, also close the RustDesk app on your computer.
      </p>
    </main>
  );
}
