import { createContext, useContext, useState } from 'react';
import mock from './data/mock.json';

// Tiny local store over the mock JSON. No backend - state lives in memory.
const StoreContext = createContext(null);

export function StoreProvider({ children }) {
  const defaultId = mock.meta.default_client_id;
  const client = mock.clients.find((c) => c.id === defaultId);
  const [family, setFamily] = useState(mock.family.filter((f) => f.client_id === defaultId));
  const [messages, setMessages] = useState(mock.messages.filter((m) => m.client_id === defaultId));
  const [visits] = useState(mock.visits.filter((v) => v.client_id === defaultId));
  const [tools] = useState(mock.tools.filter((t) => t.client_id === defaultId));
  const [invoices] = useState(mock.invoices);
  const [jewels] = useState(mock.jewels.filter((j) => j.client_id === defaultId));

  return (
    <StoreContext.Provider
      value={{ mock, client, family, setFamily, messages, setMessages, visits, tools, invoices, jewels }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export const useStore = () => useContext(StoreContext);

export const ROLES = [
  { value: 'Full View', label: 'Full View', desc: 'They can see everything: visits, tools, invoices.' },
  { value: 'Limited View', label: 'Limited View', desc: 'They can see visit dates and summaries only.' },
  {
    value: 'Decision Partner',
    label: 'Decision Partner',
    desc: 'They can see everything AND we check with them before any project over $300.',
  },
  { value: 'No Access', label: 'No Access', desc: "They can't see anything. Same as removing them." },
];
