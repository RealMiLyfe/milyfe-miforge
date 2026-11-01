import { Link } from 'react-router-dom';
import { useStore } from '../../store.jsx';

export default function FamilyConcern() {
  const { mock } = useStore();
  const op = mock.meta.operator;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-cream px-6 text-center text-[18px]">
      <p className="font-head text-5xl font-bold text-navy">How to Raise a Concern</p>
      <p className="measure text-2xl">
        If something doesn't look right, call Carnell directly.
      </p>
      <a href={op.tel} className="btn-rust w-full max-w-md">📞 {op.phone}</a>
      <p className="text-2xl">
        You can also email{' '}
        <a href="mailto:carnell@miforgefs.milyfe.fun" className="font-semibold text-navy underline">carnell@miforgefs.milyfe.fun</a>
      </p>
      <p className="measure text-xl text-charcoal/80">
        We take family concerns seriously. Every concern is logged and addressed within 24 hours.
      </p>
      <p className="mt-6">
        <Link to="/family/login" className="text-xl font-semibold text-navy underline">← back to family login</Link>
      </p>
    </main>
  );
}
