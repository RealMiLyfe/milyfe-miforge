import { Link } from 'react-router-dom';

// Tapping the wordmark returns home from anywhere.
// MiLyfe mark + "MiForge Founder Services" name (service brand; MiForge OS itself
// is the separate white-labelable platform in the MiLyfe economy).
export default function Wordmark() {
  return (
    <header class="px-4 pt-6 text-center">
      <Link to="/" class="inline-flex flex-col items-center gap-1" aria-label="MiForge Founder Services — home">
        <img src="/logo.png" alt="MiLyfe" class="h-12 w-auto" />
        <span class="font-head text-2xl font-bold text-navy">
          MiForge <span class="text-lg font-normal">Founder Services</span>
        </span>
      </Link>
    </header>
  );
}
