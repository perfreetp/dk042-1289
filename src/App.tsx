import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Spaces from './pages/Spaces';
import SpaceDetail from './pages/SpaceDetail';
import PromptEditor from './pages/PromptEditor';
import TestRecords from './pages/TestRecords';
import Reviews from './pages/Reviews';
import Recycle from './pages/Recycle';
import Settings from './pages/Settings';
import Admin from './pages/Admin';

function App() {
  return (
    <BrowserRouter>
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="spaces" element={<Spaces />} />
            <Route path="spaces/:spaceId" element={<SpaceDetail />} />
            <Route path="spaces/:spaceId/prompts/new" element={<PromptEditor />} />
            <Route path="spaces/:spaceId/prompts/:promptId" element={<PromptEditor />} />
            <Route path="tests" element={<TestRecords />} />
            <Route path="reviews" element={<Reviews />} />
            <Route path="recycle" element={<Recycle />} />
            <Route path="settings" element={<Settings />} />
            <Route path="admin" element={<Admin />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </AnimatePresence>
    </BrowserRouter>
  );
}

export default App;
