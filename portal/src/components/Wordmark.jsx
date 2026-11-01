import { Link } from 'react-router-dom';

// Tapping the wordmark returns home from anywhere.
export default function Wordmark() {
  return (
    <header class="px-4 pt-6 text-center">
      <Link to="/" class="font-head text-4xl font-bold text-navy" aria-label="MiForge home">
        MiForge
      </Link>
    </header>
  );
}
