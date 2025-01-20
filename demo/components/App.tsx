import { HashRouter, Route, Routes } from 'react-router-dom';

import { CameraProvider } from '../contexts/cameraContext.provider.js';

import Filters from './Filters.js';
import Home from './Home.js';

export default function App() {
  return (
    <CameraProvider>
      <HashRouter>
        <Routes>
          <Route path="/filters" element={<Filters />} />
          <Route path="/" element={<Home />} />
        </Routes>
      </HashRouter>
    </CameraProvider>
  );
}
