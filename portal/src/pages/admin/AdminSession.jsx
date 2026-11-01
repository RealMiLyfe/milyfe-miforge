import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import AdminLayout from './AdminLayout.jsx';
import { useStore } from '../../store.jsx';

const CHECKLIST = [
  'Reviewed last visit notes',
  'Checked pending follow-ups',
  'Reviewed client tools for errors',
  'Prepared templates',
  'Physical materials needed?',
];

const TOOL_CHIPS = ['Arena AI', 'Google Sheets', 'NocoDB', 'Paper Checklist', 'RustDesk', 'Other'];

const QUESTIONS = [
  ['Did the client understand everything I did?', 'If not, I need to explain differently next time.'],
  ['Did I explain WHY, not just WHAT?', 'Teaching the reason builds independence.'],
  ['Did I avoid accessing anything they didn\'t ask me to?', 'Trust is built on restraint.'],
  ['Was the client watching when I handled sensitive information?', 'Transparency prevents suspicion.'],
  ['Did I leave them more capable than I found them?', 'The goal is empowerment, not dependency.'],
  ['Can they use the tool alone, or is there a support plan?', 'Abandoning a client with a tool they can\'t use is worse than not building it.'],
  ['Is everything documented in writing?', 'Memory fades. Notes don\'t.'],
  ['Was the price fair for the value delivered?', 'This population is vulnerable to overcharging.'],
  ['Would I be comfortable if their family watched a recording of this session?', 'The gold standard of accountability.'],
  ['Did I treat this person with dignity?', 'This is the whole point.'],
];

function fmt(sec) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

export default function AdminSession() {
  const { visitId } = useParams();
  const navigate = useNavigate();
  const { mock } = useStore();

  const visit = mock.visits.find((v) => String(v.id) === String(visitId)) || mock.visits[0];
  const client = mock.clients.find((c) => c.id === visit.client_id) || mock.clients[0];

  const [tab, setTab] = useState('Before');
  const [checked, setChecked] = useState([]);
  const [seconds, setSeconds] = useState(0);
  const [savedAgo, setSavedAgo] = useState(10);
  const [offlineMock, setOfflineMock] = useState(false);
  const [asked, setAsked] = useState(visit.asked_for || '');
  const [doing, setDoing] = useState('');
  const [toolsUsed, setToolsUsed] = useState(visit.tools_used || []);
  const [jewelOpen, setJewelOpen] = useState(false);
  const [jewel, setJewel] = useState('');
  const [familyPresent, setFamilyPresent] = useState(false);
  const [familyName, setFamilyName] = useState('');
  const [answers, setAnswers] = useState(Array(QUESTIONS.length).fill(null));
  const [noNotes, setNoNotes] = useState('');
  const [done, setDone] = useState(false);
  const startRef = useRef(Date.now());

  useEffect(() => {
    const t = setInterval(() => setSeconds(Math.floor((Date.now() - startRef.current) / 1000)), 1000);
    const a = setInterval(() => setSavedAgo((s) => (s >= 10 ? 1 : s + 1)), 1000);
    return () => { clearInterval(t); clearInterval(a); };
  }, []);

  const toggleCheck = (i) =>
    setChecked((c) => (c.includes(i) ? c.filter((x) => x !== i) : [...c, i]));
  const toggleChip = (t) =>
    setToolsUsed((ts) => (ts.includes(t) ? ts.filter((x) => x !== t) : [...ts, t]));
  const setAnswer = (i, v) =>
    setAnswers((a) => a.map((x, idx) => (idx === i ? v : x)));

  const answered = answers.every((a) => a !== null);
  const allYes = answers.every((a) => a === true);
  const anyNo = answers.some((a) => a === false);

  const complete = () => {
    if (allYes) setDone('complete');
    else setDone('incomplete');
  };

  if (done) {
    return (
      <AdminLayout title="Visit saved">
        <div className={`card !p-6 ${done === 'complete' ? 'border-success' : 'border-warn'}`}>
          <p className={`font-head text-3xl font-bold ${done === 'complete' ? 'text-success' : 'text-warn'}`}>
            {done === 'complete' ? 'Visit completed.' : 'Saved as Incomplete — Review Needed.'}
          </p>
          <p className="mt-2">
            {client.full_name} · {visit.title} · {fmt(seconds)} · ethical checkpoint{' '}
            {answers.filter(Boolean).length}/10 Yes
          </p>
          {done === 'incomplete' && noNotes && <p className="mt-2">Private note saved: "{noNotes}"</p>}
          <div className="mt-4 flex flex-wrap gap-3">
            <Link to={`/admin/clients/${client.id}`} className="min-h-touch rounded-btn bg-navy px-4 py-2 font-semibold text-cream">
              Back to {client.full_name}'s profile
            </Link>
            <Link to="/admin" className="min-h-touch rounded-btn border-2 border-navy px-4 py-2 font-semibold text-navy">
              Dashboard
            </Link>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title={`Session — ${client.full_name} (${visit.title})`}>
      {/* tabs */}
      <nav className="mb-4 flex gap-1" aria-label="Session wizard">
        {['Before', 'During', 'After'].map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`min-h-touch rounded-btn px-4 py-2 font-semibold ${tab === t ? 'bg-navy text-cream' : 'border border-navy/40 text-navy'}`}
          >
            {t}
          </button>
        ))}
        <span className="ml-auto self-center font-mono text-lg font-bold text-navy" aria-live="polite">
          {fmt(seconds)}
        </span>
      </nav>

      {/* ---------------- BEFORE ---------------- */}
      {tab === 'Before' && (
        <div className="card !p-5">
          <h2 className="font-head text-2xl text-navy">Pre-session checklist</h2>
          <ul className="mt-3 space-y-2">
            {CHECKLIST.map((item, i) => (
              <li key={i}>
                <label className="flex min-h-touch items-center gap-3 text-lg">
                  <input
                    type="checkbox"
                    className="h-7 w-7 accent-rust"
                    checked={checked.includes(i)}
                    onChange={() => toggleCheck(i)}
                  />
                  {checked.includes(i) ? <s>{item}</s> : item}
                </label>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex flex-wrap gap-3 text-navy">
            <Link to={`/admin/clients/${client.id}`} className="font-semibold underline">
              Last visit's notes (client profile → Visits)
            </Link>
            <Link to={`/admin/clients/${client.id}`} className="font-semibold underline">
              Current tools (client profile → Tools)
            </Link>
          </div>
        </div>
      )}

      {/* ---------------- DURING ---------------- */}
      {tab === 'During' && (
        <div className="flex flex-col gap-4">
          <p className="text-sm text-charcoal/60">
            {offlineMock ? '⚠ Offline — notes are saved locally and will sync.' : `Saved ${savedAgo}s ago (autosave)`}
            {' '}
            <button type="button" onClick={() => setOfflineMock((o) => !o)} className="underline">
              {offlineMock ? 'dev: back online' : 'dev: simulate offline'}
            </button>
          </p>

          <div className="card !p-4">
            <label htmlFor="asked" className="mb-1 block font-bold">What they asked for</label>
            <textarea id="asked" rows="2" className="field" value={asked} onChange={(e) => setAsked(e.target.value)} />
          </div>

          <div className="card !p-4">
            <label htmlFor="doing" className="mb-1 block font-bold">What I'm doing</label>
            <textarea id="doing" rows="3" className="field" value={doing} onChange={(e) => setDoing(e.target.value)} />
          </div>

          <div className="card !p-4">
            <p className="mb-2 font-bold">Tools used</p>
            <div className="flex flex-wrap gap-2">
              {TOOL_CHIPS.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => toggleChip(t)}
                  aria-pressed={toolsUsed.includes(t)}
                  className={`min-h-touch rounded-pill px-4 py-2 font-semibold ${toolsUsed.includes(t) ? 'bg-navy text-cream' : 'border-2 border-navy/40 text-navy'}`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="card !p-4">
            <button
              type="button"
              onClick={() => setJewelOpen((o) => !o)}
              aria-expanded={jewelOpen}
              className="min-h-touch font-bold text-navy"
            >
              {jewelOpen ? '▾' : '▸'} Jewel captured — something they said worth remembering?
            </button>
            {jewelOpen && (
              <textarea
                rows="2"
                className="field mt-2"
                placeholder="Something they said worth remembering?"
                value={jewel}
                onChange={(e) => setJewel(e.target.value)}
              />
            )}
          </div>

          <div className="card !p-4">
            <label className="flex min-h-touch items-center gap-3 font-bold">
              <input
                type="checkbox"
                className="h-7 w-7 accent-rust"
                checked={familyPresent}
                onChange={(e) => setFamilyPresent(e.target.checked)}
              />
              Family present?
            </label>
            {familyPresent && (
              <input
                className="field mt-2 max-w-sm"
                placeholder="Name"
                value={familyName}
                onChange={(e) => setFamilyName(e.target.value)}
              />
            )}
          </div>
        </div>
      )}

      {/* ---------------- AFTER — ethical checkpoint ---------------- */}
      {tab === 'After' && (
        <div className="flex flex-col gap-3">
          <h2 className="font-head text-2xl text-navy">Ethical Checkpoint</h2>
          <p className="text-charcoal/70">Answer all 10 honestly. The Complete button unlocks only when every answer is Yes.</p>
          {QUESTIONS.map(([q, why], i) => (
            <div key={i} className="card !p-4">
              <p className="font-semibold">
                {i + 1}. {q}
              </p>
              <p className="text-sm text-charcoal/60">Why we ask: {why}</p>
              <div className="mt-2 flex gap-2" role="group" aria-label={`Question ${i + 1} answer`}>
                <button
                  type="button"
                  onClick={() => setAnswer(i, true)}
                  aria-pressed={answers[i] === true}
                  className={`min-h-touch rounded-btn px-5 py-2 font-bold ${answers[i] === true ? 'bg-success text-cream' : 'border-2 border-success text-success'}`}
                >
                  Yes
                </button>
                <button
                  type="button"
                  onClick={() => setAnswer(i, false)}
                  aria-pressed={answers[i] === false}
                  className={`min-h-touch rounded-btn px-5 py-2 font-bold ${answers[i] === false ? 'bg-danger text-cream' : 'border-2 border-danger text-danger'}`}
                >
                  No
                </button>
              </div>
            </div>
          ))}

          {answered && anyNo && (
            <div className="card !border-warn !p-4">
              <label htmlFor="nonotes" className="mb-1 block font-bold">What happened? Private — just so you remember.</label>
              <textarea id="nonotes" rows="3" className="field" value={noNotes} onChange={(e) => setNoNotes(e.target.value)} />
            </div>
          )}

          {answered && allYes && (
            <button type="button" onClick={complete} className="min-h-touch w-full rounded-btn bg-rust px-6 py-4 text-2xl font-bold text-cream">
              Complete Visit
            </button>
          )}
          {answered && anyNo && (
            <button type="button" onClick={complete} className="min-h-touch w-full rounded-btn bg-warn px-6 py-4 text-2xl font-bold text-cream">
              Save as Incomplete — Review Needed
            </button>
          )}
          {!answered && (
            <button type="button" disabled className="min-h-touch w-full cursor-not-allowed rounded-btn bg-charcoal/20 px-6 py-4 text-2xl font-bold text-charcoal/50">
              Complete Visit (greyed out until all 10 are Yes)
            </button>
          )}

          <p className="mt-2">
            <Link to="/admin" className="font-semibold text-navy underline">← dashboard</Link>
          </p>
        </div>
      )}
    </AdminLayout>
  );
}
