import { createContext, useContext, useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { StoreProvider, useStore } from './store.jsx';
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
import DemoBanner from './components/DemoBanner.jsx';

// ---- Phase 3: operator admin ----
import AdminLogin from './pages/admin/AdminLogin.jsx';
import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import AdminClients from './pages/admin/AdminClients.jsx';
import AdminClientProfile from './pages/admin/AdminClientProfile.jsx';
import AdminSession from './pages/admin/AdminSession.jsx';
import AdminRevenue from './pages/admin/AdminRevenue.jsx';
import AdminTemplates from './pages/admin/AdminTemplates.jsx';
import AdminSettings from './pages/admin/AdminSettings.jsx';

// ---- Phase 3: family portal (what relatives see) ----
import FamilyLogin from './pages/family/FamilyLogin.jsx';
import FamilyHome from './pages/family/FamilyHome.jsx';
import FamilyConcern from './pages/family/FamilyConcern.jsx';

// ---- Phase 3: system overview ----
import SystemArch from './pages/system/SystemArch.jsx';
import SystemFlow from './pages/system/SystemFlow.jsx';
import SystemMemory from './pages/system/SystemMemory.jsx';
import SystemChecklist from './pages/system/SystemChecklist.jsx';

// Online/offline state. Real events + a dev toggle (on the login page)
// so the offline screen can be previewed without pulling the cable.
const OnlineContext = createContext(null);
export const useOnline = () => useContext(OnlineContext);

// Mock auth gates (local dev only).
function AdminGate({ children }) {
  const { adminAuthed } = useStore();
  return adminAuthed ? children : <Navigate to="/admin/login" replace />;
}
function FamilyGate({ children }) {
  const { familySession } = useStore();
  return familySession ? children : <Navigate to="/family/login" replace />;
}

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
          <DemoBanner />
          {offline ? (
            <OfflineScreen />
          ) : (
            <Routes>
              {/* client portal */}
              <Route path="/login" element={<Login />} />
              <Route path="/login-sent" element={<LoginSent />} />
              <Route path="/" element={<Home />} />
              <Route path="/messages" element={<Messages />} />
              <Route path="/tools" element={<Tools />} />
              <Route path="/visits" element={<Visits />} />
              <Route path="/screen-share" element={<ScreenShare />} />
              <Route path="/screen-share/active" element={<ScreenShareActive />} />
              <Route path="/screen-share/ended" element={<ScreenShareEnded />} />
              <Route path="/family/manage" element={<Family />} />
              <Route path="/family/manage/add" element={<FamilyAdd />} />
              <Route path="/account" element={<Account />} />

              {/* family portal (relatives) */}
              <Route path="/family/login" element={<FamilyLogin />} />
              <Route path="/family" element={<FamilyGate><FamilyHome /></FamilyGate>} />
              <Route path="/family/concern" element={<FamilyConcern />} />

              {/* operator admin */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin" element={<AdminGate><AdminDashboard /></AdminGate>} />
              <Route path="/admin/clients" element={<AdminGate><AdminClients /></AdminGate>} />
              <Route path="/admin/clients/:id" element={<AdminGate><AdminClientProfile /></AdminGate>} />
              <Route path="/admin/session/:visitId" element={<AdminGate><AdminSession /></AdminGate>} />
              <Route path="/admin/revenue" element={<AdminGate><AdminRevenue /></AdminGate>} />
              <Route path="/admin/templates" element={<AdminGate><AdminTemplates /></AdminGate>} />
              <Route path="/admin/settings" element={<AdminGate><AdminSettings /></AdminGate>} />

              {/* system overview */}
              <Route path="/system" element={<SystemArch />} />
              <Route path="/system/flow" element={<SystemFlow />} />
              <Route path="/system/memory" element={<SystemMemory />} />
              <Route path="/system/checklist" element={<SystemChecklist />} />

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          )}
        </BrowserRouter>
      </StoreProvider>
    </OnlineContext.Provider>
  );
}
