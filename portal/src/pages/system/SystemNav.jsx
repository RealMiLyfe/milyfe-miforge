import { NavLink, Link } from 'react-router-dom';

const LINKS = [
  ['/system', 'Architecture'],
  ['/system/flow', 'A Day in the Life'],
  ['/system/memory', 'Memory Budget'],
  ['/system/checklist', 'Launch Checklist'],
];

export default function SystemNav({ title, children }) {
  const cls = ({ isActive }) =>
    `min-h-touch rounded-btn px-4 py-2 font-semibold ${isActive ? 'bg-navy text-cream' : 'border border-navy/40 text-navy'}`;

  return (
    <main className="min-h-screen bg-cream px-4 pb-10 pt-6 text-[16px]">
      <header className="mx-auto max-w-6xl">
        <Link to="/" className="font-head text-2xl font-bold text-navy">MiForge FS</Link>
        <span className="ml-2 text-charcoal/60">/ system overview</span>
        <nav className="mt-3 flex flex-wrap gap-2" aria-label="System sections">
          {LINKS.map(([to, label]) => (
            <NavLink key={to} to={to} end={to === '/system'} className={cls}>{label}</NavLink>
          ))}
          <NavLink to="/admin/login" className={cls}>Operator admin</NavLink>
        </nav>
        <h1 className="mt-6 font-head text-4xl text-navy">{title}</h1>
      </header>
      <div className="mx-auto mt-6 max-w-6xl">{children}</div>
    </main>
  );
}
