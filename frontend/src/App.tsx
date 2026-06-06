
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';

// Placeholder pages
import { Dashboard } from "./pages/Dashboard";
import { Upload } from "./pages/Upload";
import { Sheets } from "./pages/Sheets";
import { Analytics } from "./pages/Analytics";
import { Reports } from "./pages/Reports";
import { Settings } from "./pages/Settings";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="upload" element={<Upload />} />
          <Route path="sheets" element={<Sheets />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="reports" element={<Reports />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
