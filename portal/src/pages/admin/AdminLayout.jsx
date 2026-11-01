import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useStore } from '../../store.jsx';

// Back-office shell: dark navy top bar signals "this is the operator area".
// Content is dense: 16px base (operator is sighted and fast).
export default function AdminLayout({ children, title }) {
  const { setAdminAuthed, mock } = useStore();
  const navigate = useNavigate();

  const logout = () => {
    setAdminAuthed(false);
    navigate('/admin/login');
  };

  const linkCls = ({ isActive }) =>
    `rounded-btn px-3 py-2 font-semibold ${isActive ? 'bg-cream text-navy' : 'text-cream hover:bg-white/10'}`;

  return (
    <div className="min-h-screen bg-cream">
      <header className="bg-navy text-cream">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-3 gap-y-2 px-4 py-3">
          <Link to="/admin" className="mr-2 font-head text-2xl font-bold">
            MiForge FS <span className="text-base font-normal">Operator</span>
          </Link>
          <nav className="flex flex-wrap gap-1 text-[16px]" aria-label="Admin">
            <NavLink to="/admin" end className={linkCls}>Dashboard</NavLink>
            <NavLink to="/admin/clients" className={linkCls}>Clients</NavLink>
            <NavLink to="/admin/revenue" className={linkCls}>Revenue</NavLink>
            <NavLink to="/admin/templates" className={linkCls}>Templates</NavLink>
            <NavLink to="/admin/settings" className={linkCls}>Settings</NavLink>
            <NavLink to="/system" className={linkCls}>System</NavLink>
          </nav>
          <button
            type="button"
            onClick={logout}
            className="ml-auto min-h-touch rounded-btn border border-cream/50 px-3 text-cream"
          >
            Log out
          </button>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6 text-[16px] leading-normal">
        {title && <h1 className="mb-4 font-head text-3xl text-navy">{title}</h1>}
        {children}
        <p className="mt-8 text-charcoal/60">
          Operator: {mock.admin.operator_name} · local dev build ·{' '}
          <Link to="/" className="underline">client portal</Link> ·{' '}
          <Link to="/system" className="underline">system overview</Link>
        </p>
      </main>
    </div>
  );
}
