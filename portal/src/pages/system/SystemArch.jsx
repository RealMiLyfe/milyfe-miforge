import SystemNav from './SystemNav.jsx';
import { useStore } from '../../store.jsx';

// Interactive SVG architecture diagram. Color code:
//   green = traffic, blue = data, red = backup, grey dashed = RustDesk (raw ports),
//   yellow dashed = Arena AI layer (Phase H).
export default function SystemArch() {
  const { mock } = useStore();
  const apps = mock.system.containers.filter((c) => c !== 'backup' && !['postgres', 'mariadb', 'redis', 'caddy'].includes(c));
  const dbs = ['postgres', 'mariadb', 'redis'];

  const box = (x, y, w, h, fill, stroke, label, sub, dash = '', textFill = '#2A2A2A') => (
    <g key={label}>
      <rect x={x} y={y} width={w} height={h} rx="10" fill={fill} stroke={stroke} strokeWidth="1.5" strokeDasharray={dash} />
      <text x={x + w / 2} y={y + (sub ? h / 2 - 2 : h / 2 + 5)} textAnchor="middle" fontSize="13" fontWeight="bold" fill={textFill}>{label}</text>
      {sub && <text x={x + w / 2} y={y + h / 2 + 14} textAnchor="middle" fontSize="11" fill={textFill}>{sub}</text>}
    </g>
  );

  return (
    <SystemNav title="System Architecture">
      <p className="mb-4 max-w-measure text-charcoal/80">
        Everything runs on one Oracle VM. Caddy is the gateway; two Docker networks separate edge
        traffic from data. Cloudflare fronts the public site/portal in production. Backups go to
        Backblaze B2. RustDesk (screen sharing) deliberately bypasses Caddy and Cloudflare — the
        "grey cloud", raw ports. The Arena AI layer is Phase H.
      </p>

      <div className="overflow-x-auto rounded-card border border-navy/30 bg-cream p-2 shadow-elev1">
        <svg viewBox="0 0 1000 660" className="min-w-[900px] w-full" role="img" aria-label="MiForge Founder Services architecture diagram">
          <defs>
            <marker id="arrow-green" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#4A7C59" />
            </marker>
            <marker id="arrow-blue" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#5B87BF" />
            </marker>
            <marker id="arrow-red" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#B34040" />
            </marker>
            <marker id="arrow-grey" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#8a8a8a" />
            </marker>
            <marker id="arrow-yellow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#FFC107" />
            </marker>
          </defs>

          {/* client devices */}
          {box(30, 250, 170, 110, '#F5F0E8', '#1E3A6E', 'Client devices', 'operator laptop · phones')}

          {/* Cloudflare DNS + Pages */}
          {box(380, 20, 240, 44, '#F5F0E8', '#FFC107', 'Cloudflare DNS', 'miforgefs.milyfe.fun')}
          {box(680, 20, 290, 64, '#F5F0E8', '#FFC107', 'Cloudflare Pages', 'marketing site/ + portal/')}

          {/* Oracle VM */}
          <rect x="300" y="110" width="460" height="480" rx="16" fill="#F5F0E8" stroke="#1E3A6E" strokeWidth="2.5" />
          <text x="530" y="134" textAnchor="middle" fontSize="15" fontWeight="bold" fill="#1E3A6E">Oracle VM — Docker Compose (14 containers)</text>

          {/* Caddy gateway */}
          {box(340, 148, 380, 36, '#1E3A6E', '#1E3A6E', 'Caddy — gateway (80/443)', '', '', '#F5F0E8')}

          {/* edge network zone */}
          <rect x="320" y="196" width="420" height="204" rx="12" fill="none" stroke="#4A7C59" strokeWidth="1.5" strokeDasharray="6 4" />
          <text x="330" y="212" fontSize="11" fontWeight="bold" fill="#4A7C59">edge network</text>
          {apps.map((a, i) => {
            const col = i % 3, row = Math.floor(i / 3);
            return box(330 + col * 140, 224 + row * 42, 130, 32, '#1E3A6E', '#1E3A6E', a, '', '', '#F5F0E8');
          })}
          {box(610, 224 + 3 * 42, 130, 32, '#B34040', '#B34040', 'backup', '', '', '#F5F0E8')}

          {/* data network zone */}
          <rect x="320" y="412" width="420" height="86" rx="12" fill="none" stroke="#5B87BF" strokeWidth="1.5" strokeDasharray="6 4" />
          <text x="330" y="428" fontSize="11" fontWeight="bold" fill="#5B87BF">data network</text>
          {dbs.map((d, i) => box(330 + i * 140, 438, 130, 32, '#5B87BF', '#5B87BF', d, '', '', '#F5F0E8'))}

          {/* Backblaze B2 */}
          {box(820, 470, 160, 56, '#F5F0E8', '#B34040', 'Backblaze B2', 'encrypted backups')}

          {/* RustDesk */}
          {box(30, 420, 170, 56, '#F5F0E8', '#8a8a8a', 'RustDesk relay', 'grey cloud, raw ports', '5 4')}

          {/* Arena AI Phase H */}
          {box(680, 300, 290, 56, '#F5F0E8', '#FFC107', 'Arena AI layer', 'Phase H — after launch', '6 4')}

          {/* arrows: traffic (green) */}
          <line x1="200" y1="280" x2="380" y2="52" stroke="#4A7C59" strokeWidth="2.5" markerEnd="url(#arrow-green)" />
          <text x="240" y="150" fontSize="11" fill="#4A7C59" fontWeight="bold">traffic</text>
          <line x1="620" y1="42" x2="680" y2="50" stroke="#4A7C59" strokeWidth="2.5" markerEnd="url(#arrow-green)" />
          <line x1="820" y1="84" x2="560" y2="148" stroke="#4A7C59" strokeWidth="2.5" markerEnd="url(#arrow-green)" />
          <text x="640" y="120" fontSize="11" fill="#4A7C59" fontWeight="bold">prod: Pages → Caddy</text>
          <line x1="200" y1="330" x2="340" y2="180" stroke="#4A7C59" strokeWidth="2.5" strokeDasharray="8 4" markerEnd="url(#arrow-green)" />
          <text x="215" y="270" fontSize="11" fill="#4A7C59" fontWeight="bold">local: localhost ports</text>

          {/* arrows: data (blue) */}
          <line x1="530" y1="184" x2="530" y2="224" stroke="#5B87BF" strokeWidth="2.5" markerEnd="url(#arrow-blue)" />
          <text x="540" y="208" fontSize="11" fill="#5B87BF" fontWeight="bold">data</text>
          <line x1="530" y1="400" x2="530" y2="438" stroke="#5B87BF" strokeWidth="2.5" markerEnd="url(#arrow-blue)" />

          {/* arrows: backup (red) */}
          <path d="M 460 470 L 620 470 L 675 288 L 820 498" fill="none" stroke="#B34040" strokeWidth="2.5" markerEnd="url(#arrow-red)" />
          <text x="640" y="440" fontSize="11" fill="#B34040" fontWeight="bold">backup: DB → backup script → encrypt → B2</text>

          {/* arrow: RustDesk direct (grey dashed, bypasses everything) */}
          <path d="M 115 420 L 115 500 L 340 500 L 340 400" fill="none" stroke="#8a8a8a" strokeWidth="2.5" strokeDasharray="6 4" markerEnd="url(#arrow-grey)" />
          <text x="130" y="520" fontSize="11" fill="#8a8a8a" fontWeight="bold">RustDesk screen share — direct, bypasses Caddy + Cloudflare</text>

          {/* arrow: Arena AI (yellow dashed) */}
          <line x1="680" y1="328" x2="760" y2="328" stroke="#FFC107" strokeWidth="2.5" strokeDasharray="6 4" markerEnd="url(#arrow-yellow)" />
          <line x1="760" y1="328" x2="760" y2="400" stroke="#FFC107" strokeWidth="2.5" strokeDasharray="6 4" />
          <line x1="760" y1="400" x2="700" y2="430" stroke="#FFC107" strokeWidth="2.5" strokeDasharray="6 4" markerEnd="url(#arrow-yellow)" />

          {/* legend */}
          <g fontSize="12">
            <line x1="30" y1="600" x2="60" y2="600" stroke="#4A7C59" strokeWidth="3" /><text x="66" y="604" fill="#2A2A2A">traffic</text>
            <line x1="140" y1="600" x2="170" y2="600" stroke="#5B87BF" strokeWidth="3" /><text x="176" y="604" fill="#2A2A2A">data</text>
            <line x1="230" y1="600" x2="260" y2="600" stroke="#B34040" strokeWidth="3" /><text x="266" y="604" fill="#2A2A2A">backup</text>
            <line x1="330" y1="600" x2="360" y2="600" stroke="#8a8a8a" strokeWidth="3" strokeDasharray="5 3" /><text x="366" y="604" fill="#2A2A2A">RustDesk (raw ports)</text>
            <line x1="520" y1="600" x2="550" y2="600" stroke="#FFC107" strokeWidth="3" strokeDasharray="5 3" /><text x="556" y="604" fill="#2A2A2A">Arena AI (Phase H)</text>
          </g>
        </svg>
      </div>

      <p className="mt-4 text-charcoal/70">
        Local demo note: in this laptop stack there is no Cloudflare or B2 — Caddy serves
        localhost directly and the backup container only logs. The boxes above show the
        production shape you deploy to the Oracle VM.
      </p>
    </SystemNav>
  );
}
