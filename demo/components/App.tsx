import { HashRouter, Route, Routes } from 'react-router-dom';

import { CameraProvider } from '../contexts/cameraContext';

import Filters from './Filters';
import Home from './Home';

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
