/** @type {import('tailwindcss').Config} */
// ============================================================================
// MiForge design tokens (shared verbatim with portal/tailwind.config.js).
// ============================================================================
export default {
  content: ['./src/**/*.{astro,html,js,jsx,ts,tsx,md,mdx}'],
  theme: {
    extend: {
      colors: {
        // MiLyfe brand palette - source of truth: RealMiLyfe/MiLyfe-Platform-OS
        // (tailwind.config.ts + globals.css harbor/teal/mly scales). The logo
        // wordmark (public/logo.png) is a harbor->teal gradient. See docs/brand.md.
        navy: '#1E3A6E',      // harbor-800 - primary, headlines, structure
        cream: '#F5F0E8',     // all backgrounds - NO pure white (warm paper; MiLyfe surface-light is #FAFBFC)
        rust: '#006558',      // teal-900 - single accent, primary CTA only, one per screen (AA-safe teal)
        charcoal: '#2A2A2A',  // body text - NO pure black
        olive: '#00C1AE',     // teal-500 - Call tile (dark text on this one, see Tile.jsx)
        blue: '#5B87BF',      // harbor-400 - Visit tile
        gold: '#FFC107',      // mly-500 - Screen Share tile (dark text on this one)
        purple: '#3664A2',    // harbor-600 - Family tile
        success: '#4A7C59',
        warn: '#C4872A',
        danger: '#B34040',
      },
      fontFamily: {
        // Local/offline: system stacks that approximate the production fonts.
        // PRODUCTION: load Lora (headings) and Inter (body) e.g. via Google
        // Fonts <link> in Layout.astro, then swap these stacks to
        // ['Lora', 'Georgia', 'serif'] and ['Inter', 'system-ui', 'sans-serif'].
        head: ['Georgia', '"Times New Roman"', 'serif'],
        body: ['system-ui', '-apple-system', '"Segoe UI"', 'sans-serif'],
      },
      borderRadius: {
        card: '12px',
        btn: '6px',
        pill: '999px',
      },
      boxShadow: {
        elev1: '0 2px 8px rgba(0,0,0,0.08)', // subtle only
      },
      minHeight: {
        touch: '56px', // touch target minimum
      },
      maxWidth: {
        measure: '65ch', // max line length
      },
    },
  },
  plugins: [],
};
