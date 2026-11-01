import { Link } from 'react-router-dom';

// Full class names in this lookup so Tailwind's JIT picks them up.
const TILE_STYLES = {
  rust: 'bg-rust text-cream',
  navy: 'bg-navy text-cream',
  olive: 'bg-olive text-cream',
  blue: 'bg-blue text-cream',
  gold: 'bg-gold text-charcoal',
  purple: 'bg-purple text-cream',
};

export default function Tile({ color, icon, label, to, external }) {
  const cls = `tile ${TILE_STYLES[color] || TILE_STYLES.navy}`;
  const inner = (
    <>
      <span class="text-6xl" aria-hidden="true">{icon}</span>
      <span class="tile-label">{label}</span>
    </>
  );
  if (external) {
    return (
      <a href={to} className={cls} aria-label={label}>
        {inner}
      </a>
    );
  }
  return (
    <Link to={to} className={cls} aria-label={label}>
      {inner}
    </Link>
  );
}
