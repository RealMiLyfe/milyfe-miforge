import { createContext, useContext, useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { StoreProvider } from './store.jsx';
import Login from './pages/Login.jsx';
import LoginSent from './pages/LoginSent.jsx';
import Home from './pages/Home.jsx';
import Messages from './pages/Messages.jsx';
import Tools from './pages/Tools.jsx';
import Visits from './pages/Visits.jsx';
import ScreenShare from './pages/ScreenShare.jsx';
import ScreenShareActive from './pages/ScreenShareActive.jsx';
import ScreenShareEnded from './pages/ScreenShareEnded.jsx';
import Family from './pages/Family.jsx';
import FamilyAdd from './pages/FamilyAdd.jsx';
import Account from './pages/Account.jsx';
import OfflineScreen from './components/OfflineScreen.jsx';

// Online/offline state. Real events + a dev toggle (on the login page)
// so the offline screen can be previewed without pulling the cable.
const OnlineContext = createContext(null);
export const useOnline = () => useContext(OnlineContext);

export default function App() {
  const [offline, setOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const on = () => setOffline(false);
    const off = () => setOffline(true);
    window.addEventListener('online', on);
    window.addEventListener('offline', off);
    return () => {
      window.removeEventListener('online', on);
      window.removeEventListener('offline', off);
    };
  }, []);

  return (
    <OnlineContext.Provider value={{ offline, setOffline }}>
      <StoreProvider>
        <BrowserRouter>
          {offline ? (
            <OfflineScreen />
          ) : (
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/login-sent" element={<LoginSent />} />
              <Route path="/" element={<Home />} />
              <Route path="/messages" element={<Messages />} />
              <Route path="/tools" element={<Tools />} />
              <Route path="/visits" element={<Visits />} />
              <Route path="/screen-share" element={<ScreenShare />} />
              <Route path="/screen-share/active" element={<ScreenShareActive />} />
              <Route path="/screen-share/ended" element={<ScreenShareEnded />} />
              <Route path="/family" element={<Family />} />
              <Route path="/family/add" element={<FamilyAdd />} />
              <Route path="/account" element={<Account />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          )}
        </BrowserRouter>
      </StoreProvider>
    </OnlineContext.Provider>
  );
}
