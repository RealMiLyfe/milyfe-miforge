/** @type {import('tailwindcss').Config} */
// ============================================================================
// MiForge design tokens (shared verbatim with portal/tailwind.config.js).
// ============================================================================
export default {
  content: ['./src/**/*.{astro,html,js,jsx,ts,tsx,md,mdx}'],
  theme: {
    extend: {
      colors: {
        navy: '#1B3A5C',      // primary, headlines, structure
        cream: '#F5F0E8',     // all backgrounds - NO pure white
        rust: '#C65D3B',      // single accent - primary CTA only, one per screen
        charcoal: '#2A2A2A',  // body text - NO pure black
        olive: '#7A8B5C',     // Call tile
        blue: '#6B8CA6',      // Visit tile
        gold: '#D4A24C',      // Screen Share tile
        purple: '#8B7AA6',    // Family tile
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
