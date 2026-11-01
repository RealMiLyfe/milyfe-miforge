import { useOnline } from '../App.jsx';
import { useStore } from '../store.jsx';

// Shown whenever the app detects no connection (or the dev toggle is used).
export default function OfflineScreen() {
  const { setOffline } = useOnline();
  const { mock } = useStore();
  const op = mock.meta.operator;

  return (
    <main class="flex min-h-screen flex-col items-center justify-center gap-6 bg-cream px-6 text-center opacity-90">
      <p class="font-head text-4xl font-bold text-navy">You're offline.</p>
      <p class="measure text-2xl">You can still call John.</p>
      <a href={op.tel} class="btn-rust w-full max-w-md text-[28px]">
        📞 Call {op.phone}
      </a>
      <p class="text-lg text-charcoal/70">
        Everything else is greyed out until you're back online.
      </p>
      {/* dev-only toggle to simulate coming back online */}
      <button
        type="button"
        onClick={() => setOffline(false)}
        class="mt-8 text-sm text-charcoal/50 underline"
      >
        dev: simulate back online
      </button>
    </main>
  );
}
