import { useState } from 'react';
import { Link } from 'react-router-dom';
import Wordmark from '../components/Wordmark.jsx';
import { useStore } from '../store.jsx';

export default function Account() {
  const { mock, client } = useStore();
  const [dl, setDl] = useState('idle'); // idle | preparing | ready
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleteSent, setDeleteSent] = useState(false);

  const download = () => {
    setDl('preparing');
    setTimeout(() => {
      // mock "download": hand over the mock JSON as the client's data file
      const blob = new Blob([JSON.stringify(mock, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `miforge-${client.full_name.toLowerCase().replace(/[^a-z]+/g, '-')}-data.json`;
      a.click();
      URL.revokeObjectURL(url);
      setDl('ready');
    }, 1500);
  };

  return (
    <main className="min-h-screen bg-cream px-6 pb-10">
      <Wordmark />
      <div className="mx-auto mt-8 w-full max-w-2xl">
        <h1 className="text-4xl">My Account</h1>
        <p className="mt-2 text-2xl">{client.full_name} · {client.email}</p>

        <div className="mt-8 space-y-4">
          <button type="button" onClick={download} className="btn-navy w-full" disabled={dl === 'preparing'}>
            {dl === 'preparing' ? 'Preparing your file...' : dl === 'ready' ? 'Download ready ✓' : 'Download all my information'}
          </button>

          <button
            type="button"
            onClick={() => setConfirmDelete(true)}
            className="min-h-touch w-full rounded-btn border-2 border-danger bg-cream px-6 py-3 text-left text-[22px] font-semibold text-danger"
          >
            Delete my account and data
          </button>

          {confirmDelete && !deleteSent && (
            <div className="card border-danger" role="alert">
              <p className="text-[22px] font-semibold">
                This will send a request to John. He'll call you to confirm before anything is
                deleted. Are you sure?
              </p>
              <div className="mt-4 flex gap-4">
                <button
                  type="button"
                  onClick={() => { setDeleteSent(true); setConfirmDelete(false); }}
                  className="btn flex-1 bg-danger text-[24px] text-cream"
                >
                  Yes
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmDelete(false)}
                  className="btn flex-1 border-2 border-navy text-[24px] text-navy"
                >
                  No
                </button>
              </div>
            </div>
          )}

          {deleteSent && (
            <div className="card border-success" role="status">
              <p className="text-[22px] font-semibold text-success">
                Request sent. John will call you to confirm before anything is deleted.
              </p>
            </div>
          )}
        </div>

        <p className="mt-10">
          <Link to="/" className="text-xl font-semibold text-navy underline">Back to Home</Link>
        </p>
      </div>
    </main>
  );
}
