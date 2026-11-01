import Wordmark from '../components/Wordmark.jsx';
import Tile from '../components/Tile.jsx';
import WelcomeOverlay from '../components/WelcomeOverlay.jsx';
import { useStore } from '../store.jsx';
import { Link } from 'react-router-dom';

const TILES = [
  { color: 'rust', icon: '📞', label: 'Call MiForge', to: 'tel:9045620544', external: true },
  { color: 'navy', icon: '💬', label: 'Message Us', to: '/messages' },
  { color: 'olive', icon: '🔧', label: 'My Tools', to: '/tools' },
  { color: 'blue', icon: '📅', label: 'Next Visit', to: '/visits' },
  { color: 'gold', icon: '🖥️', label: 'Share My Screen', to: '/screen-share' },
  { color: 'purple', icon: '❤️', label: 'Family Access', to: '/family/manage' },
];

export default function Home() {
  const { client, mock } = useStore();
  const op = mock.meta.operator;

  return (
    <main className="min-h-screen bg-cream pb-10">
      <Wordmark />
      <WelcomeOverlay />

      <h1 className="mt-8 px-6 text-center text-4xl">Hello, {client.full_name}.</h1>

      {/* 2x3 grid of 200x200px tiles */}
      <div className="mx-auto mt-8 grid max-w-2xl grid-cols-2 gap-4 px-6 sm:grid-cols-3">
        {TILES.map((t) => (
          <Tile key={t.label} {...t} />
        ))}
      </div>

      {/* footer only - no nav bar, no hamburger, no settings, no notifications */}
      <footer className="mt-12 flex flex-col items-center gap-3 px-6 text-center text-lg text-charcoal/70">
        <p>
          <a href={op.tel} className="font-semibold text-navy underline">
            Call {op.phone}
          </a>
          {' · '}
          <Link to="/account" className="font-semibold text-navy underline">
            My Account
          </Link>
        </p>
      </footer>
    </main>
  );
}
