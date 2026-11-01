import { useState } from 'react';
import { Link } from 'react-router-dom';
import Wordmark from '../components/Wordmark.jsx';
import { useStore } from '../store.jsx';

export default function Messages() {
  const { messages, setMessages, client } = useStore();
  const [draft, setDraft] = useState('');

  const send = (e) => {
    e.preventDefault();
    if (!draft.trim()) return;
    setMessages((msgs) => [
      ...msgs,
      {
        id: Date.now(),
        client_id: client.id,
        from: client.full_name,
        to: 'Carnell',
        date: new Date().toISOString().slice(0, 10),
        text: draft.trim(),
      },
    ]);
    setDraft('');
  };

  return (
    <main className="flex min-h-screen flex-col bg-cream">
      <Wordmark />
      <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-6 pb-6 pt-8">
        <h1 className="text-4xl">Message Us</h1>
        <p className="mt-2 text-lg text-charcoal/70">
          Send us a message any time. We usually reply the same day.
        </p>

        {/* timeline */}
        <div className="mt-6 flex flex-1 flex-col gap-4" aria-live="polite">
          {messages.length === 0 && (
            <p className="measure text-2xl text-charcoal/70">
              Send us a message any time. We usually reply the same day.
            </p>
          )}
          {messages.map((m) => {
            const mine = m.from === client.full_name;
            return (
              <div key={m.id} className={`max-w-[85%] rounded-card p-4 shadow-elev1 ${mine ? 'self-end bg-navy text-cream' : 'self-start bg-cream border border-navy/30'}`}>
                <p className="text-lg font-bold">{m.from} · {m.date}</p>
                <p className="text-[22px]">{m.text}</p>
              </div>
            );
          })}
        </div>

        {/* composer */}
        <form onSubmit={send} className="mt-6 flex flex-col gap-3">
          <label htmlFor="msg" className="sr-only">Type a message</label>
          <textarea
            id="msg"
            className="field"
            rows="3"
            placeholder="Type a message"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
          />
          <button type="submit" className="btn-rust w-full">Send</button>
        </form>

        <p className="mt-6 text-center">
          <Link to="/" className="text-xl font-semibold text-navy underline">Back to Home</Link>
        </p>
      </div>
    </main>
  );
}
